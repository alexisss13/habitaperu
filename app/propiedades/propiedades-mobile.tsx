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

interface MobileProps {
  properties: PropertyListing[]
  totalFiltered: number
  originalProperties: PropertyListing[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
  selectedDistrict: string
  setSelectedDistrict: (d: string) => void
  sortBy: string
  setSortBy: (s: string) => void
  onClearFilters: () => void
  pagination: PaginationData
}

const QUICK_FILTERS = [
  { label: 'Todos', type: 'clear', value: '' },
  { label: 'Depas', type: 'type', value: 'Departamento' },
  { label: 'Habitaciones', type: 'type', value: 'Habitación' },
  { label: 'Casas', type: 'type', value: 'Casa' },
  { label: 'Miraflores', type: 'district', value: 'Miraflores' },
  { label: 'Barranco', type: 'district', value: 'Barranco' },
  { label: 'Surco', type: 'district', value: 'Santiago de Surco' },
  { label: 'San Isidro', type: 'district', value: 'San Isidro' },
]

export function PropiedadesMobile({
  properties,
  totalFiltered,
  originalProperties,
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  selectedDistrict,
  setSelectedDistrict,
  sortBy,
  setSortBy,
  onClearFilters,
  pagination
}: MobileProps) {

  const handlePillClick = (filter: typeof QUICK_FILTERS[0]) => {
    if (filter.type === 'clear') {
      onClearFilters()
    } else if (filter.type === 'type') {
      setSelectedTypes(prev =>
        prev.includes(filter.value)
          ? prev.filter(x => x !== filter.value)
          : [...prev, filter.value]
      )
    } else if (filter.type === 'district') {
      setSelectedDistrict(selectedDistrict === filter.value ? '' : filter.value)
    }
  }

  const isPillActive = (filter: typeof QUICK_FILTERS[0]) => {
    if (filter.type === 'clear') {
      return selectedTypes.length === 0 && !selectedDistrict
    }
    if (filter.type === 'type') {
      return selectedTypes.includes(filter.value)
    }
    if (filter.type === 'district') {
      return selectedDistrict === filter.value
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5 flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Propiedades</h1>
          <p className="text-sm text-gray-600">{totalFiltered} disponibles</p>
        </div>
        {/* Mobile Search input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar depas, distritos, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs outline-none transition-all focus:border-accent-secondary bg-white text-gray-800 font-semibold shadow-sm"
          />
          <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
        {QUICK_FILTERS.map(f => {
          const active = isPillActive(f)
          return (
            <button 
              key={f.label} 
              onClick={() => handlePillClick(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                active 
                  ? "bg-accent-secondary text-white border-accent-secondary shadow-sm"
                  : "border-gray-300 text-gray-700 bg-white hover:border-accent-secondary hover:text-accent-secondary"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-600 font-medium">{totalFiltered} encontradas</p>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none font-semibold bg-white cursor-pointer"
        >
          <option value="recent">Más recientes</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
          <option value="rating_desc">Calificación</option>
        </select>
      </div>

      {/* List */}
      <div className="px-4 flex flex-col gap-4">
        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-1">No hay resultados</h3>
            <p className="text-xs text-gray-600">Cambia los filtros seleccionados.</p>
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

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          compact
          itemLabel="propiedades"
        />
      </div>
    </div>
  )
}
