'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { AdminDashboardDesktop } from './dashboard-desktop'
import { AdminDashboardMobile } from './dashboard-mobile'

export interface AdminDashboardData {
  totalUsers: number
  totalProperties: number
  activeContracts: number
  totalRevenue: number
  tenants: number
  landlords: number
  disponibles: number
  ocupadas: number
  recentUsers: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    createdAt: Date
    verified: boolean
  }>
  recentProperties: Array<{
    id: string
    title: string
    district: string
    price: number
    status: string
    createdAt: Date
    owner: { firstName: string; lastName: string }
  }>
}

export function AdminDashboardView({ data }: { data: AdminDashboardData }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando dashboard..." />
  return isMobile ? <AdminDashboardMobile data={data} /> : <AdminDashboardDesktop data={data} />
}
