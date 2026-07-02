'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'FINISHED', label: 'Vencidos' },
  { value: 'BREACHED_CANCELLED', label: 'Cancelados' },
  { value: 'DRAFT', label: 'Borradores' },
  { value: 'PENDING_TENANT', label: 'Pend. Inquilino' },
  { value: 'PENDING_LANDLORD', label: 'Pend. Arrendador' },
] as const

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

const duration = (start: string, end: string) => {
  const m = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30))
  return `${m} ${m === 1 ? 'mes' : 'meses'}`
}

export function ContractsDesktop({ data }: { data: ContractsData }) {
  const { contracts, stats } = data
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      `${c.tenant.firstName} ${c.tenant.lastName}`.toLowerCase().includes(q) ||
      c.tenant.email.toLowerCase().includes(q) ||
      c.property.title.toLowerCase().includes(q) ||
      c.property.district.toLowerCase().includes(q)
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const pagination = usePagination(filtered, 10, [statusFilter])
  const activeStatusLabel = STATUS_FILTERS.find(s => s.value === statusFilter)?.label ?? 'Todos'

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Contratos</h1>

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
            <div className="absolute top-[calc(100%+8px)] right-0 bg-admin-card-bg border border-admin-border rounded-xl shadow-lg min-w-[190px] py-1.5 z-20">
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
            <FileValidationIcon size={48} className="text-admin-text-muted mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-admin-text mb-2">No se encontraron contratos</h3>
            <p className="text-sm text-admin-text-muted max-w-sm">
              No hay contratos que coincidan con tu búsqueda. Intenta con otros términos.
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
                    <th className="px-6 py-4 font-bold">Periodo</th>
                    <th className="px-6 py-4 font-bold">Renta Mensual</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border text-sm text-admin-text">
                  {pagination.paginatedItems.map(c => {
                    const badge = statusBadge(c.status)
                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-[rgba(116,133,151,0.05)] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-5 font-mono text-xs text-admin-text-muted">
                          #{c.id.slice(0, 6)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                              style={{ background: 'linear-gradient(135deg, #0f3457, #061829)' }}>
                              {c.tenant.firstName?.[0] ?? '?'}{c.tenant.lastName?.[0] ?? ''}
                            </div>
                            <div>
                              <div className="font-semibold">{c.tenant.firstName} {c.tenant.lastName}</div>
                              <div className="text-[0.7rem] text-admin-text-muted">{c.tenant.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-medium mb-0.5">{c.property.title}</div>
                          <div className="text-xs text-admin-text-muted">{c.property.district} • {c.property.owner.firstName} {c.property.owner.lastName}</div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="text-[0.8rem] mb-1">{fmtDate(c.startDate)} – {fmtDate(c.endDate)}</div>
                          <div className="text-[0.7rem] text-admin-text-muted">Duración: {duration(c.startDate, c.endDate)}</div>
                        </td>

                        <td className="px-6 py-5 font-bold text-base">
                          S/ {c.monthlyRent.toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/contracts/${c.id}`}
                            className="inline-block px-3 py-1.5 border border-admin-border rounded-md text-xs font-medium hover:bg-admin-bg transition-colors no-underline text-admin-text"
                          >
                            Ver
                          </Link>
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
                itemLabel="contratos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
