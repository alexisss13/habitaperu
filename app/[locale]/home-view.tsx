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
  avgRating: number
  reviewCount: number
  amenities: string[]
  tenantProfile: string[]
}

interface PropertyStats {
  minPrice: number
  availableCount: number
}

export interface LandlordStats {
  landlordCount: number
  avgRating: number
  contractCount: number
}

interface HomeViewProps {
  properties: Property[]
  stats: PropertyStats
  landlordStats: LandlordStats
}

export function HomeView({ properties, stats, landlordStats }: HomeViewProps) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando Habita Perú..." />
  return isMobile
    ? <HomeClientMobile properties={properties} stats={stats} landlordStats={landlordStats} />
    : <HomeClientDesktop properties={properties} stats={stats} landlordStats={landlordStats} />
}
