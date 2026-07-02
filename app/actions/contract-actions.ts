"use server"

/**
 * app/actions/contract-actions.ts
 *
 * Server Actions transaccionales y atómicas para el Motor LegalTech.
 * Cada mutación valida JWT vía NextAuth v5, verifica rol, y ejecuta
 * dentro de prisma.$transaction para garantizar atomicidad.
 *
 * Seguridad Zero-Trust: ninguna acción confía en datos del cliente.
 * El userId siempre se extrae del token JWT, nunca del body.
 */

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Prisma, AuditAction, ContractStatus, KYCStatus, PropertyStatus, Role, PaymentStatus, Currency } from "@prisma/client"
import { hasLandlordRole } from "@/lib/permissions"
import {
  sendContractSentEmail,
  sendContractSignedByTenantEmail,
  sendContractActiveEmail,
} from "@/lib/email"
import {
  ContractConcurrencyError,
  ContractStateError,
  InvalidSignatureError,
  UnauthorizedLegalActionError,
  isKnownLegalError,
  type SerializedError,
} from "@/lib/exceptions/contract-errors"
import { createDocumentHash, generatePeruvianLeaseAgreement } from "@/lib/services/contract-engine"
import { createNotificationHelper } from "@/lib/notifications"
import {
  waSendContratoEnviado,
  waSendInquilinoFirmo,
  waSendContratoActivo,
} from "@/lib/whatsapp"

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de retorno de Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: SerializedError
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidad: extraer IP y User-Agent de los headers de Next.js
// ─────────────────────────────────────────────────────────────────────────────

async function extractRequestMetadata(): Promise<{
  ipAddress: string
  userAgent: string
}> {
  const headersList = await headers()

  // Prioridad: x-forwarded-for (proxy/CDN) → x-real-ip → fallback
  const forwardedFor = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "IP_DESCONOCIDA"

  const userAgent =
    headersList.get("user-agent") ?? "USER_AGENT_DESCONOCIDO"

  return { ipAddress, userAgent }
}

// ─────────────────────────────────────────────────────────────────────────────
// signContractAsTenant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Firma el contrato como INQUILINO (TENANT).
 *
 * Flujo:
 * 1. Valida sesión JWT y rol TENANT.
 * 2. Extrae IP y User-Agent de los headers HTTP.
 * 3. Dentro de prisma.$transaction:
 *    a. Verifica que el contrato existe y pertenece al tenant autenticado.
 *    b. Verifica que el estado es DRAFT o PENDING_TENANT.
 *    c. Verifica que el tenant no haya firmado ya (idempotencia).
 *    d. Inserta AuditLog con hash criptográfico del documento.
 *    e. Actualiza contrato: tenantSignedAt + status → PENDING_LANDLORD.
 * 4. Revalida el path del dashboard del tenant.
 */
export async function signContractAsTenant(
  contractId: string,
): Promise<ActionResult<{ contractId: string; status: ContractStatus }>> {
  try {
    // ── 1. Autenticación y autorización ──────────────────────────────────────
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(
        null,
        "signContractAsTenant",
        Role.TENANT,
      )
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (userRole !== Role.TENANT) {
      throw new UnauthorizedLegalActionError(
        userId,
        "signContractAsTenant",
        Role.TENANT,
      )
    }

    // ── 2. Verificar KYC del inquilino ──────────────────────────────────────────
    const kyc = await prisma.kYCVerification.findUnique({
      where: { userId },
      select: { status: true },
    })
    if (!kyc || kyc.status !== KYCStatus.APROBADO) {
      return {
        success: false,
        error: {
          code: "KYC_REQUIRED",
          message: "Debes completar la verificación KYC antes de firmar un contrato.",
          statusHint: 403,
        },
      }
    }

    // ── 3. Metadatos de la solicitud ─────────────────────────────────────────
    const { ipAddress, userAgent } = await extractRequestMetadata()

    // ── 4. Transacción atómica ────────────────────────────────────────────────
    const updatedContract = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 3a. Obtener contrato con bloqueo de lectura
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        select: {
          id: true,
          tenantId: true,
          landlordId: true,
          status: true,
          documentHash: true,
          tenantSignedAt: true,
        },
      })

      if (!contract) {
        throw new ContractStateError(
          contractId,
          "NOT_FOUND",
          "signContractAsTenant",
        )
      }

      // 3b. Verificar titularidad: solo el tenant del contrato puede firmar
      if (contract.tenantId !== userId) {
        throw new UnauthorizedLegalActionError(
          userId,
          "signContractAsTenant — no es el tenant de este contrato",
        )
      }

      // 3c. Verificar estado válido para firma del tenant
      const validStates: ContractStatus[] = [
        ContractStatus.PENDING_TENANT,
      ]
      if (!validStates.includes(contract.status)) {
        throw new ContractStateError(
          contractId,
          contract.status,
          "signContractAsTenant",
        )
      }

      // 3d. Idempotencia: si ya firmó, lanzar error específico
      if (contract.tenantSignedAt !== null) {
        throw new InvalidSignatureError(contractId, "ALREADY_SIGNED")
      }

      // 3e. Verificar que existe el hash del documento (debe haberse generado al crear el contrato)
      if (!contract.documentHash) {
        throw new InvalidSignatureError(contractId, "DOCUMENT_NOT_FOUND")
      }

      // 3f. Insertar AuditLog criptográfico (Clickwrap — Ley 30201)
      await tx.auditLog.create({
        data: {
          contractId,
          userId,
          action: AuditAction.SIGNED_TENANT,
          ipAddress,
          userAgent,
          // El cryptoHash del AuditLog es el hash del documento que vio el usuario
          cryptoHash: contract.documentHash,
          // timestamp se genera automáticamente en UTC por Prisma/PostgreSQL
        },
      })

      // 3g. Actualizar contrato: firma del tenant + transición de estado
      const updated = await tx.contract.update({
        where: { id: contractId },
        data: {
          tenantSignedAt: new Date(),
          status: ContractStatus.PENDING_LANDLORD,
        },
        select: { id: true, status: true },
      })

      // Notificar al arrendador que el inquilino firmó el borrador del contrato
      await createNotificationHelper(
        contract.landlordId,
        "CONTRACT_SIGN",
        "Contrato firmado por el inquilino",
        "El inquilino ha firmado el borrador del contrato. Su contrafirma es requerida para activarlo.",
        { contractId: contract.id },
        tx
      )

      return updated
    })

    // ── 4. Revalidar cache del dashboard del tenant ───────────────────────────
    revalidatePath("/tenant/dashboard")

    // ── 5. Notificar al arrendador por email + WhatsApp (non-blocking) ──────────────────
    prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        landlord: { select: { email: true, firstName: true, lastName: true, phone: true } },
        property: { select: { title: true } },
      },
    }).then(c => {
      if (c) {
        sendContractSignedByTenantEmail(
          c.landlord.email,
          `${c.landlord.firstName} ${c.landlord.lastName}`,
          c.property.title,
          contractId,
        ).catch(() => {})
        if (c.landlord.phone) {
          waSendInquilinoFirmo(
            c.landlord.phone,
            `${c.landlord.firstName} ${c.landlord.lastName}`,
            c.property.title,
            `${process.env.NEXT_PUBLIC_URL ?? "https://habitaperu.pe"}/contracts/${contractId}`,
          ).catch(() => {})
        }
      }
    }).catch(() => {})

    return {
      success: true,
      data: {
        contractId: updatedContract.id,
        status: updatedContract.status,
      },
    }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[signContractAsTenant] Error inesperado:", error)
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Ocurrió un error interno. Por favor, intente nuevamente.",
        statusHint: 500,
      },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// counterSignAsLandlord
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Contrafirma el contrato como ARRENDADOR (LANDLORD) y activa el contrato.
 *
 * Flujo:
 * 1. Valida sesión JWT y rol LANDLORD.
 * 2. Extrae IP y User-Agent.
 * 3. Dentro de prisma.$transaction:
 *    a. Verifica contrato en estado PENDING_LANDLORD y titularidad.
 *    b. Idempotencia: verifica que el landlord no haya firmado ya.
 *    c. Obtiene la Property vinculada con su version actual.
 *    d. OPTIMISTIC CONCURRENCY CONTROL: actualiza Property a OCUPADA
 *       solo si version == version_leída. Si no coincide → ContractConcurrencyError.
 *    e. Inserta AuditLog de contrafirma.
 *    f. Actualiza contrato: landlordSignedAt + status → ACTIVE.
 * 4. Revalida tag 'property-status' para invalidar caches de listados.
 */
export async function counterSignAsLandlord(
  contractId: string,
): Promise<ActionResult<{ contractId: string; status: ContractStatus }>> {
  try {
    // ── 1. Autenticación y autorización ──────────────────────────────────────
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(
        null,
        "counterSignAsLandlord",
        Role.LANDLORD,
      )
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (!hasLandlordRole(session.user) && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(
        userId,
        "counterSignAsLandlord",
        Role.LANDLORD,
      )
    }

    // ── 2. Metadatos de la solicitud ─────────────────────────────────────────
    const { ipAddress, userAgent } = await extractRequestMetadata()

    // ── 3. Transacción atómica con OCC ────────────────────────────────────────
    const updatedContract = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 3a. Obtener contrato
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        select: {
          id: true,
          landlordId: true,
          tenantId: true,
          propertyId: true,
          status: true,
          documentHash: true,
          landlordSignedAt: true,
          monthlyRent: true,
          startDate: true,
          endDate: true,
          paymentDay: true,
        },
      })

      if (!contract) {
        throw new ContractStateError(
          contractId,
          "NOT_FOUND",
          "counterSignAsLandlord",
        )
      }

      // 3b. Verificar titularidad
      if (contract.landlordId !== userId) {
        throw new UnauthorizedLegalActionError(
          userId,
          "counterSignAsLandlord — no es el landlord de este contrato",
        )
      }

      // 3c. Verificar estado: solo PENDING_LANDLORD puede ser contrafirmado
      if (contract.status !== ContractStatus.PENDING_LANDLORD) {
        throw new ContractStateError(
          contractId,
          contract.status,
          "counterSignAsLandlord",
        )
      }

      // 3d. Idempotencia
      if (contract.landlordSignedAt !== null) {
        throw new InvalidSignatureError(contractId, "ALREADY_SIGNED")
      }

      if (!contract.documentHash) {
        throw new InvalidSignatureError(contractId, "DOCUMENT_NOT_FOUND")
      }

      // 3e. OPTIMISTIC CONCURRENCY CONTROL ─────────────────────────────────
      // Leer la versión actual de la propiedad
      const property = await tx.property.findUnique({
        where: { id: contract.propertyId },
        select: { id: true, version: true, status: true },
      })

      if (!property) {
        throw new ContractStateError(
          contractId,
          "PROPERTY_NOT_FOUND",
          "counterSignAsLandlord",
        )
      }

      // Guardar la versión que leímos para el OCC check
      const readVersion = property.version

      // Intentar actualizar la propiedad a OCUPADA SOLO si la versión no cambió.
      // updateMany con WHERE version == readVersion retorna count = 0 si alguien
      // más modificó el registro entre nuestra lectura y esta escritura.
      const occResult = await tx.property.updateMany({
        where: {
          id: contract.propertyId,
          version: readVersion, // ← OCC: condición de versión
          status: PropertyStatus.DISPONIBLE, // solo si sigue disponible
        },
        data: {
          status: PropertyStatus.OCUPADA,
          version: { increment: 1 }, // incrementar versión para futuros OCC
        },
      })

      if (occResult.count === 0) {
        // La versión cambió o el status ya no es DISPONIBLE:
        // otro proceso ganó la carrera — lanzar error de concurrencia
        const currentProperty = await tx.property.findUnique({
          where: { id: contract.propertyId },
          select: { version: true },
        })
        throw new ContractConcurrencyError(
          contract.propertyId,
          readVersion,
          currentProperty?.version ?? readVersion + 1,
        )
      }

      // 3f. Insertar AuditLog de contrafirma
      await tx.auditLog.create({
        data: {
          contractId,
          userId,
          action: AuditAction.COUNTERSIGNED_LANDLORD,
          ipAddress,
          userAgent,
          cryptoHash: contract.documentHash,
        },
      })

      // 3g. Activar contrato
      const updated = await tx.contract.update({
        where: { id: contractId },
        data: {
          landlordSignedAt: new Date(),
          status: ContractStatus.ACTIVE,
        },
        select: { id: true, status: true },
      })

      // 3h. Generar pagos mensuales automáticamente
      const payments: Prisma.PaymentCreateManyInput[] = []
      const paymentStart = new Date(contract.startDate)
      const paymentEnd = new Date(contract.endDate)
      let current = new Date(paymentStart.getFullYear(), paymentStart.getMonth(), contract.paymentDay)
      if (current < paymentStart) {
        current = new Date(paymentStart.getFullYear(), paymentStart.getMonth() + 1, contract.paymentDay)
      }
      const maxPayments = 36
      let count = 0
      while (current <= paymentEnd && count < maxPayments) {
        payments.push({
          contractId,
          landlordId: contract.landlordId,
          tenantId: contract.tenantId,
          amount: contract.monthlyRent,
          dueDate: current,
          status: "PENDIENTE",
          type: "RENT",
        })
        count++
        current = new Date(current.getFullYear(), current.getMonth() + 1, contract.paymentDay)
      }
      if (payments.length > 0) {
        await tx.payment.createMany({ data: payments })
      }

      // Notificar al inquilino que el contrato está activo
      await createNotificationHelper(
        contract.tenantId,
        "CONTRACT_ACTIVE",
        "Contrato de alquiler activo",
        "El arrendador ha firmado el contrato. Tu alquiler ya se encuentra activo y puedes revisar tus pagos.",
        { contractId: contract.id },
        tx
      )

      return updated
    })

    // ── 4. Revalidar caches ───────────────────────────────────────────────────
    revalidatePath("/landlord/dashboard")
    revalidatePath("/propiedades")

    // ── 5. Emails + WhatsApp de contrato activo a ambas partes (non-blocking) ──
    prisma.contract.findUnique({
      where: { id: updatedContract.id },
      select: {
        landlord: { select: { email: true, firstName: true, lastName: true, phone: true } },
        tenant:   { select: { email: true, firstName: true, lastName: true, phone: true } },
        property: { select: { title: true } },
      },
    }).then(c => {
      if (c) {
        sendContractActiveEmail(
          c.landlord.email,
          c.tenant.email,
          `${c.landlord.firstName} ${c.landlord.lastName}`,
          `${c.tenant.firstName} ${c.tenant.lastName}`,
          c.property.title,
          updatedContract.id,
        ).catch(() => {})
        if (c.landlord.phone) {
          waSendContratoActivo(c.landlord.phone, `${c.landlord.firstName}`, c.property.title).catch(() => {})
        }
        if (c.tenant.phone) {
          waSendContratoActivo(c.tenant.phone, `${c.tenant.firstName}`, c.property.title).catch(() => {})
        }
      }
    }).catch(() => {})

    return {
      success: true,
      data: {
        contractId: updatedContract.id,
        status: updatedContract.status,
      },
    }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[counterSignAsLandlord] Error inesperado:", error)
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Ocurrió un error interno. Por favor, intente nuevamente.",
        statusHint: 500,
      },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// recordContractView
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registra en el AuditLog que el usuario VISUALIZÓ el documento del contrato.
 * Este es el primer paso del Clickwrap Agreement (Ley 30201).
 * Debe llamarse cuando el usuario abre el modal/página del contrato para leerlo,
 * ANTES de que aparezca el botón "Aceptar y Firmar".
 */
export async function recordContractView(
  contractId: string,
): Promise<ActionResult> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "recordContractView")
    }

    const userId = (session.user as { id: string; role: Role }).id
    const { ipAddress, userAgent } = await extractRequestMetadata()

    // Obtener el hash del documento para registrarlo en el AuditLog
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        documentHash: true,
        landlordId: true,
        tenantId: true,
      },
    })

    if (!contract) {
      return {
        success: false,
        error: {
          code: "CONTRACT_NOT_FOUND",
          message: "Contrato no encontrado.",
          statusHint: 404,
        },
      }
    }

    // Solo las partes del contrato pueden ver el documento
    if (contract.landlordId !== userId && contract.tenantId !== userId) {
      throw new UnauthorizedLegalActionError(
        userId,
        "recordContractView — no es parte de este contrato",
      )
    }

    if (!contract.documentHash) {
      throw new InvalidSignatureError(contractId, "DOCUMENT_NOT_FOUND")
    }

    await prisma.auditLog.create({
      data: {
        contractId,
        userId,
        action: AuditAction.VIEWED,
        ipAddress,
        userAgent,
        cryptoHash: contract.documentHash,
      },
    })

    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[recordContractView] Error inesperado:", error)
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "No se pudo registrar la visualización del contrato.",
        statusHint: 500,
      },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// sendContractToTenant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envía el contrato al inquilino para su firma.
 * Transición: DRAFT → PENDING_TENANT
 * Solo el LANDLORD (propietario del contrato) puede enviarlo.
 */
export async function sendContractToTenant(
  contractId: string,
): Promise<ActionResult<{ contractId: string; status: ContractStatus }>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "sendContractToTenant", Role.LANDLORD)
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (!hasLandlordRole(session.user) && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(userId, "sendContractToTenant", Role.LANDLORD)
    }

    const updatedContract = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        select: { id: true, landlordId: true, status: true, tenantId: true },
      })

      if (!contract) {
        throw new ContractStateError(contractId, "NOT_FOUND", "sendContractToTenant")
      }

      if (contract.landlordId !== userId) {
        throw new UnauthorizedLegalActionError(userId, "sendContractToTenant — no es el landlord de este contrato")
      }

      if (contract.status !== ContractStatus.DRAFT) {
        throw new ContractStateError(contractId, contract.status, "sendContractToTenant — solo contratos DRAFT pueden enviarse")
      }

      const updated = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.PENDING_TENANT },
        select: { id: true, status: true },
      })

      await createNotificationHelper(
        contract.tenantId,
        "CONTRACT_SENT",
        "Nuevo contrato pendiente de firma",
        "El arrendador te ha enviado un contrato. Revísalo y fírmalo si estás de acuerdo.",
        { contractId: contract.id },
        tx,
      )

      return updated
    })

    revalidatePath("/landlord/contracts")

    prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        tenant: { select: { email: true, firstName: true, lastName: true, phone: true } },
        property: { select: { title: true } },
      },
    }).then(c => {
      if (c) {
        sendContractSentEmail(
          c.tenant.email,
          `${c.tenant.firstName} ${c.tenant.lastName}`,
          c.property.title,
          contractId,
        ).catch(() => {})
        if (c.tenant.phone) {
          waSendContratoEnviado(
            c.tenant.phone,
            `${c.tenant.firstName} ${c.tenant.lastName}`,
            c.property.title,
            `${process.env.NEXT_PUBLIC_URL ?? "https://habitaperu.pe"}/contracts/${contractId}`,
          ).catch(() => {})
        }
      }
    }).catch(() => {})

    return {
      success: true,
      data: { contractId: updatedContract.id, status: updatedContract.status },
    }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[sendContractToTenant] Error inesperado:", error)
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "No se pudo enviar el contrato.", statusHint: 500 },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// finishContract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finaliza un contrato ACTIVE por vencimiento natural.
 * Transición: ACTIVE → FINISHED
 * Libera la propiedad (vuelve a DISPONIBLE) si no tiene otros contratos activos.
 */
export async function finishContract(
  contractId: string,
): Promise<ActionResult<{ contractId: string; status: ContractStatus }>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "finishContract", Role.LANDLORD)
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (!hasLandlordRole(session.user) && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(userId, "finishContract", Role.LANDLORD)
    }

    const updatedContract = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        select: { id: true, landlordId: true, propertyId: true, status: true, tenantId: true },
      })

      if (!contract) {
        throw new ContractStateError(contractId, "NOT_FOUND", "finishContract")
      }

      if (contract.landlordId !== userId) {
        throw new UnauthorizedLegalActionError(userId, "finishContract — no es el landlord")
      }

      if (contract.status !== ContractStatus.ACTIVE) {
        throw new ContractStateError(contractId, contract.status, "finishContract — solo contratos ACTIVE pueden finalizarse")
      }

      const updated = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.FINISHED },
        select: { id: true, status: true },
      })

      // Liberar propiedad si no tiene otros contratos activos
      const otherActive = await tx.contract.count({
        where: {
          propertyId: contract.propertyId,
          status: ContractStatus.ACTIVE,
          id: { not: contractId },
        },
      })
      if (otherActive === 0) {
        await tx.property.update({
          where: { id: contract.propertyId },
          data: { status: PropertyStatus.DISPONIBLE },
        })
      }

      // Notificar al inquilino (A8)
      await createNotificationHelper(
        contract.tenantId,
        "CONTRACT_ACTIVE",
        "Contrato finalizado",
        "Tu contrato de alquiler ha finalizado por vencimiento natural.",
        { contractId: contract.id },
        tx,
      )

      return updated
    })

    revalidatePath("/landlord/contracts")
    revalidatePath("/landlord/dashboard")
    revalidatePath("/propiedades")

    return {
      success: true,
      data: { contractId: updatedContract.id, status: updatedContract.status },
    }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[finishContract] Error inesperado:", error)
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "No se pudo finalizar el contrato.", statusHint: 500 },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// breachContract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rescinde un contrato ACTIVE por incumplimiento (Ley 30933).
 * Transición: ACTIVE → BREACHED_CANCELLED
 * Libera la propiedad (vuelve a DISPONIBLE).
 */
export async function breachContract(
  contractId: string,
  reason?: string,
): Promise<ActionResult<{ contractId: string; status: ContractStatus }>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "breachContract", Role.LANDLORD)
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (!hasLandlordRole(session.user) && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(userId, "breachContract", Role.LANDLORD)
    }

    const updatedContract = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        select: { id: true, landlordId: true, propertyId: true, status: true, tenantId: true },
      })

      if (!contract) {
        throw new ContractStateError(contractId, "NOT_FOUND", "breachContract")
      }

      if (contract.landlordId !== userId) {
        throw new UnauthorizedLegalActionError(userId, "breachContract — no es el landlord")
      }

      if (contract.status !== ContractStatus.ACTIVE) {
        throw new ContractStateError(contractId, contract.status, "breachContract — solo contratos ACTIVE pueden rescindirse")
      }

      const updated = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.BREACHED_CANCELLED, terms: reason ? JSON.stringify({ breachReason: reason }) : undefined },
        select: { id: true, status: true },
      })

      // Liberar propiedad
      await tx.property.update({
        where: { id: contract.propertyId },
        data: { status: PropertyStatus.DISPONIBLE },
      })

      // Cancelar pagos pendientes o vencidos a futuro/asociados al contrato rescindido (C1)
      await tx.payment.updateMany({
        where: {
          contractId: contract.id,
          status: { in: [PaymentStatus.PENDIENTE, PaymentStatus.VENCIDO] },
        },
        data: {
          status: PaymentStatus.CANCELADO,
        },
      })

      // Notificar al inquilino
      await createNotificationHelper(
        contract.tenantId,
        "CONTRACT_BREACHED",
        "Contrato rescindido",
        reason
          ? `Tu contrato ha sido rescindido. Motivo: ${reason}`
          : "Tu contrato ha sido rescindido por incumplimiento.",
        { contractId: contract.id },
        tx,
      )

      return updated
    })

    revalidatePath("/landlord/contracts")
    revalidatePath("/landlord/dashboard")
    revalidatePath("/propiedades")

    return {
      success: true,
      data: { contractId: updatedContract.id, status: updatedContract.status },
    }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[breachContract] Error inesperado:", error)
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "No se pudo rescindir el contrato.", statusHint: 500 },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// createDraftContract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea un contrato en estado DRAFT y genera su hash SHA-256.
 * Solo puede ser ejecutado por un LANDLORD o ADMIN.
 * El hash se calcula sobre el HTML del contrato generado en este momento,
 * garantizando que lo que se hashea es exactamente lo que verá el tenant.
 */
export async function createDraftContract(input: {
  propertyId: string
  tenantId: string
  monthlyRent: number
  currency: "PEN" | "USD"
  deposit: number
  startDate: Date
  endDate: Date
  paymentDay: number
  paymentAccount: {
    provider: "Niubiz" | "Culqi" | "Izipay" | "BCP" | "Interbank" | "BBVA"
    accountNumber: string
    accountHolder: string
  }
}): Promise<ActionResult<{ contractId: string }>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "createDraftContract", Role.LANDLORD)
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (!hasLandlordRole(session.user) && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(userId, "createDraftContract", Role.LANDLORD)
    }

    // Verificar propiedad y obtener datos para generación de HTML
    const property = await prisma.property.findUnique({
      where: { id: input.propertyId },
      select: {
        ownerId: true,
        status: true,
        address: true,
        district: true,
        type: true,
        area: true,
        rooms: true,
        bathrooms: true,
      },
    })

    if (!property) {
      return {
        success: false,
        error: { code: "PROPERTY_NOT_FOUND", message: "Propiedad no encontrada.", statusHint: 404 },
      }
    }

    if (property.ownerId !== userId) {
      throw new UnauthorizedLegalActionError(userId, "createDraftContract — no es dueño de la propiedad")
    }

    if (property.status !== PropertyStatus.DISPONIBLE) {
      return {
        success: false,
        error: {
          code: "PROPERTY_NOT_AVAILABLE",
          message: "La propiedad no está disponible para arrendamiento.",
          statusHint: 409,
        },
      }
    }

    // Obtener datos de landlord y tenant para generación del documento
    const [landlordData, tenantData] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, dni: true, email: true, phone: true, district: true },
      }),
      prisma.user.findUnique({
        where: { id: input.tenantId },
        select: { firstName: true, lastName: true, dni: true, email: true, phone: true, district: true },
      }),
    ])

    if (!landlordData || !tenantData) {
      return {
        success: false,
        error: { code: "USER_NOT_FOUND", message: "No se encontraron los datos de las partes.", statusHint: 404 },
      }
    }

    // Paso 1: Crear contrato para obtener el ID real (cuid) antes de generar el HTML
    const contract = await prisma.contract.create({
      data: {
        propertyId: input.propertyId,
        landlordId: userId,
        tenantId: input.tenantId,
        status: ContractStatus.DRAFT,
        monthlyRent: input.monthlyRent,
        currency: input.currency,
        deposit: input.deposit,
        startDate: input.startDate,
        endDate: input.endDate,
        paymentDay: input.paymentDay,
      },
      select: { id: true },
    })

    const toAddress = (district: string | null) => {
      const d = district ?? "Lima"
      return d.length >= 5 ? d : `${d}, Perú`
    }

    const contractId = await prisma.$transaction(async (tx) => {
      // Paso 1: Crear contrato para obtener el ID real (cuid) antes de generar el HTML
      const contract = await tx.contract.create({
        data: {
          propertyId: input.propertyId,
          landlordId: userId,
          tenantId: input.tenantId,
          status: ContractStatus.DRAFT,
          monthlyRent: input.monthlyRent,
          currency: input.currency as Currency,
          deposit: input.deposit,
          startDate: input.startDate,
          endDate: input.endDate,
          paymentDay: input.paymentDay,
        },
        select: { id: true },
      })

      // Paso 2: Generar HTML en el servidor con el ID real del contrato
      const html = generatePeruvianLeaseAgreement({
        contractId: contract.id,
        landlord: {
          fullName: `${landlordData.firstName} ${landlordData.lastName}`,
          dni: landlordData.dni ?? "00000000",
          email: landlordData.email,
          phone: landlordData.phone ?? "No registrado",
          address: toAddress(landlordData.district),
          district: landlordData.district ?? "Lima",
        },
        tenant: {
          fullName: `${tenantData.firstName} ${tenantData.lastName}`,
          dni: tenantData.dni ?? "00000000",
          email: tenantData.email,
          phone: tenantData.phone ?? "No registrado",
          address: toAddress(tenantData.district),
          district: tenantData.district ?? "Lima",
        },
        property: {
          id: input.propertyId,
          address: property.address ?? "Dirección no registrada",
          district: property.district,
          type: (property.type as "HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL") ?? "DEPARTAMENTO",
          area: property.area ?? undefined,
          rooms: property.rooms ?? 1,
          bathrooms: property.bathrooms ?? 1,
        },
        monthlyRent: input.monthlyRent,
        currency: input.currency,
        deposit: input.deposit,
        startDate: input.startDate,
        endDate: input.endDate,
        paymentDay: input.paymentDay,
        paymentAccount: input.paymentAccount,
      })
      const documentHash = createDocumentHash(html)

      // Paso 3: Actualizar contrato con hash y datos de cuenta bancaria
      await tx.contract.update({
        where: { id: contract.id },
        data: {
          documentHash,
          terms: JSON.stringify({ paymentAccount: input.paymentAccount }),
        },
      })

      return contract.id
    })

    revalidatePath("/landlord/contracts")
    revalidatePath("/landlord/dashboard")

    return { success: true, data: { contractId } }
  } catch (error: unknown) {
    if (isKnownLegalError(error)) {
      return { success: false, error: error.serialize() }
    }
    console.error("[createDraftContract] Error inesperado:", error)
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "No se pudo crear el contrato. Intente nuevamente.",
        statusHint: 500,
      },
    }
  }
}
