"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"

interface CreateReviewInput {
  propertyId: string
  rating: number
  comment: string
}

/**
 * Creates a verified review for a property.
 * Ensures the logged-in user is a TENANT and has (or had) a contract on the property.
 */
export async function createReviewAction({ propertyId, rating, comment }: CreateReviewInput) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== Role.TENANT) {
    throw new Error("No autorizado. Solo los inquilinos registrados pueden calificar.")
  }

  const tenantId = session.user.id

  // 1. Verify that a contract exists between this tenant and property
  const contract = await prisma.contract.findFirst({
    where: {
      propertyId,
      tenantId,
      status: {
        in: ["ACTIVE", "FINISHED"]
      }
    },
    include: {
      property: {
        select: {
          ownerId: true
        }
      }
    }
  })

  if (!contract) {
    throw new Error(
      "Acceso Denegado. Solo puedes calificar propiedades donde tengas o hayas tenido un contrato vigente."
    )
  }

  // 2. Check if a review already exists from this tenant for this property
  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId,
      authorId: tenantId
    }
  })

  if (existingReview) {
    throw new Error("Ya has calificado esta propiedad anteriormente.")
  }

  // 3. Create the review
  const review = await prisma.review.create({
    data: {
      propertyId,
      authorId: tenantId,
      targetId: contract.property.ownerId,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment: comment.trim()
    }
  })

  return {
    success: true,
    reviewId: review.id
  }
}

/**
 * Checks if the user is eligible to write a review for a property,
 * and returns if they have already reviewed it.
 */
export async function checkReviewEligibilityAction(propertyId: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== Role.TENANT) {
    return { eligible: false, alreadyReviewed: false }
  }

  const tenantId = session.user.id

  // Check if contract exists
  const contract = await prisma.contract.findFirst({
    where: {
      propertyId,
      tenantId,
      status: {
        in: ["ACTIVE", "FINISHED"]
      }
    }
  })

  if (!contract) {
    return { eligible: false, alreadyReviewed: false }
  }

  // Check if already reviewed
  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId,
      authorId: tenantId
    }
  })

  return {
    eligible: true,
    alreadyReviewed: !!existingReview
  }
}
