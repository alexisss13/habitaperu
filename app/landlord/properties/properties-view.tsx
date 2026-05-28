'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { PropertiesDesktop } from "./properties-desktop"
import { PropertiesMobile } from "./properties-mobile"

interface PropertyInfo {
  id: string
  title: string
  description: string
  type: "HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL"
  condition: "SIN_MUEBLES" | "SEMI_AMOBLADO" | "AMOBLADO"
  status: "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO"
  district: string
  address?: string | null
  area?: number | null
  rooms: number
  bathrooms: number
  parking: number
  price: number
  deposit: number
  minDuration: number
  images?: any
  createdAt: string
}

interface PropertiesViewProps {
  properties: PropertyInfo[]
}

export function PropertiesView({ properties }: PropertiesViewProps) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando tus propiedades..." />
  }

  return isMobile ? (
    <PropertiesMobile properties={properties} />
  ) : (
    <PropertiesDesktop properties={properties} />
  )
}
