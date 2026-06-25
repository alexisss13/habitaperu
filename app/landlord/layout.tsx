import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LandlordLayoutClient } from "@/components/landlord-layout-client"

export const metadata: Metadata = {
  title: 'Dashboard Arrendador - Habita Perú',
  description: 'Panel de control para arrendadores',
}

interface LandlordLayoutProps {
  children: ReactNode
}

export default async function LandlordLayout({ children }: LandlordLayoutProps) {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  return <LandlordLayoutClient session={session as any}>{children}</LandlordLayoutClient>
}
