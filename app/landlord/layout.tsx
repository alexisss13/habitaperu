import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import RoleTopNav from "@/components/role-top-nav"

export const metadata: Metadata = {
  title: 'Dashboard Arrendador - Habita Perú',
  description: 'Panel de control para arrendadores',
}

interface LandlordLayoutProps {
  children: ReactNode
}

export default async function LandlordLayout({ children }: LandlordLayoutProps) {
  const session = await auth()

  // El gate estricto de "ya es arrendador" vive en cada página; aquí solo se
  // exige sesión porque /landlord/properties/new debe ser alcanzable por
  // cualquier cuenta (así es como se gana isLandlord).
  if (!session) {
    redirect("/login")
  }

  return (
    <RoleTopNav session={session as any} role="landlord">
      {children}
    </RoleTopNav>
  )
}
