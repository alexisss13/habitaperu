"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home01Icon,
  UserMultiple02Icon,
  Building03Icon,
  FileValidationIcon,
  MoneyBag02Icon,
  Settings02Icon,
  LogoutCircle02Icon,
  DashboardSquare02Icon
} from "hugeicons-react"

interface AdminSidebarProps {
  user: {
    name?: string | null
    email?: string | null
  }
  isCollapsed: boolean
}

export default function AdminSidebar({ user, isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin/dashboard", icon: DashboardSquare02Icon, label: "Dashboard" },
    { href: "/admin/users", icon: UserMultiple02Icon, label: "Usuarios" },
    { href: "/admin/properties", icon: Building03Icon, label: "Propiedades" },
    { href: "/admin/contracts", icon: FileValidationIcon, label: "Contratos" },
    { href: "/admin/payments", icon: MoneyBag02Icon, label: "Pagos" },
    { href: "/admin/settings", icon: Settings02Icon, label: "Configuración" },
  ]

  return (
    <aside
      className="fixed inset-y-0 left-0 bg-admin-sidebar-bg border-r border-admin-border flex flex-col z-[100] overflow-hidden transition-[width] duration-300 ease-in-out"
      style={{ width: isCollapsed ? '80px' : '280px' }}
    >
      {/* Logo */}
      <div className={`${isCollapsed ? 'px-4 py-6' : 'p-6'} border-b border-admin-border min-h-[80px] flex items-center justify-center`}>
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Home01Icon size={28} className="text-admin-accent shrink-0" />
          {!isCollapsed && (
            <div>
              <span className="text-xl font-extrabold text-admin-text tracking-tight whitespace-nowrap block">
                Habita <span className="text-admin-accent">Perú</span>
              </span>
              <p className="text-[0.7rem] text-admin-text-muted font-medium mt-0.5">
                Panel de Administración
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg no-underline mb-1 transition-all duration-200
                ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3'}
                ${isActive
                  ? 'bg-[var(--admin-accent-bg)] text-admin-accent font-semibold'
                  : 'text-admin-text-muted font-medium hover:bg-[var(--admin-hover-bg)] hover:text-admin-text'
                }`}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 px-3 border-t border-admin-border">
        <button
          onClick={() => { window.location.href = '/api/auth/signout' }}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
          className={`flex items-center gap-3 rounded-lg text-red-600 bg-transparent border-none cursor-pointer transition-all duration-200 w-full font-medium text-sm hover:bg-red-600/10
            ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3'}`}
        >
          <LogoutCircle02Icon size={20} className="shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}
