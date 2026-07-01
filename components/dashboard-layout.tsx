"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Search01Icon, Menu01Icon, Cancel01Icon, Logout01Icon,
  Home01Icon, FileValidationIcon, Wallet01Icon,
  FavouriteIcon, UserCircleIcon, SecurityCheckIcon,
  Settings02Icon, Building03Icon, UserMultiple02Icon,
  Add01Icon, MoneyBag02Icon, DatabaseIcon, DashboardSquare02Icon
} from "hugeicons-react"
import { NotificationBell } from "./notification-bell"
import ThemeSwitcher from "./theme-switcher"

type Role = "tenant" | "landlord" | "admin"

interface NavItem {
  name: string
  short: string
  href: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

const NAV: Record<Role, { nav: NavItem[]; title: string }> = {
  tenant: {
    title: "Panel Inquilino",
    nav: [
      { name: "Mi Panel",       short: "Panel",    href: "/tenant/dashboard", Icon: Home01Icon },
      { name: "Mi Contrato",    short: "Contrato", href: "/tenant/contract",  Icon: FileValidationIcon },
      { name: "Mis Pagos",      short: "Pagos",    href: "/tenant/payments",  Icon: Wallet01Icon },
      { name: "Favoritos",      short: "Favoritos",href: "/tenant/favorites", Icon: FavouriteIcon },
      { name: "Mi Perfil",      short: "Perfil",   href: "/tenant/profile",   Icon: UserCircleIcon },
      { name: "Verificación",   short: "KYC",      href: "/tenant/kyc",       Icon: SecurityCheckIcon },
      { name: "Configuración",  short: "Config",   href: "/tenant/settings",  Icon: Settings02Icon },
    ],
  },
  landlord: {
    title: "Panel Arrendador",
    nav: [
      { name: "Dashboard", short: "Panel", href: "/landlord/dashboard", Icon: Home01Icon },
      { name: "Propiedades", short: "Props.", href: "/landlord/properties", Icon: Building03Icon },
      { name: "Inquilinos", short: "Inquilinos", href: "/landlord/tenants", Icon: UserMultiple02Icon },
      { name: "Contratos", short: "Contratos", href: "/landlord/contracts", Icon: FileValidationIcon },
      { name: "Pagos", short: "Pagos", href: "/landlord/payments", Icon: Wallet01Icon },
      { name: "Configuración", short: "Config", href: "/landlord/settings", Icon: Settings02Icon },
    ],
  },
  admin: {
    title: "Panel de Administración",
    nav: [
      { name: "Dashboard",      short: "Panel",     href: "/admin/dashboard", Icon: DashboardSquare02Icon },
      { name: "Usuarios",       short: "Usuarios",  href: "/admin/users",     Icon: UserMultiple02Icon },
      { name: "Verificaciones", short: "KYC",       href: "/admin/kyc",       Icon: SecurityCheckIcon },
      { name: "Propiedades",    short: "Props.",    href: "/admin/properties",Icon: Building03Icon },
      { name: "Contratos",      short: "Contratos", href: "/admin/contracts", Icon: FileValidationIcon },
      { name: "Pagos",          short: "Pagos",     href: "/admin/payments",  Icon: MoneyBag02Icon },
      { name: "Auditoría",      short: "Auditoría", href: "/admin/audit",     Icon: DatabaseIcon },
      { name: "Configuración",  short: "Config",    href: "/admin/settings",  Icon: Settings02Icon },
    ],
  },
}

interface DashboardLayoutProps {
  children: React.ReactNode
  session: { user: { name?: string | null; email?: string | null; role: string } }
  role: Role
  headerActions?: React.ReactNode
  showSearch?: boolean
  showThemeSwitch?: boolean
}

export default function DashboardLayout({
  children, session, role,
  headerActions, showSearch = false, showThemeSwitch = false
}: DashboardLayoutProps) {
  const cfg = NAV[role]
  const navItems = cfg.nav
  const roleTitle = cfg.title
  const mobileNavItems = navItems.slice(0, 5)
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const initials = (session.user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const sidebarWidth = isSidebarCollapsed ? "80px" : "280px"
  const offset = isDesktop ? sidebarWidth : "0px"

  const bottomNav = mobileNavItems ?? navItems.slice(0, 5)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setShowSearchDropdown(false)
    router.push(`/admin/users?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchDropdown(false), 200)
  }

  return (
    <div className="min-h-screen bg-admin-bg">

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:fixed md:inset-y-0 md:flex md:flex-col z-40 transition-[width] duration-300 ease-in-out bg-admin-sidebar-bg border-r border-admin-border overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col flex-grow min-h-0">
          {/* Brand */}
          <div className={`flex items-center h-16 border-b border-admin-border shrink-0 ${isSidebarCollapsed ? "justify-center px-2" : "px-6"}`}>
            <Link href={navItems[0]?.href ?? "/"} className="no-underline">
              {isSidebarCollapsed ? (
                <Image src="/habita-icon-navy.svg" alt="Habita" width={28} height={28} className="size-7" />
              ) : (
                <Image
                  src="/habita-logo-horizontal.svg"
                  alt="Habita Perú"
                  width={180}
                  height={48}
                  className="h-11 w-auto"
                  priority
                />
              )}
            </Link>
          </div>

          {/* Label */}
          {!isSidebarCollapsed && (
            <div className="px-6 py-3">
              <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
                {roleTitle}
              </span>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 pb-3 overflow-y-auto">
            {navItems.map(({ name, href, Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  title={isSidebarCollapsed ? name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline mb-0.5 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-admin-accent-bg text-admin-accent"
                      : "text-admin-text-dim hover:bg-admin-hover-bg hover:text-admin-text"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-admin-accent" : "text-admin-text-muted"}
                  />
                  {!isSidebarCollapsed && name}
                </Link>
              )
            })}
          </nav>

          {/* User + logout */}
          <div className="shrink-0 border-t border-admin-border p-4">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
              >
                {initials}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-admin-text truncate">
                    {session.user.name ?? "Usuario"}
                  </p>
                  <p className="text-[11px] text-admin-text-muted truncate">
                    {session.user.email}
                  </p>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="size-8 rounded-lg flex items-center justify-center text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <Logout01Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Fixed Header ── */}
      <nav
        className="fixed top-0 right-0 h-14 bg-admin-card-bg border-b border-admin-border flex items-center justify-between px-4 md:px-6 z-30 transition-[left] duration-300 ease-in-out"
        style={{ left: offset }}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex size-9 rounded-lg border border-admin-border items-center justify-center cursor-pointer transition-all text-admin-text-dim hover:bg-admin-hover-bg hover:border-admin-accent shrink-0"
            aria-label={isSidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {isSidebarCollapsed ? <Menu01Icon size={18} /> : <Cancel01Icon size={18} />}
          </button>

          <Link href={navItems[0]?.href ?? "/"} className="no-underline md:hidden">
            <Image src="/habita-logo-horizontal.svg" alt="Habita Perú" width={140} height={35} className="h-8 w-auto" />
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <form onSubmit={handleSearch} className="relative hidden lg:block w-[320px]">
              <Search01Icon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted pointer-events-none"
              />
              <input
                type="text"
                placeholder="Buscar usuarios, propiedades..."
                aria-label="Buscar"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true) }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={handleSearchBlur}
                className="w-full h-9 pl-9 pr-3 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-card-bg outline-none transition-all focus:border-admin-accent focus:shadow-[0_0_0_3px_rgba(15,52,87,0.1)]"
              />
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute top-10 left-0 w-full bg-admin-card-bg border border-admin-border rounded-lg shadow-lg overflow-hidden z-[200]">
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-left text-sm text-admin-text hover:bg-admin-hover-bg cursor-pointer border-0 bg-transparent flex items-center gap-2"
                  >
                    <Search01Icon size={14} className="text-admin-text-muted" />
                    <span>Buscar "<strong>{searchQuery}</strong>" en usuarios</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowSearchDropdown(false); router.push(`/admin/properties?search=${encodeURIComponent(searchQuery.trim())}`) }}
                    className="w-full px-4 py-2.5 text-left text-sm text-admin-text hover:bg-admin-hover-bg cursor-pointer border-0 bg-transparent flex items-center gap-2"
                  >
                    <Search01Icon size={14} className="text-admin-text-muted" />
                    <span>Buscar "<strong>{searchQuery}</strong>" en propiedades</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {headerActions}

          {showThemeSwitch && <ThemeSwitcher />}

          <NotificationBell theme="admin" />
        </div>
      </nav>

      {/* ── Main content ── */}
      <main
        className="min-h-screen pt-14 pb-20 md:pb-8 transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: offset }}
      >
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-admin-card-bg border-t border-admin-border z-50">
        <div className="grid grid-cols-5 h-16">
          {bottomNav.map(({ short, href, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors ${
                  active ? "text-admin-accent" : "text-admin-text-muted"
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
