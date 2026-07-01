'use client'

import { PanelPageHeader } from "@/components/panel-page-header"
import Link from "next/link"
import { FavouriteIcon, Building03Icon, Location01Icon, Delete02Icon, Home01Icon } from "hugeicons-react"
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

        <PanelPageHeader
          icon={<FavouriteIcon size={32} className="text-admin-accent" />}
          title="Mis Favoritos"
          subtitle={`${properties.length} ${properties.length === 1 ? "propiedad guardada" : "propiedades guardadas"}`}
        />

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
              <div key={p.id} className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-panel-hover-bg overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building03Icon size={40} className="text-panel-text-dim" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-panel-card-bg/90 text-panel-text text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {typeLabel[p.type] ?? p.type}
                  </span>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="absolute top-3 right-3 size-8 bg-panel-card-bg/90 hover:bg-accent-secondary/10 text-panel-text-dim hover:text-accent-secondary rounded-full flex items-center justify-center transition-all cursor-pointer border-none shadow-sm"
                    title="Quitar de favoritos"
                  >
                    <Delete02Icon size={15} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-panel-text text-sm line-clamp-2 mb-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-panel-text-dim text-xs mb-3">
                    <Location01Icon size={12} />
                    <span>{p.district}, {p.province}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-panel-text-dim mb-4">
                    {p.bedrooms !== null && <span>{p.bedrooms} dorm.</span>}
                    {p.bathrooms !== null && <span>{p.bathrooms} baño{p.bathrooms !== 1 ? "s" : ""}</span>}
                    {p.area !== null && <span>{p.area} m²</span>}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-accent">
                        S/ {p.price.toLocaleString("es-PE")}
                        <span className="text-xs font-normal text-panel-text-dim">/mes</span>
                      </p>
                    </div>
                    <Link
                      href={`/propiedades/${p.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-all no-underline"
                    >
                      Ver propiedad
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
