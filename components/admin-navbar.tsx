"use client"

import { useState } from "react"
import { Search01Icon, Menu01Icon, Cancel01Icon } from "hugeicons-react"
import ThemeSwitcher from "./theme-switcher"
import { NotificationBell } from "./notification-bell"

interface AdminNavbarProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
}

export default function AdminNavbar({ user, onToggleSidebar, isSidebarCollapsed }: AdminNavbarProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <nav
      className="fixed top-0 right-0 h-[70px] bg-admin-card-bg border-b border-admin-border flex items-center justify-between px-8 z-50 transition-[left] duration-300 ease-in-out"
      style={{ left: isSidebarCollapsed ? '80px' : '280px' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-5">
        <button
          onClick={onToggleSidebar}
          className="size-10 rounded-lg border border-admin-border bg-transparent flex items-center justify-center cursor-pointer transition-all text-admin-text hover:bg-[var(--admin-hover-bg)] hover:border-admin-accent"
        >
          {isSidebarCollapsed ? <Menu01Icon size={20} /> : <Cancel01Icon size={20} />}
        </button>

        <div className="relative w-[400px]">
          <Search01Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar usuarios, propiedades..."
            className="w-full h-10 pl-10 pr-3 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-card-bg outline-none transition-all focus:border-admin-accent focus:shadow-[0_0_0_3px_rgba(15,52,87,0.1)]"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        {/* Notifications */}
        <NotificationBell theme="admin" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-lg border border-admin-border cursor-pointer transition-all hover:bg-[var(--admin-hover-bg)] ${showProfile ? 'bg-[var(--admin-hover-bg)]' : 'bg-transparent'}`}
          >
            <div
              className="size-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ background: 'linear-gradient(135deg, #EA4227, #d63820)' }}
            >
              {user.name?.[0] || 'A'}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-admin-text leading-none">{user.name}</p>
              <p className="text-[0.7rem] text-admin-text-muted leading-snug mt-0.5">Admin</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute top-[50px] right-0 w-[220px] bg-admin-card-bg border border-admin-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden z-[200]">
              <div className="p-4 border-b border-admin-border">
                <p className="text-sm font-semibold text-admin-text mb-1">{user.name}</p>
                <p className="text-xs text-admin-text-muted">{user.email}</p>
              </div>
              <div className="p-2">
                <button className="w-full px-3 py-2.5 text-left bg-transparent border-none rounded-md text-sm text-admin-text cursor-pointer transition-colors hover:bg-[var(--admin-hover-bg)]">
                  Mi Perfil
                </button>
                <button className="w-full px-3 py-2.5 text-left bg-transparent border-none rounded-md text-sm text-admin-text cursor-pointer transition-colors hover:bg-[var(--admin-hover-bg)]">
                  Configuración
                </button>
              </div>
              <div className="p-2 border-t border-admin-border">
                <button
                  onClick={() => window.location.href = '/api/auth/signout'}
                  className="w-full px-3 py-2.5 text-left bg-transparent border-none rounded-md text-sm text-red-600 cursor-pointer transition-colors hover:bg-red-600/10"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
