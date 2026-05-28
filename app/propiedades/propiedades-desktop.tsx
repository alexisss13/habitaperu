'use client'

import { PropertyCard } from "@/components/property-card"
import type { PropertyListing } from './propiedades-view'

const DISTRICTS = ['Miraflores', 'San Isidro', 'Barranco', 'Surco', 'San Borja']
const TYPES = ['Departamento', 'Habitación', 'Casa']

export function PropiedadesDesktop({ properties }: { properties: PropertyListing[] }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-accent-secondary">Inicio</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Propiedades</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Propiedades disponibles</h1>
          <p className="text-gray-600">Mostrando {properties.length} propiedades verificadas</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button className="text-sm text-accent-secondary hover:opacity-80">Limpiar</button>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de inmueble</label>
                  <div className="flex flex-col gap-2">
                    {TYPES.map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-accent-secondary focus:ring-accent-secondary" />
                        <span className="text-sm text-gray-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio mensual (S/)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Mín" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary" />
                    <input type="number" placeholder="Máx" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary">
                    <option value="">Todos los distritos</option>
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones mínimas</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button key={n} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:border-accent-secondary hover:bg-red-50 transition-colors">
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2 bg-accent-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Aplicar filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">{properties.length} propiedades encontradas</p>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                <option>Más recientes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Mejor calificación</option>
              </select>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propiedades disponibles</h3>
                <p className="text-gray-600">Intenta ajustar los filtros o vuelve más tarde</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(p => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
