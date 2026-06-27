import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import { ContractsView } from './contracts-view'
export default async function ContractsPage(props: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const searchParams = await props.searchParams
  const page = Math.max(1, parseInt(searchParams?.page ?? "1") || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit ?? "25") || 25))
  const skip = (page - 1) * limit

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tenant: { select: { firstName: true, lastName: true, email: true } },
        property: {
          select: {
            title: true, district: true, price: true,
            owner: { select: { firstName: true, lastName: true } }
          }
        }
      }
    }),
    prisma.contract.count(),
  ])

  const mapped = contracts.map(c => ({
    ...c,
    monthlyRent: Number(c.monthlyRent),
    deposit: Number(c.deposit),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    landlordSignedAt: c.landlordSignedAt?.toISOString() ?? null,
    tenantSignedAt: c.tenantSignedAt?.toISOString() ?? null,
    successFeePaidAt: c.successFeePaidAt?.toISOString() ?? null,
    property: { ...c.property, price: Number(c.property.price) },
  }))

  const [activo, finished, breached] = await Promise.all([
    prisma.contract.count({ where: { status: 'ACTIVE' as any } }),
    prisma.contract.count({ where: { status: 'FINISHED' as any } }),
    prisma.contract.count({ where: { status: 'BREACHED_CANCELLED' as any } }),
  ])
  const totalActiveValue = await prisma.contract.aggregate({
    where: { status: 'ACTIVE' as any },
    _sum: { monthlyRent: true },
  }).then(r => Number(r._sum.monthlyRent ?? 0))

  const stats = {
    total,
    activo,
    vencido: finished + breached,
    totalValue: totalActiveValue,
  }

  return <ContractsView data={{ contracts: mapped, stats, page, limit, totalPages: Math.ceil(total / limit) }} />
}
