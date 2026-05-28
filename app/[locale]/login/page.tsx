'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { LoginDesktop } from './login-desktop'
import { LoginMobile } from './login-mobile'

export default function LoginPage() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen />
  return isMobile ? <LoginMobile /> : <LoginDesktop />
}
