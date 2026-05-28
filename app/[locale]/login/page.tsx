'use client'

import { Suspense } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { LoginDesktop } from './login-desktop'
import { LoginMobile } from './login-mobile'

function LoginInner() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen />
  return isMobile ? <LoginMobile /> : <LoginDesktop />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginInner />
    </Suspense>
  )
}
