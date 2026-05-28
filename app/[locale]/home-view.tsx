'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { HomeClientDesktop } from './home-client-desktop'
import { HomeClientMobile } from './home-client-mobile'

interface Property {
  id: string
  title: string
  type: string
  condition: string
  district: string
  price: number
  images: string[]
  favorites: number
  rooms: number
  bathrooms: number
  area: number
  _count: { reviews: number }
}

interface PropertyStats {
  minPrice: number
  availableCount: number
}

export interface CityCount {
  city: string
  count: number
}

interface HomeViewProps {
  properties: Property[]
  stats: PropertyStats
  cityCounts: CityCount[]
}

export function HomeView({ properties, stats, cityCounts }: HomeViewProps) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando Habita Perú..." />
  return isMobile
    ? <HomeClientMobile properties={properties} stats={stats} />
    : <HomeClientDesktop properties={properties} stats={stats} cityCounts={cityCounts} />
}
