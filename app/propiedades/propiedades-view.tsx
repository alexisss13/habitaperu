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

export function PropiedadesView({ properties }: { properties: PropertyListing[] }) {
  const { isMobile, isLoading } = useResponsive()
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number | "">("")
  const [maxPrice, setMaxPrice] = useState<number | "">("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [minRooms, setMinRooms] = useState<number>(0)
  const [sortBy, setSortBy] = useState("recent")

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setMinPrice("")
    setMaxPrice("")
    setSelectedDistrict("")
    setMinRooms(0)
    setSortBy("recent")
  }

  // Filter logic
  const filtered = properties.filter(p => {
    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const matchesTitle = p.title.toLowerCase().includes(query)
      const matchesDistrict = p.district.toLowerCase().includes(query)
      const matchesType = p.type.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDistrict && !matchesType) return false
    }

    // Type filter
    if (selectedTypes.length > 0) {
      const typeMap: Record<string, string> = {
        "Departamento": "DEPARTAMENTO",
        "Habitación": "HABITACION",
        "Casa": "CASA"
      }
      const mappedTypes = selectedTypes.map(t => typeMap[t] || t)
      if (!mappedTypes.includes(p.type)) return false
    }

    // Price filter
    if (minPrice !== "" && p.price < minPrice) return false
    if (maxPrice !== "" && p.price > maxPrice) return false

    // District filter
    if (selectedDistrict && p.district !== selectedDistrict) return false

    // Rooms filter
    if (minRooms > 0 && p.rooms < minRooms) return false

    return true
  })

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price
    if (sortBy === "price_desc") return b.price - a.price
    if (sortBy === "rating_desc") return b.avgRating - a.avgRating
    // Default: recent (keeps creation order from server)
    return 0
  })

  // Pagination — deps reset page to 1 when filters change
  const pageSize = isMobile ? 8 : 12
  const pagination = usePagination(sorted, pageSize, [
    searchQuery, selectedTypes.join(","), minPrice, maxPrice,
    selectedDistrict, minRooms, sortBy,
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
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
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
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      minRooms={minRooms}
      setMinRooms={setMinRooms}
      sortBy={sortBy}
      setSortBy={setSortBy}
      onClearFilters={handleClearFilters}
      pagination={pagination}
    />
  )
}
