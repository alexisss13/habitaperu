"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { AdminKYCDesktop } from "./kyc-desktop"
import { AdminKYCMobile } from "./kyc-mobile"

export interface AdminKYCItem {
  id: string
  userId: string
  status: "PENDIENTE" | "EN_REVISION" | "APROBADO" | "RECHAZADO"
  dniVerified: boolean
  biometricVerified: boolean
  backgroundCheck: boolean
  dniDocument: string | null
  biometricData: string | null
  backgroundReport: string | null
  reviewNotes: string | null
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
    phone: string | null
    role: string
    verified: boolean
  }
}

interface Props {
  verifications: AdminKYCItem[]
  currentFilter?: string | null
  page?: number
  limit?: number
  totalPages?: number
}

export function AdminKYCView({ verifications, currentFilter, page, limit, totalPages }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando expedientes KYC..." />
  }

  return isMobile ? (
    <AdminKYCMobile verifications={verifications} currentFilter={currentFilter} />
  ) : (
    <AdminKYCDesktop verifications={verifications} currentFilter={currentFilter} />
  )
}
