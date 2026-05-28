import { prisma } from "@/lib/db"
import { PaymentsView } from './payments-view'

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      contract: {
        include: {
          tenant: { select: { firstName: true, lastName: true, email: true } },
          property: { select: { title: true, district: true } }
        }
      }
    }
  })

  const mapped = payments.map(p => ({ ...p, amount: Number(p.amount) }))

  const stats = {
    total: mapped.length,
    pagado: mapped.filter(p => p.status === 'PAGADO').length,
    pendiente: mapped.filter(p => p.status === 'PENDIENTE').length,
    totalAmount: mapped.filter(p => p.status === 'PAGADO').reduce((s, p) => s + p.amount, 0),
    thisMonth: mapped.filter(p => {
      const pm = new Date(p.createdAt).getMonth()
      return pm === new Date().getMonth() && p.status === 'PAGADO'
    }).reduce((s, p) => s + p.amount, 0)
  }

  return <PaymentsView data={{ payments: mapped, stats }} />
}
