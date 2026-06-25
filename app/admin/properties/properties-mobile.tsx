'use client'

import Image from "next/image"
import { Building03Icon, Location01Icon, BedIcon } from "hugeicons-react"
import type { PropertiesData } from './properties-view'

const statusBadge = (status: string) => {
  switch (status) {
    case 'DISPONIBLE': return { cls: 'bg-green/10 text-green', label: 'Disponible' }
    case 'OCUPADA': return { cls: 'bg-red/10 text-red', label: 'Ocupada' }
    case 'MANTENIMIENTO': return { cls: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]', label: 'Mant.' }
    default: return { cls: 'bg-[rgba(116,133,151,0.1)] text-admin-text-muted', label: status }
  }
}

export function PropertiesMobile({ data }: { data: PropertiesData }) {
  const { properties, stats } = data

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <Building03Icon size={24} className="text-admin-accent" />
          <h1 className="text-2xl font-bold text-admin-text">Propiedades</h1>
        </div>
        <p className="text-xs text-admin-text-muted">Propiedades publicadas</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-admin-text' },
          { label: 'Disponibles', value: stats.disponible, color: 'text-green' },
          { label: 'Ocupadas', value: stats.ocupada, color: 'text-red' },
          { label: 'Precio Prom.', value: `S/ ${(stats.avgPrice / 1000).toFixed(1)}k`, color: 'text-brown' },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-4 rounded-xl border border-admin-border">
            <div className="text-[0.625rem] font-bold text-admin-text-muted uppercase mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Property Cards */}
      <div className="px-4 flex flex-col gap-4">
        {properties.length === 0 ? (
          <div className="bg-admin-card-bg rounded-xl border border-admin-border p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <Building03Icon size={36} className="text-admin-text-muted mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-admin-text mb-1">No se encontraron propiedades</h3>
            <p className="text-xs text-admin-text-muted max-w-xs">
              No hay propiedades registradas en el sistema.
            </p>
          </div>
        ) : (
          properties.map(p => {
            const badge = statusBadge(p.status)
            return (
              <div key={p.id} className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
                <div className="relative w-full h-[160px] bg-gray-100">
                  {p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Building03Icon size={40} />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[0.625rem] font-semibold ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-admin-text mb-1.5 truncate">{p.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Location01Icon size={12} className="text-admin-text-muted" />
                    <span className="text-xs text-admin-text-muted">{p.district}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <BedIcon size={14} className="text-admin-text-muted" />
                        <span className="text-xs text-admin-text">{p.rooms}</span>
                      </div>
                      <span className="text-xs text-admin-text-muted">{p.area}m²</span>
                    </div>
                    <div className="text-base font-bold text-admin-text">S/ {p.price.toLocaleString()}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-admin-border text-[0.625rem] text-admin-text-muted">
                    {p.owner.firstName} {p.owner.lastName}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
