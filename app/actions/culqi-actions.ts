"use server"

/**
 * app/actions/culqi-actions.ts
 *
 * Server actions para los cobros de Habita Perú:
 *   1. Success fee      — S/ 29     al landlord cuando contrato pasa a ACTIVE
 *   2. Featured listing — S/ 15/25/45 al landlord para destacar propiedad
 *   3. Plan upgrade     — S/ 49/129 suscripción mensual Pro/Business
 *
 * Nota: el KYC fee (S/ 9.90) está desactivado en esta etapa — la verificación
 * es gratuita para maximizar adopción. Se reactiva cuando haya tracción validada.
 *
 * En modo MOCK (sin CULQI_SECRET_KEY) los cobros se simulan localmente.
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { PaymentStatus, PaymentType as PrismaPaymentType, ContractStatus, SubscriptionPlan } from "@prisma/client"
import {
  createCulqiCharge,
  CULQI_IS_MOCK,
  PRICES,
  PAYMENT_LABELS,
  type PaymentType,
} from "@/lib/culqi"
import { createNotificationHelper } from "@/lib/notifications"
import { hasLandlordRole } from "@/lib/permissions"

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
        tenantId: true,
        status: true,
        successFeePaid: true,
        landlord: { select: { email: true, firstName: true, lastName: true } },
        property: { select: { title: true } },
      },
    })

    if (!contract) return { success: false, error: "Contrato no encontrado." }
    if (contract.landlordId !== userId) return { success: false, error: "No autorizado." }
    if (contract.status !== ContractStatus.ACTIVE) return { success: false, error: "El contrato debe estar activo." }
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
          tenantId: contract.tenantId,
          amount: PRICES.SUCCESS_FEE / 100,
          dueDate: new Date(),
          paidDate: new Date(),
          status: PaymentStatus.PAGADO,
          type: PrismaPaymentType.SUCCESS_FEE,
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
    revalidatePath(`/contracts/${contractId}`)
    revalidatePath(`/es/contracts/${contractId}`)
    revalidatePath(`/en/contracts/${contractId}`)
    revalidatePath("/landlord/payments")
    revalidatePath("/admin/payments")

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processSuccessFee]", err)
    return { success: false, error: "Error interno al procesar el pago." }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLAN UPGRADE — S/49 (Pro) o S/129 (Business) mensual
// ─────────────────────────────────────────────────────────────────────────────

export async function processPlanUpgrade(
  plan: SubscriptionPlan,
  culqiToken: string = "mock"
): Promise<PaymentActionResult> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: "No autorizado." }

    const userId = session.user.id
    if (!hasLandlordRole(session.user)) return { success: false, error: "Solo arrendadores pueden suscribirse." }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, subscriptionPlan: true },
    })

    if (!user) return { success: false, error: "Usuario no encontrado." }
    if (user.subscriptionPlan === plan) return { success: true, isMock: CULQI_IS_MOCK }

    const priceKey: PaymentType = plan === "PRO" ? "PRO_MONTHLY" : "BUSINESS_MONTHLY"

    const charge = await createCulqiCharge({
      token: culqiToken,
      amountCents: PRICES[priceKey],
      description: PAYMENT_LABELS[priceKey],
      email: user.email,
      metadata: { userId, plan, type: "SUBSCRIPTION" },
    })

    if (!charge.success) return { success: false, error: charge.error }

    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + 30)

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionPlan: plan, subscriptionEndsAt: endsAt },
    })

    await createNotificationHelper(
      userId,
      "PAYMENT_SUCCESS",
      `Plan ${plan} activado`,
      `Tu plan ${plan} está activo hasta el ${endsAt.toLocaleDateString("es-PE")}.`,
      { plan }
    )

    revalidatePath("/landlord/properties")
    revalidatePath("/landlord/settings")

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processPlanUpgrade]", err)
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
    revalidatePath("/propiedades")
    revalidatePath("/es/propiedades")
    revalidatePath("/en/propiedades")

    return { success: true, isMock: CULQI_IS_MOCK }
  } catch (err) {
    console.error("[processFeaturedListing]", err)
    return { success: false, error: "Error interno al procesar el pago." }
  }
}
