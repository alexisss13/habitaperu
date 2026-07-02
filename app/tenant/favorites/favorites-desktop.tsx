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

export function FavoritesDesktop({ properties, onRemove }: Props) {
  return (
    <div className="min-h-screen bg-panel-bg pt-0">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {properties.length === 0 ? (
          <div className="text-center py-24 text-panel-text-dim">
            <FavouriteIcon size={56} className="mx-auto mb-4 opacity-25" />
            <p className="text-xl font-semibold text-panel-text-dim">No tienes favoritos aún</p>
            <p className="text-sm mt-2 mb-6">
              Explora propiedades y guarda las que te interesen con el ícono de corazón.
            </p>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl no-underline hover:bg-accent/90 transition-colors"
            >
              <Home01Icon size={16} />
              Explorar propiedades
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => (
              <Link key={p.id} href={`/propiedades/${p.id}`} className="no-underline block group">
                <div className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_24px_rgba(15,52,87,0.1)] transition-all duration-200">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building03Icon size={40} className="text-gray-300" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold bg-white/92 text-[#151c26] px-2 py-0.5 rounded-full shadow-sm">
                      {typeLabel[p.type] ?? p.type}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(p.id) }}
                      className="absolute top-2.5 right-2.5 size-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm border-none cursor-pointer transition-colors"
                      title="Quitar de favoritos"
                    >
                      <Delete02Icon size={15} className="text-gray-500 hover:text-accent-secondary" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="property-info-simple !pt-3 !pb-5">
                    <p className="property-title-simple line-clamp-2">{p.title}</p>

                    <p className="property-location-simple">{p.district}, {p.province}</p>

                    <p className="property-specs-simple">
                      {p.area !== null ? `${p.area} m² · ` : ''}
                      {p.bedrooms !== null && `${p.bedrooms} hab.`}
                      {p.bedrooms !== null && p.bathrooms !== null && ' · '}
                      {p.bathrooms !== null && `${p.bathrooms} ${p.bathrooms === 1 ? 'baño' : 'baños'}`}
                    </p>

                    <p className="property-price-simple">
                      <strong>S/ {p.price.toLocaleString("es-PE")}</strong> /mes
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
