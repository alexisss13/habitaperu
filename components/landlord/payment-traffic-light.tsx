'use client'

import { useState } from 'react'
import { Notification02Icon, CheckmarkCircle01Icon, AlertCircleIcon, Clock01Icon } from 'hugeicons-react'

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
  tenant: { name: string; email: string }
  property: { title: string; district: string }
}

interface PaymentTrafficLightProps {
  payments: Payment[]
}

export function PaymentTrafficLight({ payments }: PaymentTrafficLightProps) {
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    if (isNaN(due.getTime())) return Infinity
    const now = new Date()
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getStatusDotClass = (status: string, dueDate: string) => {
    if (status === 'PAGADO') return 'bg-emerald-500'
    if (status === 'VENCIDO') return 'bg-red'
    return getDaysUntilDue(dueDate) <= 3 ? 'bg-accent-secondary' : 'bg-emerald-500'
  }

  const getStatusBgClass = (status: string, dueDate: string) => {
    if (status === 'PAGADO') return 'bg-emerald-500'
    if (status === 'VENCIDO') return 'bg-red'
    return getDaysUntilDue(dueDate) <= 3 ? 'bg-accent-secondary' : 'bg-emerald-500'
  }

  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'PAGADO') return <CheckmarkCircle01Icon size={16} className="text-white" />
    if (status === 'VENCIDO') return <AlertCircleIcon size={16} className="text-white" />
    return <Clock01Icon size={16} className="text-white" />
  }

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'PAGADO') return 'Pagado'
    if (status === 'VENCIDO') return 'Vencido'
    const diffDays = getDaysUntilDue(dueDate)
    if (diffDays <= 0) return 'Vence hoy'
    if (diffDays === 1) return 'Vence mañana'
    return `Vence en ${diffDays} días`
  }

  const getStatusTextClass = (status: string) => {
    if (status === 'VENCIDO') return 'text-red'
    if (status === 'PAGADO') return 'text-green'
    return 'text-accent-secondary'
  }

  const handleSendReminder = async (paymentId: string, tenantEmail: string) => {
    setSendingReminder(paymentId)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Recordatorio enviado a ${tenantEmail}`)
    setSendingReminder(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold tracking-tight text-text">Semáforo de Pagos</h2>
        <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-emerald-500" />
            <span>Al día</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-accent-secondary" />
            <span>Próximo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-red" />
            <span>Vencido</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="shrink-0">
                <div className={`size-12 rounded-xl ${getStatusBgClass(payment.status, payment.dueDate)} flex items-center justify-center`}>
                  {getStatusIcon(payment.status, payment.dueDate)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-text truncate">{payment.tenant.name}</h3>
                  <span className="text-sm font-bold text-text shrink-0">S/ {payment.amount.toLocaleString()}</span>
                </div>
                <p className="text-xs font-medium text-text-muted mb-1 truncate">
                  {payment.property.title} • {payment.property.district}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-text-muted">Vence: {formatDate(payment.dueDate)}</span>
                  <span className="text-text-muted">•</span>
                  <span className={`font-semibold ${getStatusTextClass(payment.status)}`}>
                    {getStatusText(payment.status, payment.dueDate)}
                  </span>
                </div>
              </div>

              {payment.status !== 'PAGADO' && (
                <button
                  onClick={() => handleSendReminder(payment.id, payment.tenant.email)}
                  disabled={sendingReminder === payment.id}
                  className={`shrink-0 size-12 bg-white border rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-slate-50 hover:border-accent
                    ${sendingReminder === payment.id ? 'border-accent' : 'border-slate-200'}`}
                  aria-label="Enviar recordatorio"
                >
                  {sendingReminder === payment.id ? (
                    <div className="size-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Notification02Icon size={20} className="text-text-muted" />
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckmarkCircle01Icon size={48} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-text mb-1">¡Todo al día!</p>
            <p className="text-xs font-medium text-text-muted">No hay pagos pendientes en este momento</p>
          </div>
        )}
      </div>
    </div>
  )
}
