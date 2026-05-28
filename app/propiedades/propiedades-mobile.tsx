'use client'

import { PropertyCard } from "@/components/property-card"
import type { PropertyListing } from './propiedades-view'

export function PropiedadesMobile({ properties }: { properties: PropertyListing[] }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-[64px] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Propiedades</h1>
        <p className="text-sm text-gray-600">{properties.length} disponibles</p>
      </div>

      {/* Quick Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
        {['Todos', 'Depa', 'Habitación', 'Casa', 'Miraflores', 'Barranco'].map(f => (
          <button key={f} className="shrink-0 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 hover:border-accent-secondary hover:text-accent-secondary transition-colors">
            {f}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-600">{properties.length} encontradas</p>
        <select className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none">
          <option>Más recientes</option>
          <option>Precio ↑</option>
          <option>Precio ↓</option>
        </select>
      </div>

      {/* List */}
      <div className="px-4 flex flex-col gap-4">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-base font-semibold text-gray-900 mb-2">No hay propiedades disponibles</h3>
            <p className="text-sm text-gray-600">Vuelve más tarde</p>
          </div>
        ) : (
          properties.map(p => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              type={p.type}
              district={p.district}
              price={p.price}
              rooms={p.rooms}
              bathrooms={p.bathrooms}
              area={p.area ?? undefined}
              images={p.images}
              avgRating={p.avgRating}
              reviewCount={p.reviewCount}
              status={p.status}
            />
          ))
        )}
      </div>
    </div>
  )
}
