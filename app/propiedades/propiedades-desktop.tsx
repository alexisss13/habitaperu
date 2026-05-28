"use client"

import { PropertyCard } from "@/components/property-card"
import { Pagination } from "@/components/ui/pagination"
import type { PropertyListing } from './propiedades-view'
import { Search01Icon } from "hugeicons-react"

interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  setPage: (page: number) => void
}

interface DesktopProps {
  properties: PropertyListing[]
  totalFiltered: number
  originalProperties: PropertyListing[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
  minPrice: number | ""
  setMinPrice: (p: number | "") => void
  maxPrice: number | ""
  setMaxPrice: (p: number | "") => void
  selectedDistrict: string
  setSelectedDistrict: (d: string) => void
  minRooms: number
  setMinRooms: (r: number) => void
  sortBy: string
  setSortBy: (s: string) => void
  onClearFilters: () => void
  pagination: PaginationData
}

const TYPES = ['Departamento', 'Habitación', 'Casa']

export function PropiedadesDesktop({
  properties,
  totalFiltered,
  originalProperties,
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedDistrict,
  setSelectedDistrict,
  minRooms,
  setMinRooms,
  sortBy,
  setSortBy,
  onClearFilters,
  pagination
}: DesktopProps) {

  const handleTypeChange = (t: string) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  // Extract districts dynamically from original database items
  const districts = Array.from(new Set(originalProperties.map(p => p.district))).sort()

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-accent-secondary">Inicio</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Propiedades</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Propiedades disponibles</h1>
              <p className="text-gray-600">Mostrando {totalFiltered} propiedades verificadas en tiempo real</p>
            </div>
            {/* Real-time search bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar por título, distrito o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none transition-all focus:border-accent-secondary bg-white text-gray-800 font-medium shadow-sm focus:ring-1 focus:ring-accent-secondary/20"
              />
              <Search01Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[96px] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button 
                  onClick={onClearFilters}
                  className="text-sm text-accent-secondary hover:opacity-80 bg-transparent border-0 cursor-pointer"
                >
                  Limpiar
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* Type of Property */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de inmueble</label>
                  <div className="flex flex-col gap-2">
                    {TYPES.map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(t)}
                          onChange={() => handleTypeChange(t)}
                          className="rounded border-gray-300 text-accent-secondary focus:ring-accent-secondary size-4" 
                        />
                        <span className="text-sm text-gray-700 font-medium">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio mensual (S/)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Mín" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary" 
                    />
                    <input 
                      type="number" 
                      placeholder="Máx" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary" 
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary font-semibold"
                  >
                    <option value="">Todos los distritos</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Min Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones mínimas</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button 
                        key={n} 
                        onClick={() => setMinRooms(minRooms === n ? 0 : n)}
                        className={`flex-1 py-2 border rounded-lg text-sm transition-all cursor-pointer ${
                          minRooms === n 
                            ? 'bg-accent-secondary text-white border-accent-secondary font-bold shadow-sm' 
                            : 'border-gray-300 text-gray-700 hover:border-accent-secondary hover:bg-red-50'
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 font-medium">{totalFiltered} propiedades encontradas</p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none font-semibold cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="rating_desc">Mejor calificación</option>
              </select>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propiedades disponibles</h3>
                <p className="text-gray-600">Intenta cambiar o limpiar los filtros seleccionados.</p>
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

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.setPage}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              itemLabel="propiedades"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
