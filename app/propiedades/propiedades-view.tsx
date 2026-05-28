'use client'

import { useResponsive } from '@/hooks/useResponsive'
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
  if (isLoading) return <LoadingScreen message="Cargando propiedades..." />
  return isMobile
    ? <PropiedadesMobile properties={properties} />
    : <PropiedadesDesktop properties={properties} />
}
