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
  
  // Ocultar header y footer en rutas de admin, landlord y tenant
  const isAdminRoute = pathname?.startsWith('/admin')
  const isLandlordRoute = pathname?.startsWith('/landlord')
  const isTenantRoute = pathname?.startsWith('/tenant')
  const isAuthRoute = /\/(login|register)(\/|$)/.test(pathname ?? '')
  
  const hideLayout = isAdminRoute || isLandlordRoute || isTenantRoute || isAuthRoute

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
