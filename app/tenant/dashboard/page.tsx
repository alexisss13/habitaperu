import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TenantDashboardView } from './dashboard-view'
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

async function getTenantDashboardData(tenantId: string) {
  try {
    // 1. Obtener contrato activo y la propiedad
    const activeContract = await prisma.contract.findFirst({
      where: {
        tenantId: tenantId,
        status: 'ACTIVE',
      },
      include: {
        property: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    })

    // 2. Obtener el próximo pago pendiente o vencido
    const nextPayment = await prisma.payment.findFirst({
      where: {
        tenantId: tenantId,
        status: { in: ['PENDIENTE', 'VENCIDO'] },
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    // 3. Obtener el historial de pagos
    const payments = await prisma.payment.findMany({
      where: {
        tenantId: tenantId,
      },
      orderBy: {
        dueDate: 'desc',
      },
      take: 10,
    })

    return {
      activeProperty: activeContract ? {
        title: activeContract.property.title,
        price: Number(activeContract.property.price),
      } : null,
      nextPayment: nextPayment ? {
        dueDate: nextPayment.dueDate.toISOString(),
        amount: Number(nextPayment.amount),
      } : null,
      paymentHistory: payments.map(payment => {
        const dueDate = payment.dueDate
        const formattedMonth = dueDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
        const monthName = formattedMonth.replace(' de ', ' ')
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
        
        return {
          id: payment.id,
          month: capitalizedMonth,
          date: payment.paidDate 
            ? payment.paidDate.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : payment.dueDate.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          amount: Number(payment.amount),
          status: payment.status === 'PAGADO' ? 'PAID' : payment.status === 'VENCIDO' ? 'OVERDUE' : 'PENDING',
        }
      }),
      favoritesCount: 0, // No model in DB, keep it 0 or mock
    }
  } catch (error) {
    console.error('Error fetching tenant dashboard data:', error)
    // Fallback data for safety
    return {
      activeProperty: null,
      nextPayment: null,
      paymentHistory: [],
      favoritesCount: 0,
    }
  }
}

export default async function TenantDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "TENANT") redirect("/login")
  
  const tenantId = session.user.id || ''
  const data = await getTenantDashboardData(tenantId)

  return <TenantDashboardView session={session} data={data} />
}
