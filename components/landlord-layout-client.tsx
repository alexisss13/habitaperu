"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Add01Icon,
  Building03Icon,
  FileValidationIcon,
  Home01Icon,
  Logout01Icon,
  Settings02Icon,
  UserMultiple02Icon,
  Wallet01Icon,
} from "hugeicons-react"
import { NotificationBell } from "./notification-bell"

interface LandlordLayoutClientProps {
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
  { name: "Dashboard", short: "Panel", href: "/landlord/dashboard", Icon: Home01Icon },
  { name: "Propiedades", short: "Props.", href: "/landlord/properties", Icon: Building03Icon },
  { name: "Inquilinos", short: "Inquilinos", href: "/landlord/tenants", Icon: UserMultiple02Icon },
  { name: "Contratos", short: "Contratos", href: "/landlord/contracts", Icon: FileValidationIcon },
  { name: "Pagos", short: "Pagos", href: "/landlord/payments", Icon: Wallet01Icon },
  { name: "Configuración", short: "Config", href: "/landlord/settings", Icon: Settings02Icon },
]

const BOTTOM_NAV = NAV.slice(0, 5)

function getSectionTitle(pathname: string) {
  const active = NAV.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
  return active?.name ?? "Panel Arrendador"
}

export function LandlordLayoutClient({ children, session }: LandlordLayoutClientProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  const initials = (session.user.name ?? "A")
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const sectionTitle = getSectionTitle(pathname)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 overflow-y-auto">

          <div className="flex items-center px-6 h-16 border-b border-slate-100 shrink-0">
            <Link href="/landlord/dashboard" className="no-underline">
              <Image
                src="/habita-logo-horizontal.svg"
                alt="Habita Perú"
                width={180}
                height={48}
                className="h-11 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="px-6 py-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Panel Arrendador
            </span>
          </div>

          <nav className="flex-1 px-3 pb-3">
            {NAV.map(({ name, href, Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline mb-0.5 ${
                    active
                      ? "bg-accent/10 text-accent"
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
                  {session.user.name ?? "Arrendador"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="size-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <Logout01Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="md:pl-64 flex flex-col min-h-screen">

        {/* Sticky top header */}
        <header className="sticky top-0 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
          <Link href="/landlord/dashboard" className="no-underline md:hidden">
            <Image
              src="/habita-logo-horizontal.svg"
              alt="Habita Perú"
              width={160}
              height={40}
              className="h-9 w-auto"
            />
          </Link>

          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {sectionTitle}
            </span>
            <span className="text-sm font-bold text-[#151c26] leading-tight">
              Panel Arrendador
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/landlord/properties/new"
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold !text-white no-underline shadow-sm hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)" }}
            >
              <Add01Icon size={15} />
              Publicar
            </Link>
            <NotificationBell theme="landlord" />
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
