"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { TenantKYCDesktop } from "./kyc-desktop"
import { TenantKYCMobile } from "./kyc-mobile"

export interface KYCVerificationData {
  status: "PENDIENTE" | "EN_REVISION" | "APROBADO" | "RECHAZADO"
  dniDocument: string | null
  dniVerified: boolean
  biometricVerified: boolean
  backgroundCheck: boolean
  reviewNotes: string | null
  verifiedAt: string | null
}

interface Props {
  verification: KYCVerificationData | null
  isMockPayment: boolean
}

export function TenantKYCView({ verification, isMockPayment }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando estado de verificación..." />
  }

  return isMobile ? (
    <TenantKYCMobile verification={verification} isMockPayment={isMockPayment} />
  ) : (
    <TenantKYCDesktop verification={verification} isMockPayment={isMockPayment} />
  )
}
