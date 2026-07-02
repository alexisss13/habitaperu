"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, Fragment } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTranslations, useLocale } from "@/lib/i18n-context"
import {
  UserCircleIcon, SecurityCheckIcon,
  FileValidationIcon, CustomerSupportIcon, Logout01Icon,
  Building03Icon, Home01Icon
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
    const handleScroll = () => setShowAnnouncement(window.scrollY <= 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLoggedIn = status === 'authenticated'
  const user = session?.user as { role?: string; isLandlord?: boolean; hasActiveContract?: boolean; name?: string | null } | undefined
  const role = user?.role
  const isLandlord = role === 'LANDLORD' || !!user?.isLandlord
  // Cuenta dual: su rol principal no es LANDLORD pero ya ganó la capacidad
  // publicando (p. ej. inquilino en Trujillo que también arrienda en Chimbote).
  const showLandlordSwitch = isLoggedIn && isLandlord && role !== 'LANDLORD'
  const hasActiveContract = user?.hasActiveContract
  const userName = user?.name ?? ''
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  // Dashboard link per role
  const dashboardHref =
    role === 'ADMIN'    ? '/admin/dashboard' :
    role === 'LANDLORD' ? '/landlord/dashboard' :
    role === 'TENANT'   ? '/tenant/dashboard' : `/${locale}`

  const dashboardLabel =
    role === 'ADMIN'    ? t('dashboardAdmin') :
    role === 'LANDLORD' ? t('dashboardLandlord') :
    role === 'TENANT'   ? t('dashboardTenant') : t('dashboardDefault')

  const roleLabel =
    role === 'ADMIN' ? t('roleAdmin') :
    role === 'LANDLORD' ? t('roleLandlord') :
    role === 'TENANT' ? t('roleTenant') : ''

  // CTA button for logged-in users
  const tenantCTA = isLoggedIn && role === 'TENANT'
  const showManageButton = tenantCTA && hasActiveContract
  const showSearchButton = tenantCTA && !hasActiveContract

  const menuLink = "flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#151c26] no-underline hover:bg-gray-50 transition-colors"

  return (
    <>
      {/* Main header */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-14 md:h-[72px] px-6 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center no-underline">
            <Image
              src="/habita-logo-horizontal.svg"
              alt="Habita Perú"
              width={180}
              height={48}
              className="h-9 w-auto md:h-12"
              priority
            />
          </Link>

          {/* ── Desktop right nav ── */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Navegación principal">

            {/* Siempre visible: mismo navbar para todos, con o sin sesión */}
            <Link
              href={`/${locale}/publicar/onboarding`}
              className="text-[0.9rem] font-medium text-[#151c26] no-underline hover:text-accent transition-colors"
            >
              {t('publishProperty')}
            </Link>

            {!isLoggedIn && status !== 'loading' && (
              <Link
                href={`/${locale}/login`}
                className="text-[0.9rem] font-semibold text-accent no-underline hover:opacity-80 transition-opacity"
              >
                {t('login')}
              </Link>
            )}

            {isLoggedIn && isLandlord && (
              <Link
                href="/landlord/properties"
                className="text-sm font-semibold text-[#151c26] no-underline hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <Building03Icon size={16} className="text-accent" />
                {t('myProperties')}
              </Link>
            )}

            {showManageButton && (
              <Link
                href="/tenant/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold !text-white no-underline hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
              >
                <Home01Icon size={16} />
                {t('manageRoom')}
              </Link>
            )}

            {showSearchButton && (
              <Link
                href={`/${locale}/propiedades`}
                className="flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-xl text-sm font-semibold text-accent no-underline hover:bg-accent/5 transition-colors"
              >
                {t('searchRoom')}
              </Link>
            )}

            <LanguageSwitcher />

            {/* User menu button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 rounded-full border-[1.5px] cursor-pointer transition-all hover:border-accent hover:shadow-[0_2px_8px_rgba(15,52,87,0.15)] ${
                  isLoggedIn ? 'pl-1 pr-3 py-1 border-gray-300' : 'size-10 justify-center border-gray-300'
                }`}
                aria-label={locale === 'en' ? 'User menu' : 'Menú de usuario'}
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
                            {t('manageRoom')}
                          </Link>
                        )}
                        {showLandlordSwitch && (
                          <Link
                            href="/landlord/dashboard"
                            className={menuLink}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Building03Icon size={16} className="text-accent" />
                            {t('landlordDashboard')}
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: `/${locale}/login` }) }}
                          className={`${menuLink} text-red-500 hover:bg-red-50 w-full text-left`}
                        >
                          <Logout01Icon size={16} className="text-red-400" />
                          {t('logout')}
                        </button>
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
                        <Link href={`/${locale}/publicar/onboarding`} className={menuLink} onClick={() => setUserMenuOpen(false)}>
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
          </nav>

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
                    {t('myRoom')}
                  </Link>
                )}
                {showLandlordSwitch && (
                  <Link
                    href="/landlord/dashboard"
                    className="text-xs font-bold text-accent no-underline border border-accent/30 px-3 py-1.5 rounded-lg whitespace-nowrap"
                  >
                    {t('landlordDashboard')}
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
                  {t('login')}
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
        className="hidden md:block fixed inset-x-0 z-[99] py-2.5 overflow-hidden pointer-events-auto transition-[transform,opacity] duration-300 animate-gradient-shift"
        style={{
          top: '72px',
          background: 'linear-gradient(90deg, #0f3457 0%, #8f8272 50%, #0f3457 100%)',
          backgroundSize: '200% 100%',
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
      </div>
    </>
  )
}
