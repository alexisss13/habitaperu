import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from 'next'
import RoleTopNav from "@/components/role-top-nav"

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
    <RoleTopNav session={session as any} role="tenant">
      {children}
    </RoleTopNav>
  )
}
