'use client'

import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { ProfileDesktop } from "./profile-desktop"
import { ProfileMobile } from "./profile-mobile"

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  district: string
  avatar: string | null
  verified: boolean
  twoFactorEnabled: boolean
  memberSince: string
  contractsCount: number
}

export function ProfileView({ profile }: { profile: UserProfile }) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando perfil..." />
  return isMobile ? <ProfileMobile profile={profile} /> : <ProfileDesktop profile={profile} />
}
