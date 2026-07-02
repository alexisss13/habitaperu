'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { LocationsDesktop } from './locations-desktop'
import { LocationsMobile } from './locations-mobile'
import type { CityAdminRow, DistrictAdminRow } from '@/app/actions/location-actions'

export interface LocationsData {
  cities: CityAdminRow[]
  districts: DistrictAdminRow[]
}

export function LocationsView({ cities, districts }: LocationsData) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando ciudades..." />
  return isMobile
    ? <LocationsMobile cities={cities} districts={districts} />
    : <LocationsDesktop cities={cities} districts={districts} />
}
