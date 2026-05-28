"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, Fragment } from "react"
import { useTranslations, useLocale } from "@/lib/i18n-context"
import { Home01Icon, UserCircleIcon, SecurityCheckIcon, FileValidationIcon, CustomerSupportIcon } from "hugeicons-react"
import { LanguageSwitcher } from "./language-switcher"

export function Header() {
  const t = useTranslations('header')
  const locale = useLocale()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowAnnouncement(window.scrollY <= 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuLink = "block px-4 py-3 text-sm text-[#151c26] no-underline hover:bg-gray-50 transition-colors"

  return (
    <>
      {/* Main header */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-[72px] px-10 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <Home01Icon size={28} className="text-accent" />
            <span className="text-2xl font-extrabold text-[#151c26] tracking-tight">Habita Perú</span>
          </Link>

          {/* Right nav */}
          <div className="flex items-center gap-6">
            <Link href="/publicar" className="text-[0.9rem] font-medium text-[#151c26] no-underline hover:text-accent transition-colors">
              {t('publishProperty')}
            </Link>

            <LanguageSwitcher onLanguageChange={(code) => console.log('Idioma:', code)} />

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="size-10 rounded-full border-[1.5px] border-gray-300 flex items-center justify-center bg-transparent cursor-pointer hover:border-accent hover:shadow-[0_2px_8px_rgba(15,52,87,0.15)] transition-all"
                aria-label="Menú de usuario"
              >
                <UserCircleIcon size={24} className="text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] min-w-[220px] py-2 z-[200]">
                  <div className="py-2">
                    <Link href={`/${locale}/register`} className={`${menuLink} font-semibold`} onClick={() => setUserMenuOpen(false)}>
                      {t('register')}
                    </Link>
                    <Link href={`/${locale}/login`} className={menuLink} onClick={() => setUserMenuOpen(false)}>
                      {t('login')}
                    </Link>
                  </div>
                  <div className="h-px bg-gray-200 mx-0 my-2" />
                  <div className="py-2">
                    <Link href="/publicar" className={menuLink} onClick={() => setUserMenuOpen(false)}>
                      {t('publishProperty')}
                    </Link>
                    <Link href="#" className={menuLink} onClick={() => setUserMenuOpen(false)}>
                      {t('helpCenter')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Announcement bar */}
      <div
        className="fixed inset-x-0 z-[99] py-2.5 overflow-hidden pointer-events-auto transition-[transform,opacity] duration-300"
        style={{
          top: '72px',
          background: 'linear-gradient(90deg, #0f3457 0%, #8f8272 50%, #0f3457 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 8s ease infinite',
          transform: showAnnouncement ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showAnnouncement ? 1 : 0,
          pointerEvents: showAnnouncement ? 'auto' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-10 flex items-center justify-center gap-8 flex-wrap">
          {[
            { Icon: SecurityCheckIcon, key: 'verified' },
            { Icon: FileValidationIcon, key: 'secure' },
            { Icon: CustomerSupportIcon, key: 'support' },
          ].map(({ Icon, key }, i) => (
            <Fragment key={key}>
              {i > 0 && <div className="w-px h-4 bg-white/30" />}
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <Icon size={16} className="text-[#d5d0bd]" />
                <span>{t(`announcement.${key}`)}</span>
              </div>
            </Fragment>
          ))}
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
