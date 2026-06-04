import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantContractView } from "./contract-view"
import { Role } from "@prisma/client"
import { checkReviewEligibility } from "@/app/actions/review-actions"

export const dynamic = "force-dynamic"

export default async function TenantContractPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.TENANT) {
    redirect("/login")
  }

  const tenantId = session.user.id

  const contracts = await prisma.contract.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          district: true,
          type: true,
          area: true,
          rooms: true,
          bathrooms: true,
        },
      },
      landlord: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  // Verificar elegibilidad de reseña para cada contrato en paralelo
  const eligibilityResults = await Promise.all(
    contracts.map(c => checkReviewEligibility(c.id))
  )

  const mappedContracts = contracts.map((c, i) => ({
    id: c.id,
    status: c.status,
    monthlyRent: Number(c.monthlyRent),
    currency: c.currency,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    paymentDay: c.paymentDay,
    deposit: Number(c.deposit),
    documentHash: c.documentHash,
    terms: c.terms,
    landlordSignedAt: c.landlordSignedAt ? c.landlordSignedAt.toISOString() : null,
    tenantSignedAt: c.tenantSignedAt ? c.tenantSignedAt.toISOString() : null,
    reviewEligible: eligibilityResults[i].eligible,
    reviewDaysRemaining: eligibilityResults[i].daysRemaining,
    alreadyReviewed: eligibilityResults[i].alreadyReviewed,
    property: {
      ...c.property,
      area: c.property.area ?? 0,
    },
    landlord: c.landlord,
  }))

  return <TenantContractView contracts={mappedContracts} />
}
