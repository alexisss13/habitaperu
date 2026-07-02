"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Home01Icon, Building03Icon, UserMultiple02Icon, FileValidationIcon,
  Wallet01Icon, Settings02Icon, HelpCircleIcon, Logout01Icon, Menu01Icon,
  FavouriteIcon, SecurityCheckIcon, IdentityCardIcon,
} from "hugeicons-react"
import { NotificationBell } from "./notification-bell"

type Role = "landlord" | "tenant"

interface NavItem {
  name: string
  short: string
  href: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface AccountItem {
  name: string | ((session: RoleTopNavProps["session"]) => string)
  href: string | ((session: RoleTopNavProps["session"]) => string)
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface RoleConfig {
  roleLabel: string
  homeHref: string
  navItems: NavItem[]
  accountItems: AccountItem[]
  exitLabel: string
  exitHref: (session: RoleTopNavProps["session"]) => string
}

const NAV: Record<Role, RoleConfig> = {
  landlord: {
    roleLabel: "Arrendador",
    homeHref: "/landlord/dashboard",
    navItems: [
      { name: "Dashboard",   short: "Panel",      href: "/landlord/dashboard",  Icon: Home01Icon },
      { name: "Propiedades", short: "Props.",     href: "/landlord/properties", Icon: Building03Icon },
      { name: "Inquilinos",  short: "Inquilinos", href: "/landlord/tenants",    Icon: UserMultiple02Icon },
      { name: "Contratos",   short: "Contratos",  href: "/landlord/contracts",  Icon: FileValidationIcon },
      { name: "Pagos",       short: "Pagos",      href: "/landlord/payments",   Icon: Wallet01Icon },
    ],
    accountItems: [
      { name: "Configuración", href: "/landlord/settings", Icon: Settings02Icon },
      { name: "Centro de ayuda", href: "#", Icon: HelpCircleIcon },
    ],
    exitLabel: "Cambiar a modo inquilino",
    exitHref: () => "/es",
  },
  tenant: {
    roleLabel: "Inquilino",
    homeHref: "/tenant/contract",
    navItems: [
      { name: "Mi Contrato", short: "Contrato", href: "/tenant/contract",  Icon: FileValidationIcon },
      { name: "Mis Pagos",   short: "Pagos",    href: "/tenant/payments",  Icon: Wallet01Icon },
      { name: "Favoritos",   short: "Favoritos",href: "/tenant/favorites", Icon: FavouriteIcon },
      { name: "Verificación",short: "KYC",      href: "/tenant/kyc",       Icon: SecurityCheckIcon },
      { name: "Mi Perfil",   short: "Perfil",   href: "/tenant/profile",   Icon: IdentityCardIcon },
    ],
    accountItems: [
      { name: "Configuración", href: "/tenant/settings", Icon: Settings02Icon },
      {
        name: (session) => session.user.isLandlord ? "Cambiar a modo arrendador" : "Publica tu propiedad",
        href: (session) => session.user.isLandlord ? "/landlord/dashboard" : "/es/publicar/onboarding",
        Icon: Building03Icon,
      },
      { name: "Centro de ayuda", href: "#", Icon: HelpCircleIcon },
    ],
    exitLabel: "Volver al inicio",
    exitHref: () => "/es",
  },
}

interface RoleTopNavProps {
  children: React.ReactNode
  session: { user: { name?: string | null; email?: string | null; role: string; isLandlord?: boolean } }
  role: Role
}

export default function RoleTopNav({ children, session, role }: RoleTopNavProps) {
  const cfg = NAV[role]
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const initials = (session.user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const menuLink = "flex items-center gap-2.5 px-4 py-2.5 text-sm text-admin-text no-underline hover:bg-admin-hover-bg transition-colors"

  return (
    <div className="min-h-screen bg-admin-bg">

      {/* ── Fixed top bar ── */}
      <nav className="fixed inset-x-0 top-0 h-14 md:h-[72px] bg-admin-card-bg border-b border-admin-border z-30">
        <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">

          {/* Left: logo + tabs */}
          <div className="flex items-center gap-6 min-w-0">
            <Link href={cfg.homeHref} className="no-underline shrink-0">
              <Image
                src="/habita-logo-horizontal.svg"
                alt="Habita Perú"
                width={180}
                height={48}
                className="h-9 w-auto md:h-12"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              {cfg.navItems.map(({ name, href, Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold no-underline transition-colors ${
                      active ? "!text-accent" : "!text-gray-500 hover:!text-gray-700"
                    }`}
                  >
                    <Icon size={16} className={active ? "!text-accent" : "!text-gray-500"} />
                    {name}
                    <div className={`absolute left-3.5 right-3.5 -bottom-2 h-0.5 rounded-full ${active ? "bg-accent" : "bg-transparent"}`} />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right: switch mode + account */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link
              href={cfg.exitHref(session)}
              className="hidden sm:inline text-sm font-semibold !text-gray-500 no-underline hover:text-accent transition-colors whitespace-nowrap"
            >
              {cfg.exitLabel}
            </Link>

            <NotificationBell theme={role} />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full border-[1.5px] border-admin-border cursor-pointer transition-all hover:border-admin-accent"
                aria-label="Menú de cuenta"
              >
                <Menu01Icon size={16} className="text-admin-text-muted" />
                <div
                  className="size-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
                >
                  {initials}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-admin-card-bg border border-admin-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] min-w-[220px] py-2 z-[200]">
                  <div className="px-4 py-3 border-b border-admin-border">
                    <p className="text-sm font-bold text-admin-text truncate">{session.user.name ?? "Usuario"}</p>
                    <p className="text-xs text-admin-text-muted">{cfg.roleLabel}</p>
                  </div>
                  <div className="py-1">
                    {cfg.accountItems.map(({ name, href, Icon }, i) => {
                      const resolvedHref = typeof href === "function" ? href(session) : href
                      const resolvedName = typeof name === "function" ? name(session) : name
                      return (
                        <Link key={i} href={resolvedHref} className={menuLink} onClick={() => setMenuOpen(false)}>
                          <Icon size={16} className="text-admin-text-muted" />
                          {resolvedName}
                        </Link>
                      )
                    })}
                  </div>
                  <div className="border-t border-admin-border py-1">
                    <button
                      onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/login" }) }}
                      className={`${menuLink} text-red-500 hover:bg-red-500/10 w-full text-left`}
                    >
                      <Logout01Icon size={16} className="text-red-400" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="min-h-screen pt-16 pb-20 md:pb-8">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-admin-card-bg border-t border-admin-border z-50">
        <div className="grid grid-cols-5 h-16">
          {cfg.navItems.map(({ short, href, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors ${
                  active ? "text-accent" : "text-gray-500"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-semibold">{short}</span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
