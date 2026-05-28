import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from 'next'
import { TenantLayoutClient } from "@/components/tenant-layout-client"

export const metadata: Metadata = {
  title: 'Mi Panel Inquilino - Habita Perú',
  description: 'Panel de control para inquilinos',
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "TENANT") {
    redirect("/login")
  }

  // Typecast or pass session as is since next-auth v5 session structure matches layout prop expectation.
  return (
    <TenantLayoutClient session={session as any}>
      {children}
    </TenantLayoutClient>
  )
}
