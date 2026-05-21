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
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: isCollapsed ? '80px' : '280px',
      background: 'var(--admin-sidebar-bg)',
      borderRight: '1px solid var(--admin-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        padding: isCollapsed ? '24px 16px' : '24px',
        borderBottom: '1px solid var(--admin-border)',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <Home01Icon size={28} style={{ color: 'var(--admin-accent)' }} />
          {!isCollapsed && (
            <div>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--admin-text)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                display: 'block'
              }}>
                Habita <span style={{ color: 'var(--admin-accent)' }}>Perú</span>
              </span>
              <p style={{
                fontSize: '0.7rem',
                color: 'var(--admin-text-muted)',
                fontWeight: '500',
                marginTop: '2px'
              }}>
                Panel de Administración
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: isCollapsed ? '12px' : '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
                background: isActive ? 'var(--admin-accent-bg)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.875rem',
                marginBottom: '4px',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--admin-hover-bg)'
                  e.currentTarget.style.color = 'var(--admin-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--admin-text-muted)'
                }
              }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--admin-border)'
      }}>
        <button
          onClick={() => {
            window.location.href = '/api/auth/signout'
          }}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: isCollapsed ? '12px' : '12px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#dc2626',
            background: 'transparent',
            fontWeight: '500',
            fontSize: '0.875rem',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogoutCircle02Icon size={20} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}
