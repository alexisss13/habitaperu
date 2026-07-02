'use client'

import { useState } from "react"
import Link from "next/link"
import { MoneyBag02Icon, CheckmarkCircle02Icon, Clock01Icon, Cancel01Icon, Image02Icon } from "hugeicons-react"
import type { AdminPayment, PaymentsData } from './payments-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'PAGADO': return { cls: 'bg-green/10 text-green', label: 'Pagado', Icon: CheckmarkCircle02Icon }
    case 'PENDIENTE': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pendiente', Icon: Clock01Icon }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status, Icon: Clock01Icon }
  }
}

const methodColor = (m: string | null) => {
  switch (m) {
    case 'TRANSFERENCIA': return 'text-accent'
    case 'TARJETA': return 'text-accent-secondary'
    case 'EFECTIVO': return 'text-green'
    case 'YAPE': return 'text-[#6b21a8]'
    case 'PLIN': return 'text-[#0891b2]'
    default: return 'text-admin-text-muted'
  }
}

const methodLabel = (m: string | null) => {
  switch (m) {
    case 'TRANSFERENCIA': return 'Transferencia'
    case 'TARJETA': return 'Tarjeta'
    case 'EFECTIVO': return 'Efectivo'
    case 'YAPE': return 'Yape'
    case 'PLIN': return 'Plin'
    default: return m ?? '-'
  }
}

const fmtDate = (d: Date | null) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'

export function PaymentsMobile({ data }: { data: PaymentsData }) {
  const { payments, stats } = data
  const [viewingPayment, setViewingPayment] = useState<AdminPayment | null>(null)

  return (
    <div className="min-h-screen pb-8">
      <h1 className="text-lg font-bold text-admin-text px-4 pt-6">Pagos</h1>

      {/* Stats */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-5">
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
              <div
                key={p.id}
                onClick={() => setViewingPayment(p)}
                className="bg-admin-card-bg rounded-xl border border-admin-border p-4 cursor-pointer"
              >
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

      {/* Detail modal */}
      {viewingPayment && (() => {
        const badge = statusBadge(viewingPayment.status)
        return (
          <div
            className="fixed inset-0 bg-black/50 z-[200] flex items-end justify-center"
            onClick={() => setViewingPayment(null)}
          >
            <div
              className="bg-admin-card-bg rounded-t-2xl border-t border-admin-border shadow-xl w-full p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-admin-border rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-mono text-admin-text-muted mb-1">#{viewingPayment.id.slice(0, 8)}</div>
                  <div className="text-xl font-bold text-admin-text">S/ {viewingPayment.amount.toLocaleString()}</div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${badge.cls}`}>
                  <badge.Icon size={14} />
                  <span className="text-xs font-semibold">{badge.label}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Inquilino</span>
                  <span className="font-semibold text-admin-text">
                    {viewingPayment.contract.tenant.firstName} {viewingPayment.contract.tenant.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Propiedad</span>
                  <span className="font-semibold text-admin-text text-right">{viewingPayment.contract.property.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Método de pago</span>
                  <span className={`font-semibold ${methodColor(viewingPayment.paymentMethod)}`}>
                    {methodLabel(viewingPayment.paymentMethod)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Vencimiento</span>
                  <span className="font-semibold text-admin-text">{fmtDate(viewingPayment.dueDate)}</span>
                </div>
                {viewingPayment.paidDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-admin-text-muted">Fecha de pago</span>
                    <span className="font-semibold text-admin-text">{fmtDate(viewingPayment.paidDate)}</span>
                  </div>
                )}
                {viewingPayment.notes && (
                  <div>
                    <span className="text-admin-text-muted block mb-1">Notas</span>
                    <p className="text-admin-text bg-admin-bg rounded-lg p-3 text-xs leading-relaxed">{viewingPayment.notes}</p>
                  </div>
                )}

                <div className="h-px bg-admin-border my-1" />

                {viewingPayment.receipt ? (
                  <a
                    href={viewingPayment.receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-admin-border rounded-lg text-sm font-semibold text-admin-text no-underline"
                  >
                    <Image02Icon size={16} />
                    Ver comprobante
                  </a>
                ) : (
                  <p className="text-xs text-admin-text-muted text-center py-1">Sin comprobante subido</p>
                )}

                <Link
                  href={`/contracts/${viewingPayment.contractId}`}
                  className="flex items-center justify-center gap-2 py-2.5 border border-admin-border rounded-lg text-sm font-semibold text-admin-text no-underline"
                >
                  Ver contrato completo
                </Link>
              </div>

              <button
                onClick={() => setViewingPayment(null)}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-admin-text-muted cursor-pointer bg-transparent border-none"
              >
                <Cancel01Icon size={14} />
                Cerrar
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
