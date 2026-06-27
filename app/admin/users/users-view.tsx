'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { UsersDesktop } from './users-desktop'
import { UsersMobile } from './users-mobile'

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: string
  verified: boolean
  createdAt: Date
  _count: { propertiesOwned: number; contractsAsTenant: number }
}

export interface UsersData {
  users: AdminUser[]
  stats: { total: number; tenants: number; landlords: number; admins: number; verified: number }
  page?: number
  limit?: number
  totalPages?: number
}

export function UsersView({ data }: { data: UsersData }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando usuarios..." />
  return isMobile ? <UsersMobile data={data} /> : <UsersDesktop data={data} />
}
