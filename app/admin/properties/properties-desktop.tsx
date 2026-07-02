'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Building03Icon, Search01Icon, FilterIcon, Location01Icon, BedIcon, Bathtub02Icon, PauseIcon, PlayIcon, GridViewIcon, ListViewIcon, Delete02Icon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import { setPropertyModerationStatus, deletePropertyAction } from "@/app/actions/property-actions"
import type { PropertiesData } from './properties-view'

const statusBadge = (status: string, deletedAt: Date | null) => {
  if (deletedAt) return { cls: 'bg-[rgba(116,133,151,0.15)] text-admin-text-muted', label: 'Archivada' }
  switch (status) {
    case 'DISPONIBLE': return { cls: 'bg-green/10 text-green', label: 'Disponible' }
    case 'OCUPADA': return { cls: 'bg-red/10 text-red', label: 'Ocupada' }
    case 'MANTENIMIENTO': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Mantenimiento' }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status }
  }
}

const STATUS_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'DISPONIBLE', label: 'Disponibles' },
  { value: 'OCUPADA', label: 'Ocupadas' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
] as const

export function PropertiesDesktop({ data }: { data: PropertiesData }) {
  const { properties, stats } = data
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const router = useRouter()
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleModeration = async (propertyId: string, currentStatus: string) => {
    setPendingId(propertyId)
    try {
      const nextStatus = currentStatus === 'MANTENIMIENTO' ? 'DISPONIBLE' : 'MANTENIMIENTO'
      await setPropertyModerationStatus(propertyId, nextStatus)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    setPendingId(propertyId)
    try {
      const result = await deletePropertyAction(propertyId)
      if (!result.success) alert(result.error)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  const filtered = properties.filter(p => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      `${p.owner.firstName} ${p.owner.lastName}`.toLowerCase().includes(q)
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const pagination = usePagination(filtered, 9, [statusFilter]) // 3 cols × 3 rows
  const activeStatusLabel = STATUS_FILTERS.find(s => s.value === statusFilter)?.label ?? 'Todas'

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Propiedades</h1>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'TOTAL', value: stats.total, color: 'text-admin-text' },
          { label: 'DISPONIBLES', value: stats.disponible, color: 'text-green' },
          { label: 'OCUPADAS', value: stats.ocupada, color: 'text-red' },
          { label: 'MANTENIMIENTO', value: stats.mantenimiento, color: 'text-[#f59e0b]' },
          { label: 'PRECIO PROMEDIO', value: `S/ ${stats.avgPrice.toLocaleString()}`, color: 'text-admin-text', sm: true },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
            <div className="text-xs font-bold text-admin-text-muted mb-2">{s.label}</div>
            <div className={`font-bold ${s.color} ${s.sm ? 'text-xl' : 'text-[2rem]'}`}>{s.value}</div>
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
            placeholder="Buscar por título, distrito..."
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

        <div className="flex items-center gap-1 bg-admin-bg border border-admin-border rounded-full p-1 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Ver como tarjetas"
            className={`size-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors ${
              viewMode === "grid" ? "bg-admin-text text-white" : "bg-transparent text-admin-text-muted hover:bg-admin-hover-bg"
            }`}
          >
            <GridViewIcon size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            aria-label="Ver como lista"
            className={`size-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors ${
              viewMode === "list" ? "bg-admin-text text-white" : "bg-transparent text-admin-text-muted hover:bg-admin-hover-bg"
            }`}
          >
            <ListViewIcon size={16} />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="bg-admin-card-bg rounded-xl border border-admin-border p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Building03Icon size={48} className="text-admin-text-muted mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-admin-text mb-2">No se encontraron propiedades</h3>
          <p className="text-sm text-admin-text-muted max-w-sm">
            No hay propiedades que coincidan con tu búsqueda. Intenta con otros términos.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-3 gap-6">
            {pagination.paginatedItems.map(p => {
              const badge = statusBadge(p.status, p.deletedAt)
              return (
                <div
                  key={p.id}
                  className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative w-full h-[200px] bg-gray-100">
                    {p.images.length > 0 ? (
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Building03Icon size={48} />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-admin-text mb-2 truncate">{p.title}</h3>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Location01Icon size={14} className="text-admin-text-muted" />
                      <span className="text-[0.8rem] text-admin-text-muted">{p.district}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-admin-border">
                      <div className="flex items-center gap-1.5">
                        <BedIcon size={16} className="text-admin-text-muted" />
                        <span className="text-[0.8rem] text-admin-text">{p.rooms}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bathtub02Icon size={16} className="text-admin-text-muted" />
                        <span className="text-[0.8rem] text-admin-text">{p.bathrooms}</span>
                      </div>
                      <span className="text-[0.8rem] text-admin-text">{p.area}m²</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[0.7rem] text-admin-text-muted mb-0.5">Precio mensual</div>
                        <div className="text-xl font-bold text-admin-text">S/ {p.price.toLocaleString()}</div>
                      </div>
                      <Link
                        href={`/propiedades/${p.id}`}
                        target="_blank"
                        className="px-4 py-2 border border-admin-border rounded-md text-xs font-medium text-admin-text hover:bg-admin-bg transition-colors no-underline"
                      >
                        Ver detalles
                      </Link>
                    </div>

                    <div className="mt-3 pt-3 border-t border-admin-border text-xs text-admin-text-muted flex items-center justify-between gap-2">
                      <span>Propietario: <span className="text-admin-text font-medium">{p.owner.firstName} {p.owner.lastName}</span></span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!p.deletedAt && p.status !== 'OCUPADA' && (
                          <button
                            onClick={() => toggleModeration(p.id, p.status)}
                            disabled={pendingId === p.id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-colors disabled:opacity-50 ${
                              p.status === 'MANTENIMIENTO'
                                ? 'border-green/30 text-green hover:bg-green/10'
                                : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            {p.status === 'MANTENIMIENTO' ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
                            {p.status === 'MANTENIMIENTO' ? 'Reactivar' : 'Pausar'}
                          </button>
                        )}
                        {!p.deletedAt && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={pendingId === p.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border border-red/30 text-red hover:bg-red/10 transition-colors disabled:opacity-50"
                          >
                            <Delete02Icon size={12} />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemLabel="propiedades"
          />
        </>
      ) : (
        <>
          <div className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[rgba(116,133,151,0.05)] border-b border-admin-border text-xs font-bold text-admin-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Anuncio</th>
                  <th className="px-6 py-4 font-bold">Propietario</th>
                  <th className="px-6 py-4 font-bold">Ubicación</th>
                  <th className="px-6 py-4 font-bold">Precio</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border text-sm text-admin-text">
                {pagination.paginatedItems.map(p => {
                  const badge = statusBadge(p.status, p.deletedAt)
                  return (
                    <tr key={p.id} className="hover:bg-[rgba(116,133,151,0.05)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images.length > 0 ? (
                            <Image src={p.images[0]} alt={p.title} width={48} height={48} className="size-12 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                              <Building03Icon size={20} />
                            </div>
                          )}
                          <span className="font-semibold line-clamp-1 max-w-xs">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-admin-text-muted">{p.owner.firstName} {p.owner.lastName}</td>
                      <td className="px-6 py-4 text-admin-text-muted">{p.district}</td>
                      <td className="px-6 py-4 font-bold">S/ {p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/propiedades/${p.id}`}
                            target="_blank"
                            className="px-3 py-1.5 border border-admin-border rounded-md text-xs font-medium text-admin-text hover:bg-admin-bg transition-colors no-underline"
                          >
                            Ver
                          </Link>
                          {!p.deletedAt && p.status !== 'OCUPADA' && (
                            <button
                              onClick={() => toggleModeration(p.id, p.status)}
                              disabled={pendingId === p.id}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer border transition-colors disabled:opacity-50 ${
                                p.status === 'MANTENIMIENTO'
                                  ? 'border-green/30 text-green hover:bg-green/10'
                                  : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                              }`}
                            >
                              {p.status === 'MANTENIMIENTO' ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
                              {p.status === 'MANTENIMIENTO' ? 'Reactivar' : 'Pausar'}
                            </button>
                          )}
                          {!p.deletedAt && (
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={pendingId === p.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer border border-red/30 text-red hover:bg-red/10 transition-colors disabled:opacity-50"
                            >
                              <Delete02Icon size={12} />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemLabel="propiedades"
          />
        </>
      )}
    </div>
  )
}
