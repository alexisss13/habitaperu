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

  // Notificaciones de ejemplo (en producción vendrían de la BD)
  const notifications = [
    { id: 1, title: "Nuevo usuario registrado", time: "Hace 5 min", unread: true },
    { id: 2, title: "Propiedad publicada", time: "Hace 1 hora", unread: true },
    { id: 3, title: "Pago recibido", time: "Hace 2 horas", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: isSidebarCollapsed ? '80px' : '280px',
      right: 0,
      height: '70px',
      background: 'var(--admin-card-bg)',
      borderBottom: '1px solid var(--admin-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 50,
      transition: 'left 0.3s ease'
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid var(--admin-border)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: 'var(--admin-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--admin-hover-bg)'
            e.currentTarget.style.borderColor = 'var(--admin-accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--admin-border)'
          }}
        >
          {isSidebarCollapsed ? <Menu01Icon size={20} /> : <Cancel01Icon size={20} />}
        </button>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          width: '400px'
        }}>
          <Search01Icon 
            size={18} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Buscar usuarios, propiedades..."
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '40px',
              paddingRight: '12px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: 'var(--admin-text)',
              background: 'var(--admin-card-bg)',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-accent)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,52,87,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--admin-border)',
              background: showNotifications ? 'var(--admin-hover-bg)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--admin-text)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!showNotifications) {
                e.currentTarget.style.background = 'var(--admin-hover-bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showNotifications) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <Notification02Icon size={20} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#EA4227',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--admin-card-bg)'
              }}>
                {unreadCount}
              </div>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              background: 'var(--admin-card-bg)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)' }}>
                  Notificaciones
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', cursor: 'pointer' }}>
                  Marcar todas como leídas
                </span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--admin-border)',
                      cursor: 'pointer',
                      background: notif.unread ? 'rgba(15,52,87,0.03)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--admin-hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notif.unread ? 'rgba(15,52,87,0.03)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {notif.unread && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#EA4227',
                          marginTop: '4px',
                          flexShrink: 0
                        }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text)', marginBottom: '4px' }}>
                          {notif.title}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '12px 16px',
                textAlign: 'center',
                borderTop: '1px solid var(--admin-border)'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', cursor: 'pointer', fontWeight: '600' }}>
                  Ver todas las notificaciones
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px 6px 6px',
              borderRadius: '8px',
              border: '1px solid var(--admin-border)',
              background: showProfile ? 'var(--admin-hover-bg)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!showProfile) {
                e.currentTarget.style.background = 'var(--admin-hover-bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showProfile) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EA4227, #d63820)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}>
              {user.name?.[0] || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)', lineHeight: 1 }}>
                {user.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', lineHeight: 1.2, marginTop: '2px' }}>
                Admin
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '220px',
              background: 'var(--admin-card-bg)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '4px' }}>
                  {user.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  {user.email}
                </p>
              </div>
              <div style={{ padding: '8px' }}>
                <button style={{
                  width: '100%',
                  padding: '10px 12px',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--admin-text)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Mi Perfil
                </button>
                <button style={{
                  width: '100%',
                  padding: '10px 12px',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--admin-text)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Configuración
                </button>
              </div>
              <div style={{ padding: '8px', borderTop: '1px solid var(--admin-border)' }}>
                <button 
                  onClick={() => window.location.href = '/api/auth/signout'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
