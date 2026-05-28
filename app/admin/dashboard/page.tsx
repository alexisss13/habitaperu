import { prisma } from "@/lib/db"
import { AdminDashboardView } from './dashboard-view'

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalProperties,
    activeContracts,
    totalPayments,
    recentUsers,
    recentProperties,
    usersByRole,
    propertiesByStatus
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.contract.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, verified: true }
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, district: true, price: true, status: true, createdAt: true,
        owner: { select: { firstName: true, lastName: true } }
      }
    }),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.property.groupBy({ by: ['status'], _count: true })
  ])

  return (
    <AdminDashboardView data={{
      totalUsers,
      totalProperties,
      activeContracts,
      totalRevenue: Number(totalPayments._sum.amount || 0),
      tenants: usersByRole.find(u => u.role === 'TENANT')?._count || 0,
      landlords: usersByRole.find(u => u.role === 'LANDLORD')?._count || 0,
      disponibles: propertiesByStatus.find(p => p.status === 'DISPONIBLE')?._count || 0,
      ocupadas: propertiesByStatus.find(p => p.status === 'OCUPADA')?._count || 0,
      recentUsers,
      recentProperties: recentProperties.map(p => ({ ...p, price: Number(p.price) }))
    }} />
  )
}
