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
import { Prisma, AuditAction, ContractStatus, PropertyStatus, Role } from "@prisma/client"
import {
  ContractConcurrencyError,
  ContractStateError,
  InvalidSignatureError,
  UnauthorizedLegalActionError,
  isKnownLegalError,
  type SerializedError,
} from "@/lib/exceptions/contract-errors"
import { createDocumentHash } from "@/lib/services/contract-engine"

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

    // ── 2. Metadatos de la solicitud ─────────────────────────────────────────
    const { ipAddress, userAgent } = await extractRequestMetadata()

    // ── 3. Transacción atómica ────────────────────────────────────────────────
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
        ContractStatus.DRAFT,
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

      return updated
    })

    // ── 4. Revalidar cache del dashboard del tenant ───────────────────────────
    revalidatePath("/tenant/dashboard")

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
    // Error inesperado: loguear sin exponer detalles al cliente
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

    if (userRole !== Role.LANDLORD && userRole !== Role.ADMIN) {
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

      return updated
    })

    // ── 4. Revalidar caches ───────────────────────────────────────────────────
    // revalidateTag en Next.js 16 requiere un segundo argumento de profile
    revalidatePath("/landlord/dashboard")
    revalidatePath("/propiedades")

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
  documentHtml: string
}): Promise<ActionResult<{ contractId: string }>> {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedLegalActionError(null, "createDraftContract", Role.LANDLORD)
    }

    const userId = (session.user as { id: string; role: Role }).id
    const userRole = (session.user as { id: string; role: Role }).role

    if (userRole !== Role.LANDLORD && userRole !== Role.ADMIN) {
      throw new UnauthorizedLegalActionError(userId, "createDraftContract", Role.LANDLORD)
    }

    // Verificar que la propiedad pertenece al landlord autenticado
    const property = await prisma.property.findUnique({
      where: { id: input.propertyId },
      select: { ownerId: true, status: true },
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

    // Calcular hash del documento HTML del contrato
    const documentHash = createDocumentHash(input.documentHtml)

    // Verificar que no exista ya un contrato con el mismo hash (idempotencia)
    const existingContract = await prisma.contract.findUnique({
      where: { documentHash },
      select: { id: true },
    })

    if (existingContract) {
      return {
        success: true,
        data: { contractId: existingContract.id },
      }
    }

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
        documentHash,
      },
      select: { id: true },
    })

    revalidatePath("/landlord/dashboard")

    return { success: true, data: { contractId: contract.id } }
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
