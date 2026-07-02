"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { PropertyCard } from "@/components/property-card"
import { Pagination } from "@/components/ui/pagination"
import type { PropertyListing } from './propiedades-view'
import { School01Icon, Sofa01Icon, Home01Icon, ArrowDown01Icon } from "hugeicons-react"
import { UNIVERSITIES } from "@/lib/universities"
import { HeroSearchBar, type HeroSearchFilters } from "@/components/hero-search-bar"

const TYPE_VALUE_TO_LABEL: Record<string, string> = {
  HABITACION: 'Habitación',
  DEPARTAMENTO: 'Departamento',
  CASA: 'Casa',
}
const TYPE_LABEL_TO_VALUE: Record<string, string> = {
  Habitación: 'HABITACION',
  Departamento: 'DEPARTAMENTO',
  Casa: 'CASA',
}

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
  nearUniversityId: string
  setNearUniversityId: (id: string) => void
  nearRadiusKm: number
  setNearRadiusKm: (km: number) => void
  conditionFilter: string
  setConditionFilter: (c: string) => void
  amenityFilter: string
}

export function PropiedadesDesktop({
  properties,
  totalFiltered,
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
  nearUniversityId,
  setNearUniversityId,
  nearRadiusKm,
  setNearRadiusKm,
  conditionFilter,
  setConditionFilter,
}: DesktopProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'es'

  const [openChip, setOpenChip] = useState<'rooms' | 'condition' | 'university' | null>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chipsRef.current && !chipsRef.current.contains(e.target as Node)) setOpenChip(null)
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleHeroSearch = (filters: HeroSearchFilters) => {
    setSelectedDistrict(filters.district)
    setNearUniversityId(filters.universityId)
    setSearchQuery(filters.query)
    setSelectedTypes(filters.type ? [TYPE_VALUE_TO_LABEL[filters.type] ?? filters.type] : [])
    setMinPrice(filters.minPrice ? Number(filters.minPrice) : "")
    setMaxPrice(filters.maxPrice ? Number(filters.maxPrice) : "")
  }

  const CONDITIONS = [
    { value: '', label: 'Cualquiera' },
    { value: 'AMOBLADO', label: 'Amoblado' },
    { value: 'SIN_AMOBLAR', label: 'Sin amoblar' },
  ]
  const conditionLabel = CONDITIONS.find(c => c.value === conditionFilter)?.label ?? 'Condición'
  const selectedUniversity = UNIVERSITIES.find(u => u.id === nearUniversityId)

  const SORT_OPTIONS = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'rating_desc', label: 'Mejor calificación' },
  ]
  const sortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? 'Ordenar'
  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 h-11 px-4 rounded-full text-sm font-semibold cursor-pointer transition-colors border shrink-0 ${
      active ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-gray-50 pt-[112px]">

      {/* Search bar — fija debajo del navbar al hacer scroll */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 flex-wrap">
          <HeroSearchBar
            locale={locale}
            compact
            initialDistrict={selectedDistrict}
            initialUniversityId={nearUniversityId}
            initialQuery={searchQuery}
            initialType={selectedTypes[0] ? TYPE_LABEL_TO_VALUE[selectedTypes[0]] ?? '' : ''}
            initialMinPrice={minPrice === "" ? "" : String(minPrice)}
            initialMaxPrice={maxPrice === "" ? "" : String(maxPrice)}
            onSearch={handleHeroSearch}
          />

          <div ref={chipsRef} className="flex items-center gap-2.5 flex-wrap">
            {/* Habitaciones mínimas */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenChip(openChip === 'rooms' ? null : 'rooms')}
                className={chipClass(minRooms > 0)}
              >
                <Home01Icon size={15} />
                {minRooms > 0 ? `${minRooms}+ hab.` : 'Habitaciones'}
              </button>

              {openChip === 'rooms' && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-4 z-[60]">
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
              )}
            </div>

            {/* Condición */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenChip(openChip === 'condition' ? null : 'condition')}
                className={chipClass(!!conditionFilter)}
              >
                <Sofa01Icon size={15} />
                {conditionLabel}
              </button>

              {openChip === 'condition' && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[220px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-2 z-[60]">
                  {CONDITIONS.map(c => (
                    <button
                      key={c.value || 'any'}
                      type="button"
                      onClick={() => { setConditionFilter(c.value); setOpenChip(null) }}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors border-0 ${
                        conditionFilter === c.value ? 'bg-accent/5 text-accent font-bold' : 'bg-transparent hover:bg-gray-50 text-[#151c26]'
                      }`}
                    >
                      <span className="text-sm font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cerca de universidad */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenChip(openChip === 'university' ? null : 'university')}
                className={chipClass(!!nearUniversityId)}
              >
                <School01Icon size={15} />
                {selectedUniversity ? selectedUniversity.shortName : 'Cerca de universidad'}
              </button>

              {openChip === 'university' && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[280px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-4 z-[60]">
                  <select
                    value={nearUniversityId}
                    onChange={e => setNearUniversityId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-accent bg-white cursor-pointer mb-3"
                  >
                    <option value="">Cualquier ubicación</option>
                    {UNIVERSITIES.map(u => (
                      <option key={u.id} value={u.id}>{u.shortName} — {u.city}</option>
                    ))}
                  </select>
                  {nearUniversityId && (
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold mb-1.5">Radio: {nearRadiusKm} km</p>
                      <input
                        type="range" min={0.5} max={5} step={0.5}
                        value={nearRadiusKm}
                        onChange={e => setNearRadiusKm(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>0.5 km</span><span>5 km</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {(minRooms > 0 || conditionFilter || nearUniversityId) && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs font-semibold text-accent hover:text-accent/80 bg-transparent border-none cursor-pointer transition-colors shrink-0"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-bold text-[#151c26]">{totalFiltered}</span>{' '}
                {totalFiltered === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent font-semibold cursor-pointer bg-white text-[#151c26] transition-colors hover:border-gray-300"
                >
                  {sortLabel}
                  <ArrowDown01Icon size={14} className={`text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-2 z-[60]">
                    {SORT_OPTIONS.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => { setSortBy(s.value); setSortOpen(false) }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors border-0 ${
                          sortBy === s.value ? 'bg-accent/5 text-accent font-bold' : 'bg-transparent hover:bg-gray-50 text-[#151c26]'
                        }`}
                      >
                        <span className="text-sm font-medium">{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="font-bold text-[#151c26] text-base mb-2">
                  Sin resultados
                </p>
                <p className="text-sm text-gray-400 mb-5">
                  {nearUniversityId
                    ? 'Todavía ninguna propiedad tiene ubicación registrada cerca de esa universidad. Prueba sin ese filtro.'
                    : 'Intenta cambiar o limpiar los filtros seleccionados.'}
                </p>
                <button
                  onClick={onClearFilters}
                  className="px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                    featuredUntil={p.featuredUntil}
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
  )
}
