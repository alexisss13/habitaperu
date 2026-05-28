"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home01Icon, Menu01Icon, Cancel01Icon, UserCircleIcon, Logout01Icon } from "hugeicons-react"
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

export function TenantLayoutClient({ children, session }: TenantLayoutClientProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Mi Panel", href: "/tenant/dashboard" },
    { name: "Mi Contrato", href: "/tenant/contract" },
    { name: "Mis Pagos", href: "/tenant/payments" },
    { name: "Favoritos", href: "/tenant/favorites" },
    { name: "Mi Perfil", href: "/tenant/profile" },
    { name: "Verificación KYC", href: "/tenant/kyc" },
    { name: "Configuración", href: "/tenant/settings" },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    window.location.href = "/api/auth/signout"
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Unified Tenant Navbar */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
              <Home01Icon size={26} className="text-accent" />
              <span className="text-xl font-bold text-[#151c26] tracking-tight">Habita Perú</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold no-underline transition-all ${
                    isActive(item.href)
                      ? "bg-slate-100 text-[#151c26]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#151c26]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Notification Bell & User Controls */}
          <div className="flex items-center gap-3">
            <NotificationBell theme="tenant" />

            {/* Desktop User Info & Logout */}
            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="text-right">
                <p className="text-xs font-bold text-[#151c26] leading-none">
                  {session.user.name || "Inquilino"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Inquilino</p>
              </div>
              <button
                onClick={handleLogout}
                className="size-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all bg-transparent border-none cursor-pointer"
                title="Cerrar Sesión"
              >
                <Logout01Icon size={20} />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden size-10 rounded-full flex items-center justify-center bg-transparent border-none text-[#151c26] cursor-pointer hover:bg-slate-50"
            >
              {mobileMenuOpen ? <Cancel01Icon size={22} /> : <Menu01Icon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-6 z-45 flex flex-col gap-3">
            <div className="border-b border-slate-150 pb-3 mb-2 flex items-center gap-3">
              <UserCircleIcon size={36} className="text-slate-400" />
              <div>
                <p className="text-sm font-bold text-[#151c26]">{session.user.name || "Inquilino"}</p>
                <p className="text-xs text-slate-500">{session.user.email}</p>
              </div>
            </div>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-bold no-underline transition-all block ${
                  isActive(item.href)
                    ? "bg-slate-100 text-[#151c26]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#151c26]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full mt-2 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Logout01Icon size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  )
}
