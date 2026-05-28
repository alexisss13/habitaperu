"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { TenantContractDesktop } from "./contract-desktop"
import { TenantContractMobile } from "./contract-mobile"

export interface TenantContractItem {
  id: string
  status: "DRAFT" | "PENDING_TENANT" | "PENDING_LANDLORD" | "ACTIVE" | "FINISHED" | "BREACHED_CANCELLED"
  monthlyRent: number
  currency: string
  startDate: string
  endDate: string
  paymentDay: number
  deposit: number
  documentHash: string | null
  terms: string | null
  landlordSignedAt: string | null
  tenantSignedAt: string | null
  property: {
    id: string
    title: string
    address: string | null
    district: string
    type: string
    area: number
    rooms: number
    bathrooms: number
  }
  landlord: {
    firstName: string
    lastName: string
    email: string
    phone: string | null
  }
}

interface Props {
  contracts: TenantContractItem[]
}

export function TenantContractView({ contracts }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando tus contratos..." />
  }

  return isMobile ? (
    <TenantContractMobile contracts={contracts} />
  ) : (
    <TenantContractDesktop contracts={contracts} />
  )
}
