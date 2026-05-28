'use client'

import { FileValidationIcon } from "hugeicons-react"
import type { ContractsData } from './contracts-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { cls: 'bg-green/10 text-green', label: 'Activo' }
    case 'FINISHED': return { cls: 'bg-red/10 text-red', label: 'Vencido' }
    case 'BREACHED_CANCELLED': return { cls: 'bg-red/10 text-red', label: 'Cancelado' }
    case 'DRAFT': return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: 'Borrador' }
    default: return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pendiente' }
  }
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' })

export function ContractsMobile({ data }: { data: ContractsData }) {
  const { contracts, stats } = data

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <FileValidationIcon size={24} className="text-admin-accent" />
          <h1 className="text-2xl font-bold text-admin-text">Contratos</h1>
        </div>
        <p className="text-xs text-admin-text-muted">Contratos de arrendamiento</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-admin-text' },
          { label: 'Activos', value: stats.activo, color: 'text-green' },
          { label: 'Vencidos', value: stats.vencido, color: 'text-red' },
          { label: 'Valor/mes', value: `S/ ${(stats.totalValue / 1000).toFixed(0)}k`, color: 'text-brown' },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-4 rounded-xl border border-admin-border">
            <div className="text-[0.625rem] font-bold text-admin-text-muted uppercase mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Contract Cards */}
      <div className="px-4 flex flex-col gap-3">
        {contracts.map(c => {
          const badge = statusBadge(c.status)
          return (
            <div key={c.id} className="bg-admin-card-bg rounded-xl border border-admin-border p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-admin-text mb-0.5">{c.property.title}</div>
                  <div className="text-xs text-admin-text-muted">{c.property.district}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[0.625rem] font-semibold shrink-0 ml-2 ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="size-7 rounded-full flex items-center justify-center text-white font-semibold text-[0.625rem] shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0f3457, #061829)' }}>
                  {c.tenant.firstName[0]}{c.tenant.lastName[0]}
                </div>
                <span className="text-xs text-admin-text">{c.tenant.firstName} {c.tenant.lastName}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-admin-border">
                <div className="text-[0.7rem] text-admin-text-muted">{fmtDate(c.startDate)} – {fmtDate(c.endDate)}</div>
                <div className="text-sm font-bold text-admin-text">S/ {c.monthlyRent.toLocaleString()}/mes</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
