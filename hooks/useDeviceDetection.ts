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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Marcar como montado inmediatamente
    setMounted(true)
    
    const detectDevice = () => {
      try {
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
      } catch (error) {
        console.error('Error detecting device:', error)
        // En caso de error, asumir desktop y terminar loading
        setDeviceType('desktop')
        setIsLoading(false)
      }
    }

    // Ejecutar detección inmediatamente
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

  // Si no está montado, forzar loading a false después de un timeout
  useEffect(() => {
    if (!mounted) return
    
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Device detection timeout - forcing desktop mode')
        setDeviceType('desktop')
        setIsLoading(false)
      }
    }, 2000) // 2 segundos de timeout

    return () => clearTimeout(fallbackTimeout)
  }, [mounted, isLoading])

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isDesktop: deviceType === 'desktop',
    isLoading
  }
}
