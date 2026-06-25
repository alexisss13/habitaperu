"use client"

import { useState, useEffect } from "react"
import { Sun02Icon, Moon02Icon } from "hugeicons-react"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    try {
      const saved = localStorage.getItem('habitaperu-theme') || localStorage.getItem('admin-theme') || 'light'
      return saved === 'dark' ? 'dark' : 'light'
    } catch { return 'light' }
  })
  const [mounted] = useState(() => typeof window !== 'undefined')

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    applyTheme(theme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    try { localStorage.setItem('habitaperu-theme', newTheme) } catch {}
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <div className="size-10 rounded-lg border border-admin-border bg-admin-card-bg" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-10 rounded-lg border border-admin-border bg-admin-card-bg text-admin-text cursor-pointer transition-all hover:bg-[var(--admin-hover-bg)] hover:border-admin-accent"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {theme === 'light' ? <Moon02Icon size={20} /> : <Sun02Icon size={20} />}
    </button>
  )
}
