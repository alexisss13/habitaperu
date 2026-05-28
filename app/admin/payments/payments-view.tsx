'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PaymentsDesktop } from './payments-desktop'
import { PaymentsMobile } from './payments-mobile'

export interface AdminPayment {
  id: string
  status: string
  amount: number
  paymentMethod: string | null
  paidDate: Date | null
  dueDate: Date
  createdAt: Date
  contract: {
    tenant: { firstName: string; lastName: string; email: string }
    property: { title: string; district: string }
  }
}

export interface PaymentsData {
  payments: AdminPayment[]
  stats: { total: number; pagado: number; pendiente: number; totalAmount: number; thisMonth: number }
}

export function PaymentsView({ data }: { data: PaymentsData }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando pagos..." />
  return isMobile ? <PaymentsMobile data={data} /> : <PaymentsDesktop data={data} />
}
