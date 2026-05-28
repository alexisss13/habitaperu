'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  Home01Icon, 
  Add01Icon, 
  BedIcon, 
  Bathtub02Icon, 
  SquareIcon, 
  Location01Icon 
} from "hugeicons-react"

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

export function PropertiesMobile({ properties }: Props) {
  const [filter, setFilter] = useState<string>("TODAS")

  const filteredProperties = properties.filter(p => {
    if (filter === "TODAS") return true
    if (filter === "DISPONIBLES") return p.status === "DISPONIBLE"
    if (filter === "OCUPADAS") return p.status === "OCUPADA"
    if (filter === "MANTENIMIENTO") return p.status === "MANTENIMIENTO"
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Disponible</span>
      case "OCUPADA":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">Ocupada</span>
      case "MANTENIMIENTO":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">Mantenimiento</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HABITACION": return "Habitación"
      case "DEPARTAMENTO": return "Depa"
      case "CASA": return "Casa"
      case "OFICINA": return "Oficina"
      case "LOCAL": return "Local"
      default: return type
    }
  }

  return (
    <div className="py-6 px-4 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis Propiedades</h1>
          <p className="text-xs font-medium text-text-muted mt-1">
            Administra tus anuncios de alquiler
          </p>
        </div>
        <Link
          href="/landlord/properties/new"
          className="w-full h-11 rounded-xl text-xs font-bold text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <Add01Icon size={16} />
          <span>Publicar Propiedad</span>
        </Link>
      </div>

      {/* Filter horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-4 -mx-4 px-4">
        {[
          { key: "TODAS", label: "Todas" },
          { key: "DISPONIBLES", label: "Disponibles" },
          { key: "OCUPADAS", label: "Ocupadas" },
          { key: "MANTENIMIENTO", label: "Mantenimiento" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all shrink-0 border border-slate-200 cursor-pointer ${
              filter === tab.key 
                ? "bg-[#151c26] text-white border-[#151c26]" 
                : "bg-white text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Property Cards */}
      <div className="space-y-4">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(p => {
            const imgArray = Array.isArray(p.images) ? p.images as string[] : []
            const firstImage = imgArray.length > 0 ? imgArray[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=85"

            return (
              <div 
                key={p.id} 
                className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative h-40 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={firstImage} 
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-bold">
                    {getTypeLabel(p.type)}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-text-muted font-semibold">
                    <Location01Icon size={12} className="text-slate-400" />
                    <span className="truncate">{p.district} • {p.address || "Ver dirección"}</span>
                  </div>

                  <h3 className="font-bold text-sm text-text truncate">{p.title}</h3>

                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold py-1 bg-slate-50 px-2 rounded-lg my-1">
                    <span className="flex items-center gap-0.5"><BedIcon size={14} /> {p.rooms} hab.</span>
                    <span className="flex items-center gap-0.5"><Bathtub02Icon size={14} /> {p.bathrooms} bañ.</span>
                    <span className="flex items-center gap-0.5"><SquareIcon size={14} /> {p.area || "--"} m²</span>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] text-text-muted font-semibold block uppercase">Mensual</span>
                      <span className="text-sm font-extrabold text-[#151c26]">S/ {Number(p.price).toLocaleString()}</span>
                    </div>
                    <Link 
                      href={`/propiedades/${p.id}`}
                      className="text-xs font-bold text-accent no-underline"
                    >
                      Ver Detalle &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl px-4">
            <Home01Icon size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-text mb-0.5">Sin propiedades</p>
            <p className="text-[10px] text-text-muted">No se registran propiedades publicadas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
