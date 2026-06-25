'use client'

import { useState, useEffect } from "react"
import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { FavoritesDesktop } from "./favorites-desktop"
import { FavoritesMobile } from "./favorites-mobile"

export interface FavoriteProperty {
  id: string
  title: string
  district: string
  province: string
  price: number
  type: string
  condition: string
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  images: string[]
  status: string
  owner: { firstName: string; lastName: string; verified: boolean }
  _count: { reviews: number }
}

export function FavoritesView() {
  const [properties, setProperties] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ids: string[] = []
    try {
      const stored = localStorage.getItem("habitaperu_favorites")
      ids = stored ? JSON.parse(stored) : []
    } catch {}

    if (ids.length === 0) {
      return
    }

    fetch(`/api/favorites?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProperties(data.properties ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const removeFavorite = (id: string) => {
    try {
      const stored = localStorage.getItem("habitaperu_favorites")
      const ids: string[] = stored ? JSON.parse(stored) : []
      const updated = ids.filter((fid) => fid !== id)
      localStorage.setItem("habitaperu_favorites", JSON.stringify(updated))
    } catch {}
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  const { isMobile, isLoading } = useResponsive()
  if (isLoading || loading) return <LoadingScreen message="Cargando favoritos..." />
  return isMobile
    ? <FavoritesMobile properties={properties} onRemove={removeFavorite} />
    : <FavoritesDesktop properties={properties} onRemove={removeFavorite} />
}
