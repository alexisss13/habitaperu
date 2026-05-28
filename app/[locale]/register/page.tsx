'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { RegisterDesktop } from './register-desktop'
import { RegisterMobile } from './register-mobile'

export default function RegisterPage() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen />
  return isMobile ? <RegisterMobile /> : <RegisterDesktop />
}
