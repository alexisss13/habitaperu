"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Ocultar header y footer en rutas de admin, landlord y tenant.
  // Login/registro SÍ muestran header y footer (estilo Airbnb: tarjeta
  // centrada sobre el layout normal del sitio).
  const isAdminRoute = pathname?.startsWith('/admin')
  const isLandlordRoute = pathname?.startsWith('/landlord')
  const isTenantRoute = pathname?.startsWith('/tenant')
  const isOnboardingRoute = /\/publicar\/onboarding(\/|$)/.test(pathname ?? '')

  const hideLayout = isAdminRoute || isLandlordRoute || isTenantRoute || isOnboardingRoute

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
