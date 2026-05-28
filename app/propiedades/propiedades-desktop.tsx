"use client"

import { PropertyCard } from "@/components/property-card"
import { Pagination } from "@/components/ui/pagination"
import type { PropertyListing } from './propiedades-view'
import { Search01Icon, FilterIcon } from "hugeicons-react"

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

const activeFiltersCount = (
  selectedTypes: string[],
  minPrice: number | "",
  maxPrice: number | "",
  selectedDistrict: string,
  minRooms: number
) =>
  selectedTypes.length +
  (minPrice !== "" ? 1 : 0) +
  (maxPrice !== "" ? 1 : 0) +
  (selectedDistrict ? 1 : 0) +
  (minRooms > 0 ? 1 : 0)

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
  pagination,
}: DesktopProps) {
  const handleTypeChange = (t: string) =>
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )

  const filtersActive = activeFiltersCount(selectedTypes, minPrice, maxPrice, selectedDistrict, minRooms)

  return (
    <div className="min-h-screen bg-gray-50 pt-[112px]">

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-accent transition-colors no-underline text-gray-400">
              Inicio
            </a>
            <span>/</span>
            <span className="text-[#151c26] font-medium">Propiedades</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#151c26] mb-1">
                Propiedades disponibles
              </h1>
              <p className="text-sm text-gray-400">
                {totalFiltered} {totalFiltered === 1 ? 'propiedad verificada' : 'propiedades verificadas'} en tiempo real
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por título, distrito o tipo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-white text-[#151c26] font-medium shadow-sm transition-colors"
              />
              <Search01Icon
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-7">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className="w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-[88px]">

              {/* Filter header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FilterIcon size={15} className="text-accent" />
                  <h3 className="font-bold text-[#151c26] text-sm">Filtros</h3>
                  {filtersActive > 0 && (
                    <span className="size-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {filtersActive}
                    </span>
                  )}
                </div>
                {filtersActive > 0 && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs font-semibold text-accent hover:text-accent/80 bg-transparent border-none cursor-pointer transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">

                {/* Property type */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Tipo de inmueble
                  </p>
                  <div className="flex flex-col gap-2">
                    {TYPES.map(t => {
                      const active = selectedTypes.includes(t)
                      return (
                        <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => handleTypeChange(t)}
                            className={`size-4 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              active
                                ? 'bg-accent border-accent'
                                : 'border-gray-300 group-hover:border-accent/50'
                            }`}
                          >
                            {active && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span
                            onClick={() => handleTypeChange(t)}
                            className={`text-sm cursor-pointer transition-colors ${
                              active ? 'text-accent font-semibold' : 'text-gray-600 group-hover:text-[#151c26]'
                            }`}
                          >
                            {t}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Price range */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Precio mensual (S/)
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent bg-gray-50 transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent bg-gray-50 transition-colors"
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* District / City — free text search */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Distrito o ciudad
                  </p>
                  <input
                    type="text"
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    placeholder="Ej: Lima, Arequipa, Miraflores…"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent bg-gray-50 text-[#151c26] transition-colors"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Busca por ciudad o distrito del Perú
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Min Rooms */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Habitaciones mínimas
                  </p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setMinRooms(minRooms === n ? 0 : n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border ${
                          minRooms === n
                            ? 'bg-accent text-white border-accent shadow-sm'
                            : 'border-gray-200 text-gray-500 bg-gray-50 hover:border-accent/50 hover:text-accent'
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

          {/* ── GRID ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-bold text-[#151c26]">{totalFiltered}</span>{' '}
                {totalFiltered === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent font-semibold cursor-pointer bg-white text-[#151c26] transition-colors"
              >
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="rating_desc">Mejor calificación</option>
              </select>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="font-bold text-[#151c26] text-base mb-2">
                  Sin resultados
                </p>
                <p className="text-sm text-gray-400 mb-5">
                  Intenta cambiar o limpiar los filtros seleccionados.
                </p>
                <button
                  onClick={onClearFilters}
                  className="px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
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
