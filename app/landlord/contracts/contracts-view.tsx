'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { ContractsDesktop } from "./contracts-desktop"
import { ContractsMobile } from "./contracts-mobile"

interface LandlordInfo {
  id: string
  firstName: string
  lastName: string
  dni: string | null
  email: string
  phone: string | null
  district: string | null
}

interface TenantInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  dni?: string | null
  phone?: string | null
  district?: string | null
}

interface PropertyInfo {
  id: string
  title: string
  price: number
  district: string
  address?: string | null
  type?: "HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL"
  area?: number | null
  rooms?: number
  bathrooms?: number
}

interface ContractInfo {
  id: string
  status: "DRAFT" | "PENDING_TENANT" | "PENDING_LANDLORD" | "ACTIVE" | "FINISHED" | "BREACHED_CANCELLED"
  monthlyRent: number
  currency: string
  startDate: string
  endDate: string
  tenant: TenantInfo
  property: PropertyInfo
  createdAt: string
}

interface ContractsViewProps {
  landlord: LandlordInfo
  contracts: ContractInfo[]
  properties: PropertyInfo[]
  tenants: TenantInfo[]
}

export function ContractsView({ landlord, contracts, properties, tenants }: ContractsViewProps) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando tus contratos..." />
  }

  return isMobile ? (
    <ContractsMobile 
      landlord={landlord}
      contracts={contracts} 
      properties={properties} 
      tenants={tenants} 
    />
  ) : (
    <ContractsDesktop 
      landlord={landlord}
      contracts={contracts} 
      properties={properties} 
      tenants={tenants} 
    />
  )
}
