'use client'

import { Suspense } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { LoginDesktop } from '../login/login-desktop'
import { LoginMobile } from '../login/login-mobile'

// El registro se fusionó con el login en un solo flujo (email → login o
// crear cuenta, según exista o no). Esta ruta se mantiene para no romper
// enlaces existentes, pero renderiza la misma pantalla unificada.
function RegisterInner() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen />
  return isMobile ? <LoginMobile /> : <LoginDesktop />
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RegisterInner />
    </Suspense>
  )
}
