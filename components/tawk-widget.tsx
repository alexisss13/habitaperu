'use client'

import { useEffect } from "react"

export function TawkWidget() {
  useEffect(() => {
    const s = document.createElement("script")
    s.async = true
    s.src = "https://embed.tawk.to/6a21ac16204aec1c2e8c2add/1jq9ogenv"
    s.charset = "UTF-8"
    s.setAttribute("crossorigin", "*")
    document.head.appendChild(s)
    return () => {
      document.head.removeChild(s)
    }
  }, [])

  return null
}
