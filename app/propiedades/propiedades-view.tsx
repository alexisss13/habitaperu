"use client"

import { useState } from "react"
import { useResponsive } from '@/hooks/useResponsive'
import { usePagination } from '@/hooks/use-pagination'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PropiedadesDesktop } from './propiedades-desktop'
import { PropiedadesMobile } from './propiedades-mobile'

export interface PropertyListing {
  id: string
  title: string
  type: string
  condition: string
  district: string
  price: number
  rooms: number
  bathrooms: number
  area: number | null
  images: string[]
  avgRating: number
  reviewCount: number
  status: string
}

// Maps URL type param → display label used in the type filter
const TYPE_PARAM_MAP: Record<string, string> = {
  departamento: 'Departamento',
  habitacion:   'Habitación',
  casa:         'Casa',
  DEPARTAMENTO: 'Departamento',
  HABITACION:   'Habitación',
  CASA:         'Casa',
}

interface ViewProps {
  properties: PropertyListing[]
  initialDistrict?: string
  initialType?: string
  initialSort?: string
  initialCondition?: string
  initialSearchQuery?: string
}

export function PropiedadesView({
  properties,
  initialDistrict = '',
  initialType = '',
  initialSort = 'recent',
  initialCondition = '',
  initialSearchQuery = '',
}: ViewProps) {
  const { isMobile, isLoading } = useResponsive()

  const [searchQuery, setSearchQuery]       = useState(initialSearchQuery)
  const [selectedTypes, setSelectedTypes]   = useState<string[]>(
    initialType ? [TYPE_PARAM_MAP[initialType] ?? initialType] : []
  )
  const [minPrice, setMinPrice]             = useState<number | "">("")
  const [maxPrice, setMaxPrice]             = useState<number | "">("")
  const [districtSearch, setDistrictSearch] = useState(initialDistrict)
  const [minRooms, setMinRooms]             = useState<number>(0)
  const [sortBy, setSortBy]                 = useState(initialSort)
  const [conditionFilter, setConditionFilter] = useState(initialCondition)

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setMinPrice("")
    setMaxPrice("")
    setDistrictSearch("")
    setMinRooms(0)
    setSortBy("recent")
    setConditionFilter("")
  }

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = properties.filter(p => {
    // Full-text search (title, district, type)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.district.toLowerCase().includes(q) &&
        !p.type.toLowerCase().includes(q)
      ) return false
    }

    // Type filter
    if (selectedTypes.length > 0) {
      const typeMap: Record<string, string> = {
        Departamento: 'DEPARTAMENTO',
        Habitación:   'HABITACION',
        Casa:         'CASA',
      }
      const mapped = selectedTypes.map(t => typeMap[t] ?? t)
      if (!mapped.includes(p.type)) return false
    }

    // Condition filter (e.g. AMOBLADO)
    if (conditionFilter && p.condition !== conditionFilter) return false

    // Price filter
    if (minPrice !== "" && p.price < minPrice) return false
    if (maxPrice !== "" && p.price > maxPrice) return false

    // District/city text search — partial match, case-insensitive
    // This allows filtering by "Lima", "Arequipa", "San Isidro", etc.
    if (districtSearch.trim()) {
      if (!p.district.toLowerCase().includes(districtSearch.toLowerCase())) return false
    }

    // Rooms filter
    if (minRooms > 0 && p.rooms < minRooms) return false

    return true
  })

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc')   return a.price - b.price
    if (sortBy === 'price_desc')  return b.price - a.price
    if (sortBy === 'rating_desc') return b.avgRating - a.avgRating
    return 0
  })

  const pageSize = isMobile ? 8 : 12
  const pagination = usePagination(sorted, pageSize, [
    searchQuery, selectedTypes.join(','), minPrice, maxPrice,
    districtSearch, minRooms, sortBy, conditionFilter,
  ])

  if (isLoading) return <LoadingScreen message="Cargando propiedades..." />

  return isMobile ? (
    <PropiedadesMobile
      properties={pagination.paginatedItems}
      totalFiltered={sorted.length}
      originalProperties={properties}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      selectedDistrict={districtSearch}
      setSelectedDistrict={setDistrictSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      onClearFilters={handleClearFilters}
      pagination={pagination}
    />
  ) : (
    <PropiedadesDesktop
      properties={pagination.paginatedItems}
      totalFiltered={sorted.length}
      originalProperties={properties}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      selectedDistrict={districtSearch}
      setSelectedDistrict={setDistrictSearch}
      minRooms={minRooms}
      setMinRooms={setMinRooms}
      sortBy={sortBy}
      setSortBy={setSortBy}
      onClearFilters={handleClearFilters}
      pagination={pagination}
    />
  )
}
