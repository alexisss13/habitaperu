"use client"

import { useState, useEffect } from "react"
import { Sun02Icon, Moon02Icon } from "hugeicons-react"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Cargar tema guardado o usar 'light' por defecto
    const savedTheme = (localStorage.getItem('admin-theme') as 'light' | 'dark') || 'light'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.setAttribute('data-theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('admin-theme', newTheme)
    applyTheme(newTheme)
  }

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return (
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid var(--admin-border)',
        background: 'var(--admin-card-bg)'
      }} />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid var(--admin-border)',
        background: 'var(--admin-card-bg)',
        color: 'var(--admin-text)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--admin-hover-bg)'
        e.currentTarget.style.borderColor = 'var(--admin-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--admin-card-bg)'
        e.currentTarget.style.borderColor = 'var(--admin-border)'
      }}
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {theme === 'light' ? (
        <Moon02Icon size={20} />
      ) : (
        <Sun02Icon size={20} />
      )}
    </button>
  )
}
