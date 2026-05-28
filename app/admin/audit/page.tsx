import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { AuditView } from "./audit-view"

export const dynamic = "force-dynamic"

export default async function AdminAuditPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    notFound()
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      contract: {
        select: {
          id: true,
          property: {
            select: {
              title: true,
              district: true,
            },
          },
        },
      },
    },
  })

  // Format and serialize date objects for the client components
  const mappedLogs = logs.map((log) => ({
    id: log.id,
    action: log.action,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    cryptoHash: log.cryptoHash,
    timestamp: log.timestamp.toISOString(),
    contractId: log.contractId,
    user: log.user,
    propertyTitle: log.contract?.property?.title || "N/A",
    propertyDistrict: log.contract?.property?.district || "N/A",
  }))

  return <AuditView logs={mappedLogs} />
}
