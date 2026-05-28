'use client'
import { useState, useEffect } from 'react'

interface Responsive {
  isMobile: boolean
  isDesktop: boolean
  isLoading: boolean
}

export function useResponsive(): Responsive {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return { isMobile, isDesktop: !isMobile, isLoading: !mounted }
}
