'use client'

import { useState } from "react"
import { MoneyBag02Icon, Search01Icon, FilterIcon, CheckmarkCircle02Icon, Clock01Icon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import type { PaymentsData } from './payments-view'

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
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

export function PaymentsDesktop({ data }: { data: PaymentsData }) {
  const { payments, stats } = data
  const [search, setSearch] = useState("")

  const filtered = payments.filter(p => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      `${p.contract.tenant.firstName} ${p.contract.tenant.lastName}`.toLowerCase().includes(q) ||
      p.contract.tenant.email.toLowerCase().includes(q) ||
      p.contract.property.title.toLowerCase().includes(q) ||
      p.contract.property.district.toLowerCase().includes(q)
    )
  })

  const pagination = usePagination(filtered, 10)

  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <MoneyBag02Icon size={32} className="text-admin-accent" />
            <h1 className="text-3xl font-bold text-admin-text">Pagos</h1>
          </div>
          <button className="px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:-translate-y-px transition-all">
            + Registrar Pago
          </button>
        </div>
        <p className="text-sm text-admin-text-muted">Gestiona todos los pagos de rentas mensuales</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL PAGOS', value: stats.total, color: 'text-admin-text' },
          { label: 'PAGADOS', value: stats.pagado, color: 'text-green' },
          { label: 'PENDIENTES', value: stats.pendiente, color: 'text-[#f59e0b]' },
          { label: 'TOTAL RECAUDADO', value: `S/ ${stats.totalAmount.toLocaleString()}`, color: 'text-admin-text', sm: true },
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <MoneyBag02Icon size={48} className="text-admin-text-muted mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-admin-text mb-2">No se encontraron pagos</h3>
            <p className="text-sm text-admin-text-muted max-w-sm">
              No hay pagos que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[rgba(116,133,151,0.05)] border-b border-admin-border text-xs font-bold text-admin-text-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Inquilino</th>
                    <th className="px-6 py-4 font-bold">Propiedad</th>
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Monto</th>
                    <th className="px-6 py-4 font-bold">Método</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border text-sm text-admin-text">
                  {pagination.paginatedItems.map(p => {
                    const badge = statusBadge(p.status)
                    const { Icon } = badge
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[rgba(116,133,151,0.05)] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-5 font-mono text-xs text-admin-text-muted">
                          #{p.id.slice(0, 6)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                              style={{ background: 'linear-gradient(135deg, #0f3457, #061829)' }}>
                              {p.contract.tenant.firstName?.[0] ?? '?'}{p.contract.tenant.lastName?.[0] ?? ''}
                            </div>
                            <div className="font-semibold">
                              {p.contract.tenant.firstName} {p.contract.tenant.lastName}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-medium mb-0.5">{p.contract.property.title}</div>
                          <div className="text-xs text-admin-text-muted">{p.contract.property.district}</div>
                        </td>

                        <td className="px-6 py-5">
                          {fmtDate(p.paidDate || p.dueDate)}
                        </td>

                        <td className="px-6 py-5 font-bold text-base">
                          S/ {p.amount.toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span className={`font-semibold ${methodColor(p.paymentMethod)}`}>
                            {methodLabel(p.paymentMethod)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit ${badge.cls}`}>
                            <Icon size={14} />
                            <span className="text-xs font-semibold">{badge.label}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button className="px-3 py-1.5 border border-admin-border rounded-md text-xs font-medium hover:bg-admin-bg transition-colors">
                            Ver
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-admin-card-bg rounded-b-xl border-t border-admin-border">
              <AdminPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
                itemLabel="pagos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
