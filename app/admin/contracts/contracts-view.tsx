'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { ContractsDesktop } from './contracts-desktop'
import { ContractsMobile } from './contracts-mobile'

export interface AdminContract {
  id: string
  status: string
  startDate: Date
  endDate: Date
  monthlyRent: number
  tenant: { firstName: string; lastName: string; email: string }
  property: { title: string; district: string; price: number; owner: { firstName: string; lastName: string } }
}

export interface ContractsData {
  contracts: AdminContract[]
  stats: { total: number; activo: number; vencido: number; totalValue: number }
}

export function ContractsView({ data }: { data: ContractsData }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando contratos..." />
  return isMobile ? <ContractsMobile data={data} /> : <ContractsDesktop data={data} />
}
