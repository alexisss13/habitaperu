'use client'

import { useState } from 'react'
import { Notification02Icon, CheckmarkCircle01Icon, AlertCircleIcon, Clock01Icon } from 'hugeicons-react'

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
  tenant: {
    name: string
    email: string
  }
  property: {
    title: string
    district: string
  }
}

interface PaymentTrafficLightProps {
  payments: Payment[]
}

export function PaymentTrafficLight({ payments }: PaymentTrafficLightProps) {
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'PAID') return 'bg-emerald-500'
    if (status === 'OVERDUE') return 'bg-red-500'
    
    // Check if due date is within 3 days
    const due = new Date(dueDate)
    const now = new Date()
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'PAID') return <CheckmarkCircle01Icon size={16} className="text-white" />
    if (status === 'OVERDUE') return <AlertCircleIcon size={16} className="text-white" />
    return <Clock01Icon size={16} className="text-white" />
  }

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'PAID') return 'Pagado'
    if (status === 'OVERDUE') return 'Vencido'
    
    const due = new Date(dueDate)
    const now = new Date()
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 'Vence hoy'
    if (diffDays === 1) return 'Vence mañana'
    return `Vence en ${diffDays} días`
  }

  const getStatusTextColor = (status: string) => {
    if (status === 'OVERDUE') return { color: 'var(--red)' }
    if (status === 'PAID') return { color: 'var(--green)' }
    return { color: 'var(--accent-secondary)' }
  }

  const handleSendReminder = async (paymentId: string, tenantEmail: string) => {
    setSendingReminder(paymentId)
    
    // Simular envío de recordatorio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Aquí iría la lógica real de envío de email/notificación
    console.log(`Recordatorio enviado a ${tenantEmail}`)
    
    setSendingReminder(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Semáforo de Pagos
        </h2>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span style={{ color: 'var(--text-muted)' }}>Al día</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
            <span style={{ color: 'var(--text-muted)' }}>Próximo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--red)' }}></div>
            <span style={{ color: 'var(--text-muted)' }}>Vencido</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {/* Traffic Light Indicator */}
              <div className="flex-shrink-0">
                <div
                  className={`h-12 w-12 rounded-xl ${getStatusColor(
                    payment.status,
                    payment.dueDate
                  )} flex items-center justify-center shadow-sm`}
                >
                  {getStatusIcon(payment.status, payment.dueDate)}
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
                    {payment.tenant.name}
                  </h3>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text)' }}>
                    S/ {payment.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs font-medium mb-1 truncate" style={{ color: 'var(--text-muted)' }}>
                  {payment.property.title} • {payment.property.district}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
                    Vence: {formatDate(payment.dueDate)}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span
                    className="font-semibold"
                    style={getStatusTextColor(payment.status)}
                  >
                    {getStatusText(payment.status, payment.dueDate)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {payment.status !== 'PAID' && (
                <button
                  onClick={() => handleSendReminder(payment.id, payment.tenant.email)}
                  disabled={sendingReminder === payment.id}
                  className="flex-shrink-0 h-12 px-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  style={{
                    ['--tw-ring-color' as any]: 'var(--accent)',
                    borderColor: sendingReminder === payment.id ? 'var(--accent)' : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (sendingReminder !== payment.id) {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sendingReminder !== payment.id) {
                      e.currentTarget.style.borderColor = 'rgb(226, 232, 240)'
                    }
                  }}
                  aria-label="Enviar recordatorio"
                >
                  {sendingReminder === payment.id ? (
                    <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
                  ) : (
                    <Notification02Icon size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckmarkCircle01Icon size={48} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
              ¡Todo al día!
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              No hay pagos pendientes en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
