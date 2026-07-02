import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import { UsersView } from './users-view'

export default async function UsersPage(props: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const searchParams = await props.searchParams
  const page = Math.max(1, parseInt(searchParams?.page ?? "1") || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit ?? "25") || 25))
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        role: true, verified: true, createdAt: true,
        _count: { select: { propertiesOwned: true, contractsAsTenant: true } }
      }
    }),
    prisma.user.count(),
  ])

  const [tenants, landlords, admins, verified] = await Promise.all([
    prisma.user.count({ where: { role: Role.TENANT } }),
    prisma.user.count({ where: { role: Role.LANDLORD } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.user.count({ where: { verified: true } }),
  ])

  const stats = { total, tenants, landlords, admins, verified }

  return <UsersView data={{ users, stats, page, limit, totalPages: Math.ceil(total / limit) }} />
}
