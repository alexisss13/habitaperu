'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { TenantsDesktop } from "./tenants-desktop"
import { TenantsMobile } from "./tenants-mobile"

export interface TenantItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  verified: boolean
  memberSince: string
  kyc: {
    status: string
    dniVerified: boolean
    biometricVerified: boolean
    backgroundCheck: boolean
  } | null
  activeContract: {
    id: string
    status: string
    monthlyRent: number
    startDate: string
    endDate: string
    property: { id: string; title: string; district: string; type: string }
  } | null
  contractsCount: number
  lastPayment: { status: string; dueDate: string; amount: number } | null
}

export function TenantsView({ tenants }: { tenants: TenantItem[] }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando inquilinos..." />
  return isMobile ? <TenantsMobile tenants={tenants} /> : <TenantsDesktop tenants={tenants} />
}
