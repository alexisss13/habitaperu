'use client'

import { useEffect } from "react"

export function TawkWidget() {
  useEffect(() => {
    const s = document.createElement("script")
    s.async = true
    s.src = "https://embed.tawk.to/TAWK_PROPERTY_ID/default"
    s.charset = "UTF-8"
    s.setAttribute("crossorigin", "*")
    document.head.appendChild(s)
    return () => {
      document.head.removeChild(s)
    }
  }, [])

  return null
}
