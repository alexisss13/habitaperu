'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MoneyBag02Icon, Search01Icon, FilterIcon, CheckmarkCircle02Icon, Clock01Icon, Cancel01Icon, Image02Icon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import type { AdminPayment, PaymentsData } from './payments-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'PAGADO': return { cls: 'bg-green/10 text-green', label: 'Pagado', Icon: CheckmarkCircle02Icon }
    case 'PENDIENTE': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Pendiente', Icon: Clock01Icon }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status, Icon: Clock01Icon }
  }
}

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'PAGADO', label: 'Pagados' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'VENCIDO', label: 'Vencidos' },
] as const

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
  const [statusFilter, setStatusFilter] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewingPayment, setViewingPayment] = useState<AdminPayment | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = payments.filter(p => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      `${p.contract.tenant.firstName} ${p.contract.tenant.lastName}`.toLowerCase().includes(q) ||
      p.contract.tenant.email.toLowerCase().includes(q) ||
      p.contract.property.title.toLowerCase().includes(q) ||
      p.contract.property.district.toLowerCase().includes(q)
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const pagination = usePagination(filtered, 10, [statusFilter])
  const activeStatusLabel = STATUS_FILTERS.find(s => s.value === statusFilter)?.label ?? 'Todos'

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Pagos</h1>

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
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-admin-border rounded-lg text-sm font-medium text-admin-text hover:bg-admin-bg transition-colors"
          >
            <FilterIcon size={16} />
            {statusFilter ? `Estado: ${activeStatusLabel}` : 'Filtros'}
          </button>
          {filterOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-admin-card-bg border border-admin-border rounded-xl shadow-lg min-w-[180px] py-1.5 z-20">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s.value}
                  onClick={() => { setStatusFilter(s.value); setFilterOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm cursor-pointer border-none bg-transparent hover:bg-admin-bg transition-colors ${
                    statusFilter === s.value ? 'font-bold text-admin-accent' : 'text-admin-text'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
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
                        onClick={() => setViewingPayment(p)}
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
                          <button
                            onClick={() => setViewingPayment(p)}
                            className="px-3 py-1.5 border border-admin-border rounded-md text-xs font-medium hover:bg-admin-bg transition-colors cursor-pointer text-admin-text"
                          >
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

      {/* Detail modal */}
      {viewingPayment && (() => {
        const badge = statusBadge(viewingPayment.status)
        return (
          <div
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onClick={() => setViewingPayment(null)}
          >
            <div
              className="bg-admin-card-bg rounded-2xl border border-admin-border shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-mono text-admin-text-muted mb-1">#{viewingPayment.id.slice(0, 8)}</div>
                  <div className="text-2xl font-bold text-admin-text">S/ {viewingPayment.amount.toLocaleString()}</div>
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
                  <span className="text-admin-text-muted">Fecha de vencimiento</span>
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
                    className="flex items-center justify-center gap-2 py-2.5 border border-admin-border rounded-lg text-sm font-semibold text-admin-text hover:bg-admin-bg transition-colors no-underline"
                  >
                    <Image02Icon size={16} />
                    Ver comprobante
                  </a>
                ) : (
                  <p className="text-xs text-admin-text-muted text-center py-1">Sin comprobante subido</p>
                )}

                <Link
                  href={`/contracts/${viewingPayment.contractId}`}
                  className="flex items-center justify-center gap-2 py-2.5 border border-admin-border rounded-lg text-sm font-semibold text-admin-text hover:bg-admin-bg transition-colors no-underline"
                >
                  Ver contrato completo
                </Link>
              </div>

              <button
                onClick={() => setViewingPayment(null)}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-admin-text-muted hover:text-admin-text transition-colors cursor-pointer bg-transparent border-none"
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
