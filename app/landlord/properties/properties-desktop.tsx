'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  Home01Icon, 
  Add01Icon, 
  BedIcon, 
  Bathtub02Icon, 
  SquareIcon, 
  Location01Icon, 
  FileValidationIcon,
  Tag01Icon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { Pagination } from "@/components/ui/pagination"

interface PropertyInfo {
  id: string
  title: string
  description: string
  type: "HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL"
  condition: "SIN_MUEBLES" | "SEMI_AMOBLADO" | "AMOBLADO"
  status: "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO"
  district: string
  address?: string | null
  area?: number | null
  rooms: number
  bathrooms: number
  parking: number
  price: number
  deposit: number
  minDuration: number
  images?: any
  createdAt: string
}

interface Props {
  properties: PropertyInfo[]
}

export function PropertiesDesktop({ properties }: Props) {
  const [filter, setFilter] = useState<string>("TODAS")

  // Calculate quick metrics
  const total = properties.length
  const disponibles = properties.filter(p => p.status === "DISPONIBLE").length
  const ocupadas = properties.filter(p => p.status === "OCUPADA").length
  const mantenimiento = properties.filter(p => p.status === "MANTENIMIENTO").length

  const filteredProperties = properties.filter(p => {
    if (filter === "TODAS") return true
    if (filter === "DISPONIBLES") return p.status === "DISPONIBLE"
    if (filter === "OCUPADAS") return p.status === "OCUPADA"
    if (filter === "MANTENIMIENTO") return p.status === "MANTENIMIENTO"
    return true
  })

  const pagination = usePagination(filteredProperties, 9, [filter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Disponible</span>
      case "OCUPADA":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">Ocupada</span>
      case "MANTENIMIENTO":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Mantenimiento</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg">{status}</span>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HABITACION": return "Habitación"
      case "DEPARTAMENTO": return "Departamento"
      case "CASA": return "Casa"
      case "OFICINA": return "Oficina"
      case "LOCAL": return "Local"
      default: return type
    }
  }

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case "SIN_MUEBLES": return "Sin Muebles"
      case "SEMI_AMOBLADO": return "Semi-amoblado"
      case "AMOBLADO": return "Amoblado"
      default: return cond
    }
  }

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-text">Mis Propiedades</h1>
          <p className="text-base font-medium text-text-muted">
            Administra tus anuncios de inmuebles en Habita Perú
          </p>
        </div>
        <Link
          href="/landlord/properties/new"
          className="h-12 px-5 rounded-xl text-sm font-bold !text-white transition-all duration-200 shadow-sm hover:brightness-110 flex items-center gap-2 cursor-pointer no-underline"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <Add01Icon size={18} />
          <span>Publicar Propiedad</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Propiedades</p>
          <p className="text-3xl font-bold text-text">{total}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Disponibles</p>
          <p className="text-3xl font-bold text-emerald-600">{disponibles}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Alquiladas</p>
          <p className="text-3xl font-bold text-indigo-600">{ocupadas}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Mantenimiento</p>
          <p className="text-3xl font-bold text-amber-600">{mantenimiento}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1.5 border border-slate-200 rounded-xl max-w-max shadow-sm">
        {[
          { key: "TODAS", label: "Todas" },
          { key: "DISPONIBLES", label: "Disponibles" },
          { key: "OCUPADAS", label: "Ocupadas" },
          { key: "MANTENIMIENTO", label: "Mantenimiento" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
              filter === tab.key 
                ? "bg-[#151c26] text-white shadow-sm" 
                : "text-text-muted hover:text-text hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Properties Cards Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {pagination.paginatedItems.map(p => {
            const imgArray = Array.isArray(p.images) ? p.images as string[] : []
            const firstImage = imgArray.length > 0 ? imgArray[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=85"

            return (
              <div 
                key={p.id} 
                className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={firstImage} 
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="absolute top-4 right-4 z-10 bg-slate-900/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    {getTypeLabel(p.type)}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold mb-2">
                    <Location01Icon size={14} className="text-slate-400" />
                    <span>{p.district}</span>
                    {p.address && (
                      <>
                        <span>•</span>
                        <span className="truncate">{p.address}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-text mb-2 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                  <div className="h-px bg-slate-100 my-2" />

                  {/* Core Features */}
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold py-2">
                    <div className="flex items-center gap-1">
                      <BedIcon size={16} className="text-slate-400" />
                      <span>{p.rooms} hab.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bathtub02Icon size={16} className="text-slate-400" />
                      <span>{p.bathrooms} bañ.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SquareIcon size={16} className="text-slate-400" />
                      <span>{p.area || "--"} m²</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-2" />

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Precio mensual</span>
                      <span className="text-lg font-extrabold text-[#151c26]">
                        S/ {Number(p.price).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {getConditionLabel(p.condition)}
                      </span>
                      <Link
                        href={`/landlord/properties/${p.id}/edit`}
                        className="text-xs font-bold text-accent border border-accent/30 px-2.5 py-1 rounded-lg hover:bg-accent/5 no-underline transition-colors"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/propiedades/${p.id}`}
                        className="text-xs font-bold text-gray-500 hover:text-[#151c26] no-underline"
                      >
                        Ver →
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Home01Icon size={56} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-text mb-1">Sin propiedades</h3>
          <p className="text-xs font-medium text-text-muted mb-6">
            Aún no has publicado ninguna propiedad en el filtro seleccionado.
          </p>
          <Link
            href="/landlord/properties/new"
            className="inline-flex h-11 items-center justify-center px-6 rounded-xl text-xs font-bold !text-white transition-colors no-underline"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
          >
            Publicar mi primer anuncio
          </Link>
        </div>
      )}

      {/* Pagination */}
      {filteredProperties.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="propiedades"
        />
      )}
    </div>
  )
}
