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

export function FavoritesMobile({ properties, onRemove }: Props) {
  return (
    <div className="min-h-screen bg-panel-bg pb-24">
      <PanelPageHeader
        icon={<FavouriteIcon size={24} className="text-admin-accent" />}
        title="Mis Favoritos"
        subtitle={`${properties.length} ${properties.length === 1 ? "propiedad guardada" : "propiedades guardadas"}`}
      />

      {/* List */}
      <div className="px-4 py-4 flex flex-col gap-3">
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
            <div key={p.id} className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm overflow-hidden">
              {/* Image row */}
              <div className="relative h-36 bg-panel-hover-bg">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building03Icon size={32} className="text-panel-text-dim" />
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-panel-card-bg/90 text-panel-text text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  {typeLabel[p.type] ?? p.type}
                </span>
                <button
                  onClick={() => onRemove(p.id)}
                  className="absolute top-2 right-2 size-7 bg-panel-card-bg/90 hover:bg-accent-secondary/10 text-panel-text-dim hover:text-accent-secondary rounded-full flex items-center justify-center transition-all cursor-pointer border-none shadow-sm"
                >
                  <Delete02Icon size={13} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-panel-text text-sm line-clamp-1 mb-0.5">{p.title}</h3>
                <div className="flex items-center gap-1 text-panel-text-dim text-xs mb-2">
                  <Location01Icon size={11} />
                  <span>{p.district}, {p.province}</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-accent">
                    S/ {p.price.toLocaleString("es-PE")}
                    <span className="text-xs font-normal text-panel-text-dim">/mes</span>
                  </p>
                  <Link
                    href={`/propiedades/${p.id}`}
                    className="text-xs font-semibold text-accent no-underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
