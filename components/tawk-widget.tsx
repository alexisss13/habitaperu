'use client'

import { useEffect } from "react"

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void
      showWidget?: () => void
      onLoad?: () => void
    }
  }
}

export function TawkWidget() {
  useEffect(() => {
    // El widget arranca oculto: su burbuja flotante por defecto choca con
    // las tarjetas flotantes del hero de la home (precio / disponibilidad).
    // Se revela al hacer scroll o, como respaldo, a los pocos segundos.
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_API.onLoad = () => window.Tawk_API?.hideWidget?.()

    const s = document.createElement("script")
    s.async = true
    s.src = "https://embed.tawk.to/6a21ac16204aec1c2e8c2add/1jq9ogenv"
    s.charset = "UTF-8"
    s.setAttribute("crossorigin", "*")
    document.head.appendChild(s)

    const reveal = () => window.Tawk_API?.showWidget?.()
    const handleScroll = () => {
      if (window.scrollY > 400) {
        reveal()
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    const fallback = setTimeout(reveal, 8000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(fallback)
      document.head.removeChild(s)
    }
  }, [])

  return null
}
