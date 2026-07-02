"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Role, ContractStatus, ReviewType } from "@prisma/client"
import { createNotificationHelper } from "@/lib/notifications"
import { hasLandlordRole } from "@/lib/permissions"

const MIN_DAYS_FOR_REVIEW = 30

// ─────────────────────────────────────────────────────────────────────────────
// Tenant califica la propiedad (y por extensión al landlord)
// Solo habilitado cuando el contrato lleva ≥ 30 días ACTIVE o está FINISHED
// ─────────────────────────────────────────────────────────────────────────────

export async function createPropertyReview({
  propertyId,
  contractId,
  rating,
  comment,
}: {
  propertyId: string
  contractId: string
  rating: number
  comment: string
}) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== Role.TENANT) {
    return { success: false, error: "Solo los inquilinos pueden calificar propiedades." }
  }

  const tenantId = session.user.id

  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      propertyId,
      tenantId,
      status: { in: [ContractStatus.ACTIVE, ContractStatus.FINISHED] },
    },
    select: {
      id: true,
      status: true,
      landlordSignedAt: true,
      property: { select: { ownerId: true, title: true } },
      landlord: { select: { id: true } },
    },
  })

  if (!contract) {
    return { success: false, error: "No tienes un contrato activo para esta propiedad." }
  }

  // Gate: mínimo 30 días desde que el contrato se activó
  if (contract.status === ContractStatus.ACTIVE && contract.landlordSignedAt) {
    const daysSinceActive = Math.floor(
      (Date.now() - new Date(contract.landlordSignedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceActive < MIN_DAYS_FOR_REVIEW) {
      return {
        success: false,
        error: `Podrás dejar tu reseña después de ${MIN_DAYS_FOR_REVIEW - daysSinceActive} días más en la propiedad.`,
      }
    }
  }

  const existing = await prisma.review.findFirst({
    where: { propertyId, authorId: tenantId, reviewType: ReviewType.PROPERTY_REVIEW },
  })
  if (existing) return { success: false, error: "Ya calificaste esta propiedad." }

  await prisma.review.create({
    data: {
      propertyId,
      authorId: tenantId,
      targetId: contract.property.ownerId,
      reviewType: ReviewType.PROPERTY_REVIEW,
      contractId,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment: comment.trim(),
    },
  })

  await createNotificationHelper(
    contract.landlord.id,
    "NEW_REVIEW",
    "Nueva reseña en tu propiedad",
    `Tu propiedad "${contract.property.title}" recibió una nueva calificación.`,
    { propertyId }
  )

  revalidatePath(`/propiedades/${propertyId}`)
  revalidatePath("/tenant/contract")

  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// Landlord califica al tenant (puntualidad, cuidado de la propiedad)
// Solo habilitado con contratos ACTIVE ≥ 30 días o FINISHED
// ─────────────────────────────────────────────────────────────────────────────

export async function createTenantReview({
  contractId,
  rating,
  comment,
}: {
  contractId: string
  rating: number
  comment: string
}) {
  const session = await auth()
  if (!session?.user?.id || !hasLandlordRole(session.user)) {
    return { success: false, error: "Solo los arrendadores pueden calificar inquilinos." }
  }

  const landlordId = session.user.id

  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      landlordId,
      status: { in: [ContractStatus.ACTIVE, ContractStatus.FINISHED] },
    },
    select: {
      id: true,
      status: true,
      propertyId: true,
      landlordSignedAt: true,
      tenantId: true,
      tenant: { select: { id: true, firstName: true } },
      property: { select: { id: true, title: true } },
    },
  })

  if (!contract) {
    return { success: false, error: "No se encontró el contrato." }
  }

  if (contract.status === ContractStatus.ACTIVE && contract.landlordSignedAt) {
    const daysSinceActive = Math.floor(
      (Date.now() - new Date(contract.landlordSignedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceActive < MIN_DAYS_FOR_REVIEW) {
      return {
        success: false,
        error: `Podrás calificar al inquilino en ${MIN_DAYS_FOR_REVIEW - daysSinceActive} días.`,
      }
    }
  }

  const existing = await prisma.review.findFirst({
    where: { contractId, authorId: landlordId, reviewType: ReviewType.TENANT_REVIEW },
  })
  if (existing) return { success: false, error: "Ya calificaste a este inquilino para este contrato." }

  await prisma.review.create({
    data: {
      propertyId: contract.propertyId,
      authorId: landlordId,
      targetId: contract.tenantId,
      reviewType: ReviewType.TENANT_REVIEW,
      contractId,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment: comment.trim(),
    },
  })

  await createNotificationHelper(
    contract.tenantId,
    "NEW_REVIEW",
    "Tu arrendador te calificó",
    `Recibiste una calificación por tu contrato en "${contract.property.title}".`,
    { contractId }
  )

  revalidatePath("/landlord/contracts")

  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// Verifica elegibilidad y estado de reseña
// ─────────────────────────────────────────────────────────────────────────────

export async function checkReviewEligibility(contractId: string) {
  const session = await auth()
  if (!session?.user?.id) return { eligible: false, alreadyReviewed: false, daysRemaining: 0 }

  const userId = session.user.id
  const role = session.user.role

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: {
      status: true,
      landlordSignedAt: true,
      propertyId: true,
      tenantId: true,
      landlordId: true,
    },
  })

  if (!contract) return { eligible: false, alreadyReviewed: false, daysRemaining: 0 }

  const isLandlordOfContract = contract.landlordId === userId
  const isParty =
    (role === Role.TENANT && contract.tenantId === userId) ||
    (hasLandlordRole(session.user) && isLandlordOfContract)

  if (!isParty) return { eligible: false, alreadyReviewed: false, daysRemaining: 0 }
  if (![ContractStatus.ACTIVE, ContractStatus.FINISHED].includes(contract.status)) {
    return { eligible: false, alreadyReviewed: false, daysRemaining: 0 }
  }

  let daysRemaining = 0
  if (contract.status === ContractStatus.ACTIVE && contract.landlordSignedAt) {
    const daysSince = Math.floor(
      (Date.now() - new Date(contract.landlordSignedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    daysRemaining = Math.max(0, MIN_DAYS_FOR_REVIEW - daysSince)
  }

  // Se decide por la relación con ESTE contrato, no por el rol principal de
  // la cuenta: alguien dual (isLandlord + role TENANT) reseña como arrendador
  // si es dueño de este contrato en particular.
  const reviewType = isLandlordOfContract ? ReviewType.TENANT_REVIEW : ReviewType.PROPERTY_REVIEW
  const existing = await prisma.review.findFirst({
    where: { contractId, authorId: userId, reviewType },
  })

  return {
    eligible: daysRemaining === 0,
    alreadyReviewed: !!existing,
    daysRemaining,
  }
}

/**
 * Versión batch de checkReviewEligibility para evitar N+1 queries.
 * Recibe múltiples contractIds y devuelve resultados en un solo query.
 */
export async function checkBatchReviewEligibility(contractIds: string[]) {
  const session = await auth()
  if (!session?.user?.id) {
    return contractIds.map(() => ({ eligible: false, alreadyReviewed: false, daysRemaining: 0 }))
  }

  const userId = session.user.id
  const role = session.user.role

  // Un solo query para todos los contratos
  const contracts = await prisma.contract.findMany({
    where: { id: { in: contractIds } },
    select: {
      id: true,
      status: true,
      landlordSignedAt: true,
      tenantId: true,
      landlordId: true,
    },
  })

  // Un solo query para todas las reseñas existentes del usuario. Como cada
  // contrato puede pedir un reviewType distinto para cuentas duales, se
  // consultan ambos tipos y se resuelve por contrato más abajo.
  const isAccountLandlord = hasLandlordRole(session.user)
  const existingReviews = await prisma.review.findMany({
    where: {
      contractId: { in: contractIds },
      authorId: userId,
      reviewType: isAccountLandlord ? { in: [ReviewType.TENANT_REVIEW, ReviewType.PROPERTY_REVIEW] } : ReviewType.PROPERTY_REVIEW,
    },
    select: { contractId: true, reviewType: true },
  })
  const reviewedSet = new Set(existingReviews.map(r => `${r.contractId}:${r.reviewType}`))

  const resultMap = new Map<string, { eligible: boolean; alreadyReviewed: boolean; daysRemaining: number }>()

  for (const contract of contracts) {
    const isLandlordOfContract = contract.landlordId === userId
    const isParty =
      (role === Role.TENANT && contract.tenantId === userId) ||
      (isAccountLandlord && isLandlordOfContract)

    let eligible = false
    let daysRemaining = 0

    if (isParty && [ContractStatus.ACTIVE, ContractStatus.FINISHED].includes(contract.status)) {
      if (contract.status === ContractStatus.ACTIVE && contract.landlordSignedAt) {
        const daysSince = Math.floor(
          (Date.now() - new Date(contract.landlordSignedAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        daysRemaining = Math.max(0, MIN_DAYS_FOR_REVIEW - daysSince)
      }
      eligible = daysRemaining === 0
    }

    const reviewType = isLandlordOfContract ? ReviewType.TENANT_REVIEW : ReviewType.PROPERTY_REVIEW
    resultMap.set(contract.id, {
      eligible,
      alreadyReviewed: reviewedSet.has(`${contract.id}:${reviewType}`),
      daysRemaining,
    })
  }

  return contractIds.map(id => resultMap.get(id) ?? { eligible: false, alreadyReviewed: false, daysRemaining: 0 })
}

// Mantener compatibilidad con el modal existente
export async function createReviewAction({
  propertyId,
  rating,
  comment,
}: {
  propertyId: string
  rating: number
  comment: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autorizado.")

  const contract = await prisma.contract.findFirst({
    where: {
      propertyId,
      tenantId: session.user.id,
      status: { in: [ContractStatus.ACTIVE, ContractStatus.FINISHED] },
    },
    select: { id: true },
  })

  if (!contract) throw new Error("No tienes un contrato activo para esta propiedad.")

  const result = await createPropertyReview({
    propertyId,
    contractId: contract.id,
    rating,
    comment,
  })

  if (!result.success) throw new Error(result.error)
  return { success: true }
}

export async function checkReviewEligibilityAction(propertyId: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== Role.TENANT) {
    return { eligible: false, alreadyReviewed: false }
  }
  const contract = await prisma.contract.findFirst({
    where: {
      propertyId,
      tenantId: session.user.id,
      status: { in: [ContractStatus.ACTIVE, ContractStatus.FINISHED] },
    },
    select: { id: true },
  })
  if (!contract) return { eligible: false, alreadyReviewed: false }
  const check = await checkReviewEligibility(contract.id)
  return { eligible: check.eligible, alreadyReviewed: check.alreadyReviewed }
}
