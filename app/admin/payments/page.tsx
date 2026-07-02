import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import { PaymentsView } from './payments-view'
export default async function PaymentsPage(props: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const searchParams = await props.searchParams
  const page = Math.max(1, parseInt(searchParams?.page ?? "1") || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit ?? "25") || 25))
  const skip = (page - 1) * limit

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        contract: {
          select: {
            tenant: { select: { firstName: true, lastName: true, email: true } },
            property: { select: { title: true, district: true } }
          }
        }
      }
    }),
    prisma.payment.count(),
  ])

  const mapped = payments.map(p => ({ ...p, amount: Number(p.amount) }))

  const [pagado, pendiente] = await Promise.all([
    prisma.payment.count({ where: { status: 'PAGADO' as any } }),
    prisma.payment.count({ where: { status: 'PENDIENTE' as any } }),
  ])
  const totalAmount = await prisma.payment.aggregate({
    where: { status: 'PAGADO' as any },
    _sum: { amount: true },
  }).then(r => Number(r._sum.amount ?? 0))
  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)
  const thisMonthPaid = await prisma.payment.aggregate({
    where: { status: 'PAGADO' as any, createdAt: { gte: thisMonthStart } },
    _sum: { amount: true },
  }).then(r => Number(r._sum.amount ?? 0))

  const stats = { total, pagado, pendiente, totalAmount, thisMonth: thisMonthPaid }

  return <PaymentsView data={{ payments: mapped, stats, page, limit, totalPages: Math.ceil(total / limit) }} />
}
