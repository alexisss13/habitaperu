'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PropertiesDesktop } from './properties-desktop'
import { PropertiesMobile } from './properties-mobile'

export interface AdminPropertyItem {
  id: string
  title: string
  district: string
  price: number
  status: string
  rooms: number
  bathrooms: number
  area: number
  images: string[]
  owner: { firstName: string; lastName: string; email: string }
}

export interface PropertiesData {
  properties: AdminPropertyItem[]
  stats: { total: number; disponible: number; ocupada: number; mantenimiento: number; avgPrice: number }
  page?: number
  limit?: number
  totalPages?: number
}

export function PropertiesView({ data }: { data: PropertiesData }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando propiedades..." />
  return isMobile ? <PropertiesMobile data={data} /> : <PropertiesDesktop data={data} />
}
