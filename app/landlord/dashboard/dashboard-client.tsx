'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { DashboardDesktop } from './dashboard-desktop'
import { DashboardMobile } from './dashboard-mobile'

interface DashboardData {
  metrics: {
    monthlyIncome: number
    occupiedProperties: number
    totalProperties: number
    expiringContracts: number
  }
  payments: Array<{
    id: string
    amount: number
    dueDate: string
    status: string
    tenant: { name: string; email: string }
    property: { title: string; district: string }
  }>
  kycRequests: Array<{
    id: string
    name: string
    email: string
    kycScore: number
    kycStatus: string
  }>
}

interface DashboardClientProps {
  data: DashboardData
}

export function DashboardClient({ data }: DashboardClientProps) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando dashboard..." />
  return isMobile ? <DashboardMobile data={data} /> : <DashboardDesktop data={data} />
}
