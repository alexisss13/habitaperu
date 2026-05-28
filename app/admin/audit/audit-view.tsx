"use client"

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { AuditDesktop } from "./audit-desktop"
import { AuditMobile } from "./audit-mobile"

export interface AuditLogItem {
  id: string
  action: "VIEWED" | "SIGNED_TENANT" | "COUNTERSIGNED_LANDLORD" | string
  ipAddress: string
  userAgent: string
  cryptoHash: string
  timestamp: string
  contractId: string
  propertyTitle: string
  propertyDistrict: string
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

interface Props {
  logs: AuditLogItem[]
}

export function AuditView({ logs }: Props) {
  const { isMobile, isLoading } = useResponsive()

  if (isLoading) {
    return <LoadingScreen message="Cargando registro de auditoría..." />
  }

  return isMobile ? (
    <AuditMobile logs={logs} />
  ) : (
    <AuditDesktop logs={logs} />
  )
}
