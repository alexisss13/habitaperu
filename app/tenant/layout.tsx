import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from 'next'
import DashboardLayout from "@/components/dashboard-layout"

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

  return (
    <DashboardLayout session={session as any} role="tenant" showThemeSwitch>
      {children}
    </DashboardLayout>
  )
}
