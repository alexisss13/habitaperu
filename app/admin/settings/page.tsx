'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { SettingsDesktop } from './settings-desktop'
import { SettingsMobile } from './settings-mobile'

export default function SettingsPage() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando configuración..." />
  return isMobile ? <SettingsMobile /> : <SettingsDesktop />
}
