'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PublishClient } from './publish-client'
import { PublishMobile } from './publish-mobile'

export default function PublishPage() {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando..." />
  return isMobile ? <PublishMobile /> : <PublishClient />
}
