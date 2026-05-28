"use client"

import { useState } from "react"
import { Search01Icon, Notification02Icon, Menu01Icon, Cancel01Icon } from "hugeicons-react"
import ThemeSwitcher from "./theme-switcher"

interface AdminNavbarProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
}

export default function AdminNavbar({ user, onToggleSidebar, isSidebarCollapsed }: AdminNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, title: "Nuevo usuario registrado", time: "Hace 5 min", unread: true },
    { id: 2, title: "Propiedad publicada", time: "Hace 1 hora", unread: true },
    { id: 3, title: "Pago recibido", time: "Hace 2 horas", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

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
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
            className={`relative size-10 rounded-lg border border-admin-border flex items-center justify-center cursor-pointer transition-all text-admin-text hover:bg-[var(--admin-hover-bg)] ${showNotifications ? 'bg-[var(--admin-hover-bg)]' : 'bg-transparent'}`}
          >
            <Notification02Icon size={20} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 size-[18px] rounded-full bg-accent-secondary text-white text-[0.65rem] font-semibold flex items-center justify-center border-2 border-admin-card-bg">
                {unreadCount}
              </div>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-[50px] right-0 w-80 bg-admin-card-bg border border-admin-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden z-[200]">
              <div className="p-4 border-b border-admin-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-admin-text">Notificaciones</h3>
                <span className="text-xs text-admin-accent cursor-pointer">Marcar todas como leídas</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-admin-border cursor-pointer transition-colors hover:bg-[var(--admin-hover-bg)] ${notif.unread ? 'bg-[rgba(15,52,87,0.03)]' : 'bg-transparent'}`}
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <div className="size-2 rounded-full bg-accent-secondary mt-1 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-admin-text mb-1">{notif.title}</p>
                        <p className="text-xs text-admin-text-muted">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-admin-border">
                <span className="text-xs text-admin-accent cursor-pointer font-semibold">
                  Ver todas las notificaciones
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
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
