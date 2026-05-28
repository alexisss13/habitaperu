'use client'

import { FileValidationIcon, Search01Icon, FilterIcon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import type { ContractsData } from './contracts-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { cls: 'bg-green/10 text-green', label: 'Activo' }
    case 'FINISHED': return { cls: 'bg-red/10 text-red', label: 'Vencido' }
    case 'BREACHED_CANCELLED': return { cls: 'bg-red/10 text-red', label: 'Cancelado' }
    case 'DRAFT': return { cls: 'bg-[rgba(116,133,151,0.1)] text-text-muted', label: 'Borrador' }
    case 'PENDING_TENANT': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pend. Inquilino' }
    case 'PENDING_LANDLORD': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pend. Arrendador' }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status }
  }
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

const duration = (start: Date, end: Date) => {
  const m = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30))
  return `${m} ${m === 1 ? 'mes' : 'meses'}`
}

export function ContractsDesktop({ data }: { data: ContractsData }) {
  const { contracts, stats } = data
  const pagination = usePagination(contracts, 10)

  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <FileValidationIcon size={32} className="text-admin-accent" />
            <h1 className="text-3xl font-bold text-admin-text">Contratos</h1>
          </div>
          <button className="px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:-translate-y-px transition-all">
            + Nuevo Contrato
          </button>
        </div>
        <p className="text-sm text-admin-text-muted">Gestiona todos los contratos de arrendamiento</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL', value: stats.total, color: 'text-admin-text' },
          { label: 'ACTIVOS', value: stats.activo, color: 'text-green' },
          { label: 'VENCIDOS', value: stats.vencido, color: 'text-red' },
          { label: 'VALOR MENSUAL', value: `S/ ${stats.totalValue.toLocaleString()}`, color: 'text-admin-text', sm: true },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
            <div className="text-xs font-bold text-admin-text-muted mb-2">{s.label}</div>
            <div className={`font-bold ${s.color} ${s.sm ? 'text-2xl' : 'text-[2rem]'}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-admin-card-bg px-6 py-4 rounded-xl border border-admin-border mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search01Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            type="text"
            placeholder="Buscar por inquilino, propiedad..."
            className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border rounded-lg text-sm font-medium text-admin-text hover:bg-admin-bg transition-colors">
          <FilterIcon size={16} />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
        <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_1fr_0.8fr_0.5fr] px-6 py-4 border-b border-admin-border bg-[rgba(116,133,151,0.05)] text-xs font-bold text-admin-text-muted uppercase tracking-wider">
          <div>ID</div>
          <div>Inquilino</div>
          <div>Propiedad</div>
          <div>Periodo</div>
          <div>Renta Mensual</div>
          <div>Estado</div>
          <div></div>
        </div>

        {pagination.paginatedItems.map(c => {
          const badge = statusBadge(c.status)
          return (
            <div
              key={c.id}
              className="grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_1fr_0.8fr_0.5fr] px-6 py-5 border-b border-admin-border items-center hover:bg-[rgba(116,133,151,0.05)] transition-colors cursor-pointer"
            >
              <div className="text-xs font-mono text-admin-text-muted">#{c.id.slice(0, 6)}</div>

              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0f3457, #061829)' }}>
                  {c.tenant.firstName[0]}{c.tenant.lastName[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-admin-text">{c.tenant.firstName} {c.tenant.lastName}</div>
                  <div className="text-[0.7rem] text-admin-text-muted">{c.tenant.email}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-admin-text mb-0.5">{c.property.title}</div>
                <div className="text-xs text-admin-text-muted">{c.property.district} • {c.property.owner.firstName} {c.property.owner.lastName}</div>
              </div>

              <div>
                <div className="text-[0.8rem] text-admin-text mb-1">{fmtDate(c.startDate)} – {fmtDate(c.endDate)}</div>
                <div className="text-[0.7rem] text-admin-text-muted">Duración: {duration(c.startDate, c.endDate)}</div>
              </div>

              <div className="text-base font-bold text-admin-text">S/ {c.monthlyRent.toLocaleString()}</div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
              </div>

              <div className="flex justify-end">
                <button className="px-3 py-1.5 border border-admin-border rounded-md text-xs text-admin-text font-medium hover:bg-admin-bg transition-colors">
                  Ver
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="bg-admin-card-bg rounded-b-xl border border-t-0 border-admin-border">
        <AdminPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="contratos"
        />
      </div>
    </div>
  )
}
