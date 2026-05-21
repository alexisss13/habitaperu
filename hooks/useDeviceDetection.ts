'use client'

import { useState, useEffect } from 'react'

export type DeviceType = 'mobile' | 'desktop'

interface DeviceDetection {
  deviceType: DeviceType
  isMobile: boolean
  isDesktop: boolean
  isLoading: boolean
}

/**
 * Hook para detectar el tipo de dispositivo del usuario
 * Usa tanto user agent como ancho de pantalla para mayor precisión
 * 
 * @returns {DeviceDetection} Información sobre el dispositivo actual
 */
export function useDeviceDetection(): DeviceDetection {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectDevice = () => {
      // Detectar por User Agent
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Detectar por ancho de pantalla (breakpoint: 768px)
      const isMobileWidth = window.innerWidth < 768
      
      // Detectar por touch capability
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Considerar móvil si cumple al menos 2 de 3 condiciones
      const mobileScore = [isMobileUA, isMobileWidth, isTouchDevice].filter(Boolean).length
      const isMobile = mobileScore >= 2
      
      setDeviceType(isMobile ? 'mobile' : 'desktop')
      setIsLoading(false)
    }

    detectDevice()

    // Re-detectar en resize (con debounce)
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectDevice, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isDesktop: deviceType === 'desktop',
    isLoading
  }
}
