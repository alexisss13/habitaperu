'use client'

import { useState, useEffect } from "react"
import { FavoritesView } from "./favorites-view"

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

export default function TenantFavoritesPage() {
  const [properties, setProperties] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("habitaperu_favorites")
    const ids: string[] = stored ? JSON.parse(stored) : []
    setFavoriteIds(ids)

    if (ids.length === 0) {
      setLoading(false)
      return
    }

    fetch(`/api/favorites?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProperties(data.properties ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const removeFavorite = (id: string) => {
    const updated = favoriteIds.filter((fid) => fid !== id)
    setFavoriteIds(updated)
    setProperties((prev) => prev.filter((p) => p.id !== id))
    localStorage.setItem("habitaperu_favorites", JSON.stringify(updated))
  }

  return (
    <FavoritesView
      properties={properties}
      loading={loading}
      onRemove={removeFavorite}
    />
  )
}
