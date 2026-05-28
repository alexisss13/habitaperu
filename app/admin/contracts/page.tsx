import { prisma } from "@/lib/db"
import { ContractsView } from './contracts-view'

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
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
  })

  const mapped = contracts.map(c => ({
    ...c,
    monthlyRent: Number(c.monthlyRent),
    property: { ...c.property, price: Number(c.property.price) }
  }))

  const stats = {
    total: mapped.length,
    activo: mapped.filter(c => c.status === 'ACTIVE').length,
    vencido: mapped.filter(c => c.status === 'FINISHED' || c.status === 'BREACHED_CANCELLED').length,
    totalValue: mapped.filter(c => c.status === 'ACTIVE').reduce((sum, c) => sum + c.monthlyRent, 0)
  }

  return <ContractsView data={{ contracts: mapped, stats }} />
}
