'use client'

import Image from "next/image"
import { Building03Icon, Search01Icon, FilterIcon, Location01Icon, BedIcon, Bathtub02Icon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import type { PropertiesData } from './properties-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'DISPONIBLE': return { cls: 'bg-green/10 text-green', label: 'Disponible' }
    case 'OCUPADA': return { cls: 'bg-red/10 text-red', label: 'Ocupada' }
    case 'MANTENIMIENTO': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Mantenimiento' }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status }
  }
}

export function PropertiesDesktop({ data }: { data: PropertiesData }) {
  const { properties, stats } = data
  const pagination = usePagination(properties, 9) // 3 cols × 3 rows

  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Building03Icon size={32} className="text-admin-accent" />
            <h1 className="text-3xl font-bold text-admin-text">Propiedades</h1>
          </div>
          <button className="px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:-translate-y-px transition-all">
            + Nueva Propiedad
          </button>
        </div>
        <p className="text-sm text-admin-text-muted">Gestiona todas las propiedades publicadas</p>
      </div>

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
            placeholder="Buscar por título, distrito..."
            className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border rounded-lg text-sm font-medium text-admin-text hover:bg-admin-bg transition-colors">
          <FilterIcon size={16} />
          Filtros
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {pagination.paginatedItems.map(p => {
          const badge = statusBadge(p.status)
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
                  <span className="text-[0.8rem] text-admin-text-muted">{p.district}, Lima</span>
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
                  <button className="px-4 py-2 border border-admin-border rounded-md text-xs font-medium text-admin-text hover:bg-admin-bg transition-colors">
                    Ver detalles
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-admin-border text-xs text-admin-text-muted">
                  Propietario: <span className="text-admin-text font-medium">{p.owner.firstName} {p.owner.lastName}</span>
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
    </div>
  )
}
