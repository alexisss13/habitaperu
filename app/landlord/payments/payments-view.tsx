"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { LandlordPaymentsDesktop } from "./payments-desktop"
import { LandlordPaymentsMobile } from "./payments-mobile"

export interface LandlordPaymentItem {
  id: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: "PAGADO" | "PENDIENTE" | "EN_PROCESO" | "VENCIDO"
  paymentMethod: string | null
  receipt: string | null
  notes: string | null
  tenantName: string
  tenantEmail: string
  tenantPhone: string | null
  propertyId: string
  propertyName: string
  propertyDistrict: string
  propertyAddress: string | null
}

interface Props {
  payments: LandlordPaymentItem[]
}

export function LandlordPaymentsView({ payments }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando control de pagos..." />
  }

  return isMobile ? (
    <LandlordPaymentsMobile payments={payments} />
  ) : (
    <LandlordPaymentsDesktop payments={payments} />
  )
}
