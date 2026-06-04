"use server"

/**
 * app/actions/culqi-actions.ts
 *
 * Server actions para los tres tipos de cobro de Habita Perú:
 *   1. Success fee     — S/ 29  al landlord cuando contrato pasa a ACTIVE
 *   2. KYC fee         — S/  9.90 al tenant cuando su KYC es aprobado
 *   3. Featured listing — S/ 15/25/45 al landlord para destacar propiedad
 *
 * En modo MOCK (sin CULQI_SECRET_KEY) los cobros se simulan localmente.
 * Para activar Culqi real: agregar CULQI_PUBLIC_KEY y CULQI_SECRET_KEY al .env
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import {
  createCulqiCharge,
  CULQI_IS_MOCK,
  PRICES,
  PAYMENT_LABELS,
  type PaymentType,
} from "@/lib/culqi"
import { createNotificationHelper } from "@/lib/notifications"

export interface PaymentActionResult {
  success: boolean
  isMock?: boolean
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SUCCESS FEE — S/ 29 al landlord cuando el contrato se activa
// ─────────────────────────────────────────────────────────────────────────────

export async function processSuccessFee(
  contractId: string,
  culqiToken: string = "mock"
): Promise<PaymentActionResult> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: "No autorizado." }

    const userId = session.user.id

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        landlordId: true,
        status: true,
        successFeePaid: true,
        landlord: { select: { email: true, firstName: true, lastName: true } },
        property: { select: { title: true } },
      },
    })

    if (!contract) return { success: false, error: "Contrato no encontrado." }
    if (contract.landlordId !== userId) return { success: false, error: "No autorizado." }
    if (contract.status !== "ACTIVE") return { success: false, error: "El contrato debe estar activo." }
    if (contract.successFeePaid) return { success: true, isMock: CULQI_IS_MOCK }

    const charge = await createCulqiCharge({
      token: culqiToken,
      amountCents: PRICES.SUCCESS_FEE,
      description: PAYMENT_LABELS.SUCCESS_FEE,
      email: contract.landlord.email,
      metadata: { contractId, type: "SUCCESS_FEE" },
    })

    if (!charge.success) return { success: false, error: charge.error }

    await prisma.$transaction([
      prisma.contract.update({
        where: { id: contractId },
        data: { successFeePaid: true, successFeePaidAt: new Date() },
      }),
      prisma.payment.create({
        data: {
          contractId,
          landlordId: contract.landlordId,
          tenantId: (await prisma.contract.findUnique({
            where: { id: contractId }, select: { tenantId: true }
          }))!.tenantId,
          amount: PRICES.SUCCESS_FEE / 100,
          dueDate: new Date(),
          paidDate: new Date(),
          status: "PAGADO",
          type: "SUCCESS_FEE",
          paymentMethod: CULQI_IS_MOCK ? "SIMULACIÓN" : "CULQI",
          notes: charge.chargeId,
        },
      }),
    ])

    await createNotificationHelper(
      userId,
      "PAYMENT_SUCCESS",
      "Contrato completamente activado",
      `Tu contrato para "${contract.property.title}" está registrado y vigente.`,
      { contractId }
    )

    revalidatePath(`/landlord/contracts`)
    revalidatePath(`/es/contracts/${contractId}`)

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processSuccessFee]", err)
    return { success: false, error: "Error interno al procesar el pago." }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. KYC FEE — S/ 9.90 al tenant para activar perfil verificado
// ─────────────────────────────────────────────────────────────────────────────

export async function processKycFee(
  culqiToken: string = "mock"
): Promise<PaymentActionResult> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: "No autorizado." }

    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, kycFeePaid: true, kycVerification: { select: { status: true } } },
    })

    if (!user) return { success: false, error: "Usuario no encontrado." }
    if (user.kycFeePaid) return { success: true, isMock: CULQI_IS_MOCK }
    if (user.kycVerification?.status !== "APROBADO") {
      return { success: false, error: "Tu KYC aún no ha sido aprobado." }
    }

    const charge = await createCulqiCharge({
      token: culqiToken,
      amountCents: PRICES.KYC_FEE,
      description: PAYMENT_LABELS.KYC_FEE,
      email: user.email,
      metadata: { userId, type: "KYC_FEE" },
    })

    if (!charge.success) return { success: false, error: charge.error }

    await prisma.user.update({
      where: { id: userId },
      data: { kycFeePaid: true, kycFeePaidAt: new Date() },
    })

    await createNotificationHelper(
      userId,
      "KYC_ACTIVATED",
      "Perfil verificado activado",
      "Tu perfil verificado está activo. Ya puedes contactar arrendadores.",
      { chargeId: charge.chargeId }
    )

    revalidatePath("/tenant/kyc")
    revalidatePath("/tenant/dashboard")

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processKycFee]", err)
    return { success: false, error: "Error interno al procesar el pago." }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FEATURED LISTING — S/15/25/45 para destacar propiedad X días
// ─────────────────────────────────────────────────────────────────────────────

export async function processFeaturedListing(
  propertyId: string,
  days: 7 | 15 | 30,
  culqiToken: string = "mock"
): Promise<PaymentActionResult> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: "No autorizado." }

    const userId = session.user.id

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        ownerId: true,
        title: true,
        owner: { select: { email: true } },
        featuredUntil: true,
      },
    })

    if (!property) return { success: false, error: "Propiedad no encontrada." }
    if (property.ownerId !== userId) return { success: false, error: "No autorizado." }

    const priceKey: PaymentType =
      days === 7 ? "FEATURED_7D" : days === 15 ? "FEATURED_15D" : "FEATURED_30D"

    const charge = await createCulqiCharge({
      token: culqiToken,
      amountCents: PRICES[priceKey],
      description: `${PAYMENT_LABELS[priceKey]}: ${property.title}`,
      email: property.owner.email,
      metadata: { propertyId, days: String(days), type: "FEATURED" },
    })

    if (!charge.success) return { success: false, error: charge.error }

    // Si ya tiene featured activo, extender desde esa fecha; si no, desde ahora
    const now = new Date()
    const baseDate =
      property.featuredUntil && property.featuredUntil > now
        ? property.featuredUntil
        : now

    const newFeaturedUntil = new Date(baseDate)
    newFeaturedUntil.setDate(newFeaturedUntil.getDate() + days)

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        featuredUntil: newFeaturedUntil,
        featuredPaidAt: new Date(),
      },
    })

    await createNotificationHelper(
      userId,
      "FEATURED_ACTIVATED",
      "Propiedad destacada activada",
      `"${property.title}" aparecerá en los primeros resultados hasta el ${newFeaturedUntil.toLocaleDateString("es-PE")}.`,
      { propertyId }
    )

    revalidatePath("/landlord/properties")
    revalidatePath("/es/propiedades")

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processFeaturedListing]", err)
    return { success: false, error: "Error interno al procesar el pago." }
  }
}
