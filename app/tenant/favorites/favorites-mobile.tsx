'use client'

import Link from "next/link"
import { FavouriteIcon, Building03Icon, Delete02Icon, Home01Icon } from "hugeicons-react"
import type { FavoriteProperty } from "./favorites-view"

const typeLabel: Record<string, string> = {
  HABITACION: "Habitación",
  DEPARTAMENTO: "Departamento",
  CASA: "Casa",
  OFICINA: "Oficina",
  LOCAL: "Local",
}

interface Props {
  properties: FavoriteProperty[]
  onRemove: (id: string) => void
}

export function FavoritesMobile({ properties, onRemove }: Props) {
  return (
    <div className="min-h-screen bg-panel-bg pb-24">
      {/* List */}
      <div className="px-4 pt-6 flex flex-col gap-3">
        {properties.length === 0 ? (
          <div className="text-center py-16 text-panel-text-dim px-6">
            <FavouriteIcon size={40} className="mx-auto mb-3 opacity-25" />
            <p className="font-semibold text-panel-text-dim">No tienes favoritos aún</p>
            <p className="text-xs mt-1 mb-5">
              Explora propiedades y guarda las que te interesen.
            </p>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl no-underline"
            >
              <Home01Icon size={15} />
              Explorar
            </Link>
          </div>
        ) : (
          properties.map((p) => (
            <Link key={p.id} href={`/propiedades/${p.id}`} className="no-underline block group">
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                {/* Image row */}
                <div className="relative h-36 bg-gray-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building03Icon size={32} className="text-gray-300" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-[11px] font-semibold bg-white/92 text-[#151c26] px-2 py-0.5 rounded-full shadow-sm">
                    {typeLabel[p.type] ?? p.type}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(p.id) }}
                    className="absolute top-2 right-2 size-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm border-none cursor-pointer transition-colors"
                  >
                    <Delete02Icon size={13} className="text-gray-500 hover:text-accent-secondary" />
                  </button>
                </div>

                {/* Content */}
                <div className="property-info-simple !pt-3 !pb-4">
                  <p className="property-title-simple line-clamp-1">{p.title}</p>

                  <p className="property-location-simple">{p.district}, {p.province}</p>

                  <p className="property-price-simple">
                    <strong>S/ {p.price.toLocaleString("es-PE")}</strong> /mes
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
