"use client"

import Link from "next/link"
import { Search01Icon, Location01Icon, StarIcon, Building03Icon } from "hugeicons-react"
import { Pagination } from "@/components/ui/pagination"
import type { PropertyListing } from './propiedades-view'
import { UNIVERSITIES } from "@/lib/universities"

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
  nearUniversityId: string
  setNearUniversityId: (id: string) => void
  nearRadiusKm: number
  setNearRadiusKm: (km: number) => void
  conditionFilter: string
  setConditionFilter: (c: string) => void
  amenityFilter: string
}

const TYPE_LABEL: Record<string, string> = {
  HABITACION: "Habitación",
  DEPARTAMENTO: "Departamento",
  CASA: "Casa",
  OFICINA: "Oficina",
  LOCAL: "Local",
}

const QUICK_FILTERS = [
  { label: "Todos", type: "clear", value: "" },
  { label: "Depas", type: "type", value: "Departamento" },
  { label: "Habitaciones", type: "type", value: "Habitación" },
  { label: "Casas", type: "type", value: "Casa" },
  { label: "Amoblados", type: "condition", value: "AMOBLADO" },
  { label: "Miraflores", type: "district", value: "Miraflores" },
  { label: "Barranco", type: "district", value: "Barranco" },
  { label: "Surco", type: "district", value: "Santiago de Surco" },
  { label: "San Isidro", type: "district", value: "San Isidro" },
]

function NativePropCard({ p }: { p: PropertyListing }) {
  return (
    <Link href={`/propiedades/${p.id}`} className="no-underline block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.985] transition-transform">
        {/* Image */}
        <div className="relative h-44 bg-gray-100">
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building03Icon size={40} className="text-gray-300" />
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
            {p.featuredUntil && new Date(p.featuredUntil) > new Date() && (
              <span className="text-[11px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
                ★ Destacado
              </span>
            )}
            <span className="text-[11px] font-semibold bg-white/90 text-[#151c26] px-2.5 py-0.5 rounded-full shadow-sm">
              {TYPE_LABEL[p.type] ?? p.type}
            </span>
          </div>
          {p.avgRating > 0 && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <StarIcon size={10} />
              <span>{p.avgRating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-bold text-[#151c26] text-sm leading-snug line-clamp-2 mb-1.5">
            {p.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <Location01Icon size={11} />
            <span>{p.district}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base font-extrabold text-accent">
              S/ {p.price.toLocaleString("es-PE")}
              <span className="text-xs font-normal text-gray-400"> /mes</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{p.rooms} hab.</span>
              <span>·</span>
              <span>{p.bathrooms} baños</span>
              {p.area && (
                <>
                  <span>·</span>
                  <span>{p.area}m²</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PropiedadesMobile({
  properties,
  totalFiltered,
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  selectedDistrict,
  setSelectedDistrict,
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
  amenityFilter,
}: MobileProps) {
  const handlePillClick = (filter: (typeof QUICK_FILTERS)[0]) => {
    if (filter.type === "clear") {
      onClearFilters()
    } else if (filter.type === "type") {
      setSelectedTypes((prev) =>
        prev.includes(filter.value)
          ? prev.filter((x) => x !== filter.value)
          : [...prev, filter.value]
      )
    } else if (filter.type === "district") {
      setSelectedDistrict(selectedDistrict === filter.value ? "" : filter.value)
    } else if (filter.type === "condition") {
      setConditionFilter(conditionFilter === filter.value ? "" : filter.value)
    }
  }

  const isPillActive = (filter: (typeof QUICK_FILTERS)[0]) => {
    if (filter.type === "clear")
      return selectedTypes.length === 0 && !selectedDistrict && !conditionFilter && !nearUniversityId && !amenityFilter
    if (filter.type === "type") return selectedTypes.includes(filter.value)
    if (filter.type === "district") return selectedDistrict === filter.value
    if (filter.type === "condition") return conditionFilter === filter.value
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-6">
      {/* Sticky search + filters */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 shadow-sm">
        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, distrito, tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-gray-50 text-[#151c26] font-medium"
            />
            <Search01Icon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div
          className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {QUICK_FILTERS.map((f) => {
            const active = isPillActive(f)
            return (
              <button
                key={f.label}
                onClick={() => handlePillClick(f)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  active
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "border-gray-200 text-gray-600 bg-white"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Filtro Universitario en Mobile */}
        <div className="px-4 pb-3 pt-1 border-t border-gray-100 flex flex-col gap-2 bg-white">
          <div className="flex gap-2">
            <select
              value={nearUniversityId}
              onChange={e => setNearUniversityId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-accent bg-gray-50 cursor-pointer"
            >
              <option value="">Cerca de universidad...</option>
              {UNIVERSITIES.map(u => (
                <option key={u.id} value={u.id}>
                  {u.shortName} ({u.city})
                </option>
              ))}
            </select>
          </div>
          {nearUniversityId && (
            <div className="flex items-center gap-3 px-1 py-1">
              <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">Radio: {nearRadiusKm} km</span>
              <input
                type="range" min={0.5} max={5} step={0.5}
                value={nearRadiusKm}
                onChange={e => setNearRadiusKm(Number(e.target.value))}
                className="flex-1 accent-accent cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sort bar */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-white border-b border-gray-50">
        <p className="text-xs text-gray-400 font-medium">
          {totalFiltered} {totalFiltered === 1 ? "propiedad" : "propiedades"}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none font-semibold bg-white cursor-pointer text-[#151c26]"
        >
          <option value="recent">Más recientes</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
          <option value="rating_desc">Mejor calificación</option>
        </select>
      </div>

      {/* Property list */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Building03Icon size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-500 text-sm">Sin resultados</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              {nearUniversityId
                ? 'Todavía ninguna propiedad tiene ubicación registrada cerca de esa universidad.'
                : 'Intenta cambiar los filtros seleccionados'}
            </p>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl border-none cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          properties.map((p) => <NativePropCard key={p.id} p={p} />)
        )}

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
