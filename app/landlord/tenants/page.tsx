import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { TenantsView } from "./tenants-view"
import { hasLandlordRole } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function LandlordTenantsPage() {
  const session = await auth()
  if (!session || !hasLandlordRole(session.user)) redirect("/login")

  const landlordId = session.user.id

  // Obtener todos los contratos del arrendador con datos del inquilino
  const contracts = await prisma.contract.findMany({
    where: { landlordId },
    orderBy: { createdAt: "desc" },
    include: {
      tenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          verified: true,
          createdAt: true,
          kycVerification: {
            select: { status: true, dniVerified: true, biometricVerified: true, backgroundCheck: true },
          },
        },
      },
      property: {
        select: { id: true, title: true, district: true, type: true },
      },
      payments: {
        orderBy: { dueDate: "desc" },
        take: 1,
        select: { status: true, dueDate: true, amount: true },
      },
    },
  })

  // Deduplicar inquilinos (un inquilino puede tener varios contratos)
  const tenantMap = new Map<string, (typeof contracts)[number][]>()
  for (const c of contracts) {
    const existing = tenantMap.get(c.tenantId) ?? []
    tenantMap.set(c.tenantId, [...existing, c])
  }

  const tenants = Array.from(tenantMap.entries()).map(([tenantId, tenantContracts]) => {
    const latest = tenantContracts[0]
    const active = tenantContracts.find((c) => c.status === "ACTIVE")
    const lastPayment = (active ?? latest).payments[0]

    return {
      id: tenantId,
      firstName: latest.tenant.firstName,
      lastName: latest.tenant.lastName,
      email: latest.tenant.email,
      phone: latest.tenant.phone,
      verified: latest.tenant.verified,
      memberSince: latest.tenant.createdAt.toISOString(),
      kyc: latest.tenant.kycVerification
        ? {
            status: latest.tenant.kycVerification.status,
            dniVerified: latest.tenant.kycVerification.dniVerified,
            biometricVerified: latest.tenant.kycVerification.biometricVerified,
            backgroundCheck: latest.tenant.kycVerification.backgroundCheck,
          }
        : null,
      activeContract: active
        ? {
            id: active.id,
            status: active.status,
            monthlyRent: Number(active.monthlyRent),
            startDate: active.startDate.toISOString(),
            endDate: active.endDate.toISOString(),
            property: active.property,
          }
        : null,
      contractsCount: tenantContracts.length,
      lastPayment: lastPayment
        ? {
            status: lastPayment.status,
            dueDate: lastPayment.dueDate.toISOString(),
            amount: Number(lastPayment.amount),
          }
        : null,
    }
  })

  return <TenantsView tenants={tenants} />
}
