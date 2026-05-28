import { prisma } from "@/lib/db"
import { UsersView } from './users-view'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { propertiesOwned: true, contractsAsTenant: true } }
    }
  })

  const stats = {
    total: users.length,
    tenants: users.filter(u => u.role === 'TENANT').length,
    landlords: users.filter(u => u.role === 'LANDLORD').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    verified: users.filter(u => u.verified).length
  }

  return <UsersView data={{ users, stats }} />
}
