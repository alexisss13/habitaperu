"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { TenantPaymentsDesktop } from "./payments-desktop"
import { TenantPaymentsMobile } from "./payments-mobile"

export interface TenantPaymentItem {
  id: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: "PAGADO" | "PENDIENTE" | "EN_PROCESO" | "VENCIDO"
  paymentMethod: string | null
  receipt: string | null
  notes: string | null
  propertyName: string
  propertyDistrict: string
  contractTerms: string | null
}

interface Props {
  payments: TenantPaymentItem[]
}

export function TenantPaymentsView({ payments }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando tus pagos..." />
  }

  return isMobile ? (
    <TenantPaymentsMobile payments={payments} />
  ) : (
    <TenantPaymentsDesktop payments={payments} />
  )
}
