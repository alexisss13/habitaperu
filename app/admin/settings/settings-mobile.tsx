'use client'

import { Settings02Icon, UserIcon, SecurityIcon, Notification02Icon, PaintBoardIcon, DatabaseIcon, Mail01Icon, ArrowRight01Icon } from "hugeicons-react"

const sections = [
  { id: 'general', title: 'General', icon: Settings02Icon, desc: 'Nombre, email, teléfono' },
  { id: 'users', title: 'Usuarios', icon: UserIcon, desc: 'Registro, verificación, roles' },
  { id: 'security', title: 'Seguridad', icon: SecurityIcon, desc: '2FA, sesiones, bloqueos' },
  { id: 'notifications', title: 'Notificaciones', icon: Notification02Icon, desc: 'Email, push, alertas' },
  { id: 'payments', title: 'Pagos', icon: Mail01Icon, desc: 'Métodos y comisiones' },
  { id: 'appearance', title: 'Apariencia', icon: PaintBoardIcon, desc: 'Tema, colores, modo oscuro' },
  { id: 'database', title: 'Base de Datos', icon: DatabaseIcon, desc: 'Backups, exportar' },
]

export function SettingsMobile() {
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <Settings02Icon size={24} className="text-admin-accent" />
          <h1 className="text-2xl font-bold text-admin-text">Configuración</h1>
        </div>
        <p className="text-xs text-admin-text-muted">Configuración de la plataforma</p>
      </div>

      {/* Sections List */}
      <div className="px-4 bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
        {sections.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-[rgba(116,133,151,0.05)] transition-colors ${i < sections.length - 1 ? 'border-b border-admin-border' : ''}`}
            >
              <div className="size-10 rounded-[10px] bg-accent/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-admin-text">{s.title}</div>
                <div className="text-xs text-admin-text-muted">{s.desc}</div>
              </div>
              <ArrowRight01Icon size={16} className="text-admin-text-muted shrink-0" />
            </button>
          )
        })}
      </div>

      {/* Danger Zone */}
      <div className="px-4 mt-4">
        <div className="bg-admin-card-bg rounded-xl border-2 border-red overflow-hidden">
          <div className="px-4 py-3 border-b border-red bg-red/5">
            <h2 className="text-sm font-semibold text-red">Zona de Peligro</h2>
          </div>
          <div className="flex flex-col gap-1 p-3">
            {[
              { label: 'Limpiar caché', danger: false },
              { label: 'Exportar base de datos', danger: false },
              { label: 'Resetear plataforma', danger: true },
            ].map(a => (
              <button
                key={a.label}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${a.danger ? 'bg-red text-white' : 'border border-admin-border text-admin-text hover:bg-admin-bg'}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
