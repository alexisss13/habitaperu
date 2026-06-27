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
  ownerPhoneVisible: boolean
  isAuthenticated: boolean
  status: string
}

export function PropertyDetailView({ property }: { property: PropertyDetail }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando propiedad..." />

  // Las amenidades son texto libre (seed o ingresadas a mano) y pueden traer
  // duplicados que solo difieren en mayúsculas/espacios (ej. "WiFi" y "wifi").
  const dedupedAmenities = Array.from(
    new Map(property.amenities.map(a => [a.toLowerCase().trim(), a])).values()
  )
  const normalized = { ...property, amenities: dedupedAmenities }

  return isMobile
    ? <PropertyDetailMobile property={normalized} />
    : <PropertyDetailDesktop property={normalized} />
}
