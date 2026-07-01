import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Add01Icon } from "hugeicons-react"

export const metadata: Metadata = {
  title: 'Dashboard Arrendador - Habita Perú',
  description: 'Panel de control para arrendadores',
}

const headerActions = (
  <Link
    href="/landlord/properties/new"
    className="hidden sm:inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold !text-white no-underline shadow-sm hover:brightness-110 transition-all"
    style={{ background: "linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-accent-hover) 100%)" }}
  >
    <Add01Icon size={15} />
    Publicar
  </Link>
)

interface LandlordLayoutProps {
  children: ReactNode
}

export default async function LandlordLayout({ children }: LandlordLayoutProps) {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  return (
    <DashboardLayout session={session as any} role="landlord" headerActions={headerActions} showThemeSwitch>
      {children}
    </DashboardLayout>
  )
}
