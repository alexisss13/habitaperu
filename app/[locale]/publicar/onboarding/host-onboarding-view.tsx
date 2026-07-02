'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { HostOnboardingDesktop } from './host-onboarding-desktop'
import { HostOnboardingMobile } from './host-onboarding-mobile'

export function HostOnboardingView() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando..." />
  return isMobile ? <HostOnboardingMobile /> : <HostOnboardingDesktop />
}
