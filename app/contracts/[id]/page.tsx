import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { ContractSignView } from "./contract-sign-view"

export const dynamic = "force-dynamic"

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as { id: string; role: string }).id
  const userRole = (session.user as { id: string; role: string }).role

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      landlord: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, verified: true },
      },
      tenant: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      },
      property: {
        select: { id: true, title: true, address: true, district: true, type: true, area: true, rooms: true, bathrooms: true },
      },
      auditLogs: {
        orderBy: { timestamp: "asc" },
        select: { id: true, action: true, userId: true, timestamp: true, ipAddress: true },
      },
    },
  })

  if (!contract) notFound()

  // Only landlord, tenant, or admin can view this contract
  const isParty =
    contract.landlordId === userId ||
    contract.tenantId === userId ||
    userRole === "ADMIN"

  if (!isParty) redirect("/login")

  return (
    <ContractSignView
      contract={{
        id: contract.id,
        status: contract.status,
        monthlyRent: Number(contract.monthlyRent),
        currency: contract.currency,
        deposit: Number(contract.deposit),
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate.toISOString(),
        paymentDay: contract.paymentDay,
        tenantSignedAt: contract.tenantSignedAt?.toISOString() ?? null,
        landlordSignedAt: contract.landlordSignedAt?.toISOString() ?? null,
        documentHash: contract.documentHash ?? null,
        landlord: contract.landlord,
        tenant: contract.tenant,
        property: {
          ...contract.property,
          area: contract.property.area ?? null,
          rooms: contract.property.rooms ?? null,
          bathrooms: contract.property.bathrooms ?? null,
          address: contract.property.address ?? null,
        },
        auditLogs: contract.auditLogs.map((l) => ({
          ...l,
          timestamp: l.timestamp.toISOString(),
        })),
      }}
      currentUserId={userId}
      currentUserRole={userRole}
    />
  )
}
