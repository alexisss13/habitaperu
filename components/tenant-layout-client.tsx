"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home01Icon, FileValidationIcon, Wallet01Icon,
  FavouriteIcon, UserCircleIcon, SecurityCheckIcon,
  Settings02Icon, Logout01Icon
} from "hugeicons-react"
import { NotificationBell } from "./notification-bell"

interface TenantLayoutClientProps {
  children: React.ReactNode
  session: {
    user: {
      name?: string | null
      email?: string | null
      role: string
    }
  }
}

const NAV = [
  { name: "Mi Panel",       short: "Panel",    href: "/tenant/dashboard", Icon: Home01Icon },
  { name: "Mi Contrato",    short: "Contrato", href: "/tenant/contract",  Icon: FileValidationIcon },
  { name: "Mis Pagos",      short: "Pagos",    href: "/tenant/payments",  Icon: Wallet01Icon },
  { name: "Favoritos",      short: "Favoritos",href: "/tenant/favorites", Icon: FavouriteIcon },
  { name: "Mi Perfil",      short: "Perfil",   href: "/tenant/profile",   Icon: UserCircleIcon },
  { name: "Verificación",   short: "KYC",      href: "/tenant/kyc",       Icon: SecurityCheckIcon },
  { name: "Configuración",  short: "Config",   href: "/tenant/settings",  Icon: Settings02Icon },
]

// Bottom nav shows only the 5 core items
const BOTTOM_NAV = NAV.slice(0, 5)

export function TenantLayoutClient({ children, session }: TenantLayoutClientProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  const initials = (session.user.name ?? "I")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 overflow-y-auto">

          {/* Brand */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100 shrink-0">
            <Home01Icon size={26} className="text-accent" />
            <span className="text-xl font-bold text-[#151c26] tracking-tight">Habita Perú</span>
          </div>

          {/* Label */}
          <div className="px-6 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Panel Inquilino
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 pb-3">
            {NAV.map(({ name, href, Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline mb-0.5 ${
                    active
                      ? "bg-accent/8 text-accent"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#151c26]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-accent" : "text-slate-400"}
                  />
                  {name}
                </Link>
              )
            })}
          </nav>

          {/* User + logout */}
          <div className="shrink-0 border-t border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#151c26] truncate">
                  {session.user.name ?? "Inquilino"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <a
                href="/api/auth/signout"
                className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all no-underline"
                title="Cerrar sesión"
              >
                <Logout01Icon size={16} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="md:pl-64 flex flex-col min-h-screen">

        {/* Sticky top header */}
        <header className="sticky top-0 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
          {/* Mobile: brand */}
          <span className="text-base font-bold text-[#151c26] md:hidden">Habita Perú</span>
          {/* Desktop: page context (empty, sidebar has nav) */}
          <div className="hidden md:block" />

          <div className="flex items-center gap-2">
            <NotificationBell theme="tenant" />
            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="text-right">
                <p className="text-xs font-bold text-[#151c26] leading-none">
                  {session.user.name ?? "Inquilino"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Inquilino</p>
              </div>
              <a
                href="/api/auth/signout"
                className="text-xs font-bold text-red-500 hover:text-red-600 no-underline"
              >
                Salir
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {BOTTOM_NAV.map(({ short, href, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors ${
                  active ? "text-accent" : "text-slate-400"
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
