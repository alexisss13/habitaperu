'use client'

import { MoneyBag02Icon, CheckmarkCircle02Icon, Clock01Icon } from "hugeicons-react"
import type { PaymentsData } from './payments-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'PAGADO': return { cls: 'bg-green/10 text-green', label: 'Pagado', Icon: CheckmarkCircle02Icon }
    case 'PENDIENTE': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pendiente', Icon: Clock01Icon }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status, Icon: Clock01Icon }
  }
}

const fmtDate = (d: Date | null) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'

export function PaymentsMobile({ data }: { data: PaymentsData }) {
  const { payments, stats } = data

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <MoneyBag02Icon size={24} className="text-brown" />
          <h1 className="text-2xl font-bold text-admin-text">Pagos</h1>
        </div>
        <p className="text-xs text-admin-text-muted">Rentas mensuales</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-admin-text' },
          { label: 'Pagados', value: stats.pagado, color: 'text-green' },
          { label: 'Pendientes', value: stats.pendiente, color: 'text-[#f59e0b]' },
          { label: 'Recaudado', value: `S/ ${(stats.totalAmount / 1000).toFixed(0)}k`, color: 'text-brown' },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-4 rounded-xl border border-admin-border">
            <div className="text-[0.625rem] font-bold text-admin-text-muted uppercase mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Payment Cards */}
      <div className="px-4 flex flex-col gap-3">
        {payments.length === 0 ? (
          <div className="bg-admin-card-bg rounded-xl border border-admin-border p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <MoneyBag02Icon size={36} className="text-admin-text-muted mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-admin-text mb-1">No se encontraron pagos</h3>
            <p className="text-xs text-admin-text-muted max-w-xs">
              No hay pagos registrados en el sistema.
            </p>
          </div>
        ) : (
          payments.map(p => {
            const badge = statusBadge(p.status)
            const { Icon } = badge
            return (
              <div key={p.id} className="bg-admin-card-bg rounded-xl border border-admin-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-admin-text mb-0.5">
                      {p.contract?.property?.title ?? ''}
                    </div>
                    <div className="text-xs text-admin-text-muted">{p.contract.property.district}</div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${badge.cls} shrink-0 ml-2`}>
                    <Icon size={12} />
                    <span className="text-[0.625rem] font-semibold">{badge.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-full flex items-center justify-center text-white font-semibold text-[0.625rem] shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0f3457, #061829)' }}>
                    {p.contract.tenant.firstName?.[0] ?? '?'}{p.contract.tenant.lastName?.[0] ?? ''}
                  </div>
                  <span className="text-xs text-admin-text">{p.contract.tenant.firstName} {p.contract.tenant.lastName}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-admin-border">
                  <div className="text-[0.7rem] text-admin-text-muted">{fmtDate(p.paidDate || p.dueDate)}</div>
                  <div className="text-sm font-bold text-admin-text">S/ {p.amount.toLocaleString()}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
