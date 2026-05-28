'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { FavoritesDesktop } from "./favorites-desktop"
import { FavoritesMobile } from "./favorites-mobile"
import type { FavoriteProperty } from "./page"

interface Props {
  properties: FavoriteProperty[]
  loading: boolean
  onRemove: (id: string) => void
}

export function FavoritesView({ properties, loading, onRemove }: Props) {
  const { isMobile, isLoading } = useResponsive()
  if (loading || isLoading) return <LoadingScreen message="Cargando favoritos..." />
  return isMobile
    ? <FavoritesMobile properties={properties} onRemove={onRemove} />
    : <FavoritesDesktop properties={properties} onRemove={onRemove} />
}
