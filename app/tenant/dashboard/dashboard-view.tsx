'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { TenantDashboardDesktop } from './dashboard-desktop'
import { TenantDashboardMobile } from './dashboard-mobile'

interface TenantSession {
  user: {
    name?: string | null
    email?: string | null
  }
}

interface TenantDashboardData {
  activeProperty: {
    title: string
    price: number
  } | null
  nextPayment: {
    dueDate: string
    amount: number
  } | null
  paymentHistory: Array<{
    id: string
    month: string
    date: string
    amount: number
    status: string
  }>
  favoritesCount: number
}

interface DashboardViewProps {
  session: TenantSession
  data: TenantDashboardData
}

export function TenantDashboardView({ session, data }: DashboardViewProps) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando tu panel..." />
  return isMobile
    ? <TenantDashboardMobile session={session} data={data} />
    : <TenantDashboardDesktop session={session} data={data} />
}
