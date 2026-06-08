'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { PropertiesDesktop } from "./properties-desktop"
import { PropertiesMobile } from "./properties-mobile"

export interface PropertyInfo {
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
  views: number
  featuredUntil?: string | null
  createdAt: string
}

interface PropertiesViewProps {
  properties: PropertyInfo[]
  isMockPayment: boolean
  subscriptionPlan: string
  propertyCount: number
  openUpgrade?: boolean
}

export function PropertiesView({ properties, isMockPayment, subscriptionPlan, propertyCount, openUpgrade }: PropertiesViewProps) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando tus propiedades..." />
  }

  return isMobile ? (
    <PropertiesMobile properties={properties} isMockPayment={isMockPayment} subscriptionPlan={subscriptionPlan} propertyCount={propertyCount} openUpgrade={openUpgrade} />
  ) : (
    <PropertiesDesktop properties={properties} isMockPayment={isMockPayment} subscriptionPlan={subscriptionPlan} propertyCount={propertyCount} openUpgrade={openUpgrade} />
  )
}
