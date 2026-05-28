"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, Fragment } from "react"
import { useSession } from "next-auth/react"
import { useTranslations, useLocale } from "@/lib/i18n-context"
import {
  Home01Icon, UserCircleIcon, SecurityCheckIcon,
  FileValidationIcon, CustomerSupportIcon, Logout01Icon,
  Building03Icon
} from "hugeicons-react"
import { LanguageSwitcher } from "./language-switcher"

export function Header() {
  const t = useTranslations('header')
  const locale = useLocale()
  const pathname = usePathname()
  const { data: session, status } = useSession()
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

  const isLoggedIn = status === 'authenticated'
  const role = (session?.user as any)?.role as string | undefined
  const hasActiveContract = (session?.user as any)?.hasActiveContract as boolean | undefined
  const userName = session?.user?.name ?? ''
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  // Dashboard link per role
  const dashboardHref =
    role === 'ADMIN'    ? '/admin/dashboard' :
    role === 'LANDLORD' ? '/landlord/dashboard' :
    role === 'TENANT'   ? '/tenant/dashboard' : `/${locale}`

  const dashboardLabel =
    role === 'ADMIN'    ? 'Panel Admin' :
    role === 'LANDLORD' ? 'Mis propiedades' :
    role === 'TENANT'   ? 'Mi panel' : 'Panel'

  const roleLabel =
    role === 'ADMIN' ? 'Administrador' :
    role === 'LANDLORD' ? 'Arrendador' :
    role === 'TENANT' ? 'Inquilino' : ''

  // CTA button for logged-in users
  const tenantCTA = isLoggedIn && role === 'TENANT'
  const showManageButton = tenantCTA && hasActiveContract
  const showSearchButton = tenantCTA && !hasActiveContract

  const menuLink = "flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#151c26] no-underline hover:bg-gray-50 transition-colors"

  return (
    <>
      {/* Main header */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-14 md:h-[72px] px-5 md:px-10 max-w-[1400px] mx-auto">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 no-underline">
            <Home01Icon size={22} className="text-accent md:hidden" />
            <Home01Icon size={28} className="text-accent hidden md:block" />
            <span className="text-lg md:text-2xl font-extrabold text-[#151c26] tracking-tight">
              Habita Perú
            </span>
          </Link>

          {/* ── Desktop right nav ── */}
          <div className="hidden md:flex items-center gap-4">

            {/* CTA depending on auth state */}
            {!isLoggedIn && status !== 'loading' && (
              <Link
                href="/publicar"
                className="text-[0.9rem] font-medium text-[#151c26] no-underline hover:text-accent transition-colors"
              >
                {t('publishProperty')}
              </Link>
            )}

            {isLoggedIn && role === 'LANDLORD' && (
              <Link
                href="/landlord/properties"
                className="text-sm font-semibold text-[#151c26] no-underline hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <Building03Icon size={16} className="text-accent" />
                Mis propiedades
              </Link>
            )}

            {showManageButton && (
              <Link
                href="/tenant/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold !text-white no-underline hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
              >
                <Home01Icon size={16} />
                Gestiona tu habitación
              </Link>
            )}

            {showSearchButton && (
              <Link
                href="/propiedades"
                className="flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-xl text-sm font-semibold text-accent no-underline hover:bg-accent/5 transition-colors"
              >
                Buscar habitación
              </Link>
            )}

            <LanguageSwitcher onLanguageChange={(code) => console.log('Idioma:', code)} />

            {/* User menu button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 rounded-full border-[1.5px] cursor-pointer transition-all hover:border-accent hover:shadow-[0_2px_8px_rgba(15,52,87,0.15)] ${
                  isLoggedIn ? 'pl-1 pr-3 py-1 border-gray-300' : 'size-10 justify-center border-gray-300'
                }`}
                aria-label="Menú de usuario"
              >
                {isLoggedIn ? (
                  <>
                    <div
                      className="size-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-semibold text-[#151c26] max-w-[100px] truncate">
                      {userName.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <UserCircleIcon size={24} className="text-gray-500" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] min-w-[220px] py-2 z-[200]">
                  {isLoggedIn ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-[#151c26]">{userName}</p>
                        <p className="text-xs text-gray-400">{roleLabel}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={dashboardHref}
                          className={menuLink}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Home01Icon size={16} className="text-accent" />
                          {dashboardLabel}
                        </Link>
                        {showManageButton && (
                          <Link
                            href="/tenant/dashboard"
                            className={menuLink}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Home01Icon size={16} className="text-accent" />
                            Gestiona tu habitación
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <a
                          href="/api/auth/signout"
                          className={`${menuLink} text-red-500 hover:bg-red-50`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Logout01Icon size={16} className="text-red-400" />
                          Cerrar sesión
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="py-1">
                        <Link
                          href={`/${locale}/register`}
                          className={`${menuLink} font-semibold`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t('register')}
                        </Link>
                        <Link
                          href={`/${locale}/login`}
                          className={menuLink}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t('login')}
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <Link href="/publicar" className={menuLink} onClick={() => setUserMenuOpen(false)}>
                          {t('publishProperty')}
                        </Link>
                        <Link href="#" className={menuLink} onClick={() => setUserMenuOpen(false)}>
                          {t('helpCenter')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile right ── */}
          <div className="flex md:hidden items-center gap-2">
            {status === 'loading' ? (
              <div className="size-8 rounded-full bg-gray-100 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {showManageButton && (
                  <Link
                    href="/tenant/dashboard"
                    className="text-xs font-bold text-accent no-underline border border-accent/30 px-3 py-1.5 rounded-lg whitespace-nowrap"
                  >
                    Mi habitación
                  </Link>
                )}
                <a href={dashboardHref} className="no-underline">
                  <div
                    className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                  >
                    {initials}
                  </div>
                </a>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-xs font-semibold text-accent no-underline border border-accent/30 px-3 py-1.5 rounded-lg"
                >
                  Ingresar
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="size-8 rounded-full bg-gray-100 flex items-center justify-center no-underline"
                >
                  <UserCircleIcon size={18} className="text-gray-500" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Announcement bar — desktop only */}
      <div
        className="hidden md:block fixed inset-x-0 z-[99] py-2.5 overflow-hidden pointer-events-auto transition-[transform,opacity] duration-300"
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
