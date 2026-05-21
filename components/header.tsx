"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "@/lib/i18n-context"
import { 
  Home01Icon, 
  UserCircleIcon,
  SecurityCheckIcon,
  FileValidationIcon,
  CustomerSupportIcon
} from "hugeicons-react"
import { LanguageSwitcher } from "./language-switcher"

export function Header() {
  const t = useTranslations('header')
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Ocultar el cintillo al hacer scroll hacia abajo
      if (currentScrollY > 50) {
        setShowAnnouncement(false)
      } else {
        setShowAnnouncement(true)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* MAIN HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          padding: '0 40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}>
            <Home01Icon size={28} style={{ color: '#0f3457' }} />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#151c26',
              letterSpacing: '-0.02em'
            }}>
              Habita Perú
            </span>
          </Link>

          {/* Right Side Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/publicar" style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#151c26',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0f3457'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#151c26'}
            >
              {t('publishProperty')}
            </Link>
            
            {/* Language Switcher */}
            <LanguageSwitcher onLanguageChange={(code) => {
              console.log('Idioma cambiado a:', code)
              // Aquí puedes agregar lógica adicional cuando cambie el idioma
            }} />

            {/* User Menu */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '1.5px solid #d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0f3457'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,52,87,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                aria-label="Menú de usuario"
              >
                <UserCircleIcon size={24} style={{ color: '#6b7280' }} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  minWidth: '220px',
                  padding: '8px 0',
                  zIndex: 200,
                  animation: 'fadeInDown 0.2s ease'
                }}>
                  <div style={{ padding: '8px 0' }}>
                    <Link href="/register" style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: '#151c26',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setUserMenuOpen(false)}>
                      {t('register')}
                    </Link>
                    <Link href="/login" style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: '#151c26',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setUserMenuOpen(false)}>
                      {t('login')}
                    </Link>
                  </div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }}></div>
                  <div style={{ padding: '8px 0' }}>
                    <Link href="/publicar" style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: '#151c26',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setUserMenuOpen(false)}>
                      {t('publishProperty')}
                    </Link>
                    <Link href="#" style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: '#151c26',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setUserMenuOpen(false)}>
                      {t('helpCenter')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ANNOUNCEMENT BAR - Animated */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: 0,
        right: 0,
        zIndex: 99,
        background: 'linear-gradient(90deg, #0f3457 0%, #8f8272 50%, #0f3457 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 8s ease infinite',
        padding: '10px 0',
        overflow: 'hidden',
        transform: showAnnouncement ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showAnnouncement ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        pointerEvents: showAnnouncement ? 'auto' : 'none'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <SecurityCheckIcon size={16} style={{ color: '#d5d0bd' }} />
            <span>{t('announcement.verified')}</span>
          </div>
          <div style={{
            width: '1px',
            height: '16px',
            background: 'rgba(255,255,255,0.3)'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <FileValidationIcon size={16} style={{ color: '#d5d0bd' }} />
            <span>{t('announcement.secure')}</span>
          </div>
          <div style={{
            width: '1px',
            height: '16px',
            background: 'rgba(255,255,255,0.3)'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <CustomerSupportIcon size={16} style={{ color: '#d5d0bd' }} />
            <span>{t('announcement.support')}</span>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    </>
  )
}
