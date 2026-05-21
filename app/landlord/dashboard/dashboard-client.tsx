'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
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
    tenant: {
      name: string
      email: string
    }
    property: {
      title: string
      district: string
    }
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
  const { isMobile, isLoading } = useDeviceDetection()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#FF385C] to-[#E33152] rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-3xl font-bold text-white">H</span>
          </div>
          <p className="text-base text-[#64748C] font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return <DashboardMobile data={data} />
  }

  return <DashboardDesktop data={data} />
}
