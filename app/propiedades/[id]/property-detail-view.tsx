'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PropertyDetailDesktop } from './property-detail-desktop'
import { PropertyDetailMobile } from './property-detail-mobile'

export interface PropertyDetail {
  id: string
  title: string
  type: string
  district: string
  price: number
  rooms: number
  bathrooms: number
  area: number | null
  images: string[]
  amenities: string[]
  description: string
  deposit: number
  minDuration: number
  avgRating: number
  owner: { id: string; firstName: string; lastName: string; phone: string | null; verified: boolean; avatar: string | null }
  reviews: Array<{ id: string; rating: number; comment: string; author: { firstName: string; lastName: string; avatar: string | null } }>
}

export function PropertyDetailView({ property }: { property: PropertyDetail }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando propiedad..." />
  return isMobile
    ? <PropertyDetailMobile property={property} />
    : <PropertyDetailDesktop property={property} />
}
