import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { AuditTrailView } from "./audit-trail-view"

export const dynamic = "force-dynamic"

export default async function ContractAuditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id: contractId } = await params
  const userId = (session.user as any).id as string
  const role   = (session.user as any).role as string

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: {
      id: true,
      status: true,
      documentHash: true,
      createdAt: true,
      landlordId: true,
      tenantId: true,
      landlord: { select: { firstName: true, lastName: true, email: true } },
      tenant:   { select: { firstName: true, lastName: true, email: true } },
      property: { select: { title: true, district: true } },
      auditLogs: {
        orderBy: { timestamp: "asc" },
        include: {
          user: { select: { firstName: true, lastName: true, role: true } },
        },
      },
    },
  })

  if (!contract) notFound()

  // Only landlord, tenant, or admin can view
  const isParty =
    contract.landlordId === userId ||
    contract.tenantId   === userId ||
    role === "ADMIN"
  if (!isParty) redirect("/")

  const data = {
    contractId:   contract.id,
    status:       contract.status,
    documentHash: contract.documentHash,
    createdAt:    contract.createdAt.toISOString(),
    landlord: {
      name:  `${contract.landlord.firstName} ${contract.landlord.lastName}`,
      email: contract.landlord.email,
    },
    tenant: {
      name:  `${contract.tenant.firstName} ${contract.tenant.lastName}`,
      email: contract.tenant.email,
    },
    property: contract.property,
    entries: contract.auditLogs.map(l => ({
      id:         l.id,
      action:     l.action,
      userName:   `${l.user.firstName} ${l.user.lastName}`,
      userRole:   l.user.role,
      ipAddress:  l.ipAddress,
      userAgent:  l.userAgent,
      cryptoHash: l.cryptoHash,
      timestamp:  l.timestamp.toISOString(),
    })),
  }

  return <AuditTrailView data={data} />
}
