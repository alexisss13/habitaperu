import { Settings02Icon, UserIcon, SecurityIcon, Notification02Icon, PaintBoardIcon, DatabaseIcon, Mail01Icon } from "hugeicons-react"

export default function SettingsPage() {
  const settingsSections = [
    {
      id: 'general',
      title: 'General',
      icon: Settings02Icon,
      description: 'Configuración general de la plataforma',
      settings: [
        { label: 'Nombre de la plataforma', value: 'Habita Perú', type: 'text' },
        { label: 'Email de contacto', value: 'contacto@habitaperu.com', type: 'email' },
        { label: 'Teléfono de soporte', value: '+51 999 999 999', type: 'tel' },
        { label: 'Dirección', value: 'Lima, Perú', type: 'text' },
      ]
    },
    {
      id: 'users',
      title: 'Usuarios',
      icon: UserIcon,
      description: 'Configuración de usuarios y roles',
      settings: [
        { label: 'Registro público habilitado', value: true, type: 'toggle' },
        { label: 'Verificación de email requerida', value: true, type: 'toggle' },
        { label: 'Verificación KYC requerida', value: false, type: 'toggle' },
        { label: 'Máximo de propiedades por arrendador', value: '10', type: 'number' },
      ]
    },
    {
      id: 'security',
      title: 'Seguridad',
      icon: SecurityIcon,
      description: 'Configuración de seguridad y privacidad',
      settings: [
        { label: 'Autenticación de dos factores', value: false, type: 'toggle' },
        { label: 'Sesiones simultáneas permitidas', value: '3', type: 'number' },
        { label: 'Tiempo de expiración de sesión (minutos)', value: '60', type: 'number' },
        { label: 'Intentos de login fallidos antes de bloqueo', value: '5', type: 'number' },
      ]
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: Notification02Icon,
      description: 'Configuración de notificaciones y alertas',
      settings: [
        { label: 'Notificaciones por email', value: true, type: 'toggle' },
        { label: 'Notificaciones push', value: true, type: 'toggle' },
        { label: 'Notificar nuevos registros', value: true, type: 'toggle' },
        { label: 'Notificar nuevas propiedades', value: true, type: 'toggle' },
        { label: 'Notificar pagos pendientes', value: true, type: 'toggle' },
      ]
    },
    {
      id: 'payments',
      title: 'Pagos',
      icon: Mail01Icon,
      description: 'Configuración de métodos de pago',
      settings: [
        { label: 'Transferencia bancaria habilitada', value: true, type: 'toggle' },
        { label: 'Tarjeta de crédito/débito habilitada', value: true, type: 'toggle' },
        { label: 'Yape habilitado', value: true, type: 'toggle' },
        { label: 'Plin habilitado', value: true, type: 'toggle' },
        { label: 'Comisión de plataforma (%)', value: '5', type: 'number' },
      ]
    },
    {
      id: 'appearance',
      title: 'Apariencia',
      icon: PaintBoardIcon,
      description: 'Personalización visual de la plataforma',
      settings: [
        { label: 'Modo oscuro por defecto', value: false, type: 'toggle' },
        { label: 'Permitir cambio de tema', value: true, type: 'toggle' },
        { label: 'Color primario', value: '#0f3457', type: 'color' },
        { label: 'Color secundario', value: '#EA4227', type: 'color' },
      ]
    },
    {
      id: 'database',
      title: 'Base de Datos',
      icon: DatabaseIcon,
      description: 'Información y mantenimiento de la base de datos',
      settings: [
        { label: 'Última copia de seguridad', value: '2026-05-14 10:30 AM', type: 'readonly' },
        { label: 'Tamaño de la base de datos', value: '245 MB', type: 'readonly' },
        { label: 'Total de registros', value: '1,234', type: 'readonly' },
        { label: 'Backup automático', value: true, type: 'toggle' },
      ]
    }
  ]

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Settings02Icon size={32} style={{ color: 'var(--admin-accent)' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--admin-text)' }}>
            Configuración
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          Administra la configuración general de la plataforma
        </p>
      </div>

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.id}
              style={{
                background: 'var(--admin-card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--admin-border)',
                overflow: 'hidden'
              }}
            >
              {/* Section Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid var(--admin-border)',
                background: 'var(--admin-hover-bg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(15,52,87,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} style={{ color: '#0f3457' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '2px' }}>
                      {section.title}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings List */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {section.settings.map((setting, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: index < section.settings.length - 1 ? '20px' : '0',
                        borderBottom: index < section.settings.length - 1 ? '1px solid var(--admin-border)' : 'none'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: 'var(--admin-text)',
                          display: 'block'
                        }}>
                          {setting.label}
                        </label>
                      </div>

                      <div style={{ minWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
                        {setting.type === 'toggle' && (
                          <button
                            style={{
                              position: 'relative',
                              width: '48px',
                              height: '24px',
                              borderRadius: '100px',
                              background: setting.value ? '#10b981' : 'var(--admin-border)',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              top: '2px',
                              left: setting.value ? '26px' : '2px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#fff',
                              transition: 'left 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </button>
                        )}

                        {setting.type === 'text' && (
                          <input
                            type="text"
                            defaultValue={setting.value as string}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              color: 'var(--admin-text)',
                              background: 'var(--admin-bg)',
                              outline: 'none'
                            }}
                          />
                        )}

                        {setting.type === 'email' && (
                          <input
                            type="email"
                            defaultValue={setting.value as string}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              color: 'var(--admin-text)',
                              background: 'var(--admin-bg)',
                              outline: 'none'
                            }}
                          />
                        )}

                        {setting.type === 'tel' && (
                          <input
                            type="tel"
                            defaultValue={setting.value as string}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              color: 'var(--admin-text)',
                              background: 'var(--admin-bg)',
                              outline: 'none'
                            }}
                          />
                        )}

                        {setting.type === 'number' && (
                          <input
                            type="number"
                            defaultValue={setting.value as string}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              color: 'var(--admin-text)',
                              background: 'var(--admin-bg)',
                              outline: 'none'
                            }}
                          />
                        )}

                        {setting.type === 'color' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="color"
                              defaultValue={setting.value as string}
                              style={{
                                width: '40px',
                                height: '32px',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            />
                            <input
                              type="text"
                              defaultValue={setting.value as string}
                              style={{
                                width: '100px',
                                padding: '8px 12px',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                color: 'var(--admin-text)',
                                background: 'var(--admin-bg)',
                                outline: 'none',
                                fontFamily: 'monospace'
                              }}
                            />
                          </div>
                        )}

                        {setting.type === 'readonly' && (
                          <div style={{
                            padding: '8px 12px',
                            background: 'var(--admin-hover-bg)',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            color: 'var(--admin-text-muted)',
                            fontFamily: 'monospace'
                          }}>
                            {setting.value as string}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--admin-border)',
                background: 'var(--admin-hover-bg)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--admin-text)',
                  cursor: 'pointer'
                }}>
                  Cancelar
                </button>
                <button style={{
                  padding: '8px 16px',
                  background: 'var(--admin-accent-gradient)',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(15,52,87,0.3)'
                }}>
                  Guardar cambios
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Danger Zone */}
      <div style={{
        marginTop: '32px',
        background: 'var(--admin-card-bg)',
        borderRadius: '12px',
        border: '2px solid #ef4444',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #ef4444',
          background: 'rgba(239,68,68,0.05)'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ef4444', marginBottom: '4px' }}>
            Zona de Peligro
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Acciones irreversibles que afectan toda la plataforma
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--admin-border)'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-text)', marginBottom: '4px' }}>
                  Limpiar caché de la aplicación
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  Elimina todos los archivos temporales y caché
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#ef4444',
                cursor: 'pointer'
              }}>
                Limpiar caché
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--admin-border)'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-text)', marginBottom: '4px' }}>
                  Exportar base de datos
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  Descarga una copia completa de la base de datos
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--admin-text)',
                cursor: 'pointer'
              }}>
                Exportar
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#ef4444', marginBottom: '4px' }}>
                  Resetear toda la plataforma
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  ⚠️ Elimina TODOS los datos. Esta acción no se puede deshacer.
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer'
              }}>
                Resetear plataforma
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
