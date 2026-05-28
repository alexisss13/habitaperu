'use client'

import { Settings02Icon, UserIcon, SecurityIcon, Notification02Icon, PaintBoardIcon, DatabaseIcon, Mail01Icon } from "hugeicons-react"

type SettingValue = string | boolean
interface Setting { label: string; value: SettingValue; type: string }
interface Section { id: string; title: string; icon: React.ElementType; description: string; settings: Setting[] }

const sections: Section[] = [
  {
    id: 'general', title: 'General', icon: Settings02Icon,
    description: 'Configuración general de la plataforma',
    settings: [
      { label: 'Nombre de la plataforma', value: 'Habita Perú', type: 'text' },
      { label: 'Email de contacto', value: 'contacto@habitaperu.com', type: 'email' },
      { label: 'Teléfono de soporte', value: '+51 999 999 999', type: 'tel' },
      { label: 'Dirección', value: 'Lima, Perú', type: 'text' },
    ]
  },
  {
    id: 'users', title: 'Usuarios', icon: UserIcon,
    description: 'Configuración de usuarios y roles',
    settings: [
      { label: 'Registro público habilitado', value: true, type: 'toggle' },
      { label: 'Verificación de email requerida', value: true, type: 'toggle' },
      { label: 'Verificación KYC requerida', value: false, type: 'toggle' },
      { label: 'Máximo de propiedades por arrendador', value: '10', type: 'number' },
    ]
  },
  {
    id: 'security', title: 'Seguridad', icon: SecurityIcon,
    description: 'Configuración de seguridad y privacidad',
    settings: [
      { label: 'Autenticación de dos factores', value: false, type: 'toggle' },
      { label: 'Sesiones simultáneas permitidas', value: '3', type: 'number' },
      { label: 'Tiempo de expiración de sesión (minutos)', value: '60', type: 'number' },
      { label: 'Intentos de login fallidos antes de bloqueo', value: '5', type: 'number' },
    ]
  },
  {
    id: 'notifications', title: 'Notificaciones', icon: Notification02Icon,
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
    id: 'payments', title: 'Pagos', icon: Mail01Icon,
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
    id: 'appearance', title: 'Apariencia', icon: PaintBoardIcon,
    description: 'Personalización visual de la plataforma',
    settings: [
      { label: 'Modo oscuro por defecto', value: false, type: 'toggle' },
      { label: 'Permitir cambio de tema', value: true, type: 'toggle' },
      { label: 'Color primario', value: '#0f3457', type: 'color' },
      { label: 'Color secundario', value: '#EA4227', type: 'color' },
    ]
  },
  {
    id: 'database', title: 'Base de Datos', icon: DatabaseIcon,
    description: 'Información y mantenimiento de la base de datos',
    settings: [
      { label: 'Última copia de seguridad', value: '2026-05-14 10:30 AM', type: 'readonly' },
      { label: 'Tamaño de la base de datos', value: '245 MB', type: 'readonly' },
      { label: 'Total de registros', value: '1,234', type: 'readonly' },
      { label: 'Backup automático', value: true, type: 'toggle' },
    ]
  }
]

const inputCls = "w-full px-3 py-2 border border-admin-border rounded-md text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent"

function SettingControl({ setting }: { setting: Setting }) {
  if (setting.type === 'toggle') {
    const on = setting.value as boolean
    return (
      <button className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${on ? 'bg-green' : 'bg-admin-border'}`}>
        <div className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[26px]' : 'left-0.5'}`} />
      </button>
    )
  }
  if (setting.type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <input type="color" defaultValue={setting.value as string} className="w-10 h-8 border border-admin-border rounded-md cursor-pointer" />
        <input type="text" defaultValue={setting.value as string} className={`w-28 ${inputCls} font-mono`} />
      </div>
    )
  }
  if (setting.type === 'readonly') {
    return (
      <div className="px-3 py-2 bg-[rgba(116,133,151,0.05)] rounded-md text-sm text-admin-text-muted font-mono">
        {setting.value as string}
      </div>
    )
  }
  return <input type={setting.type} defaultValue={setting.value as string} className={`${inputCls} min-w-[200px]`} />
}

export function SettingsDesktop() {
  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings02Icon size={32} className="text-admin-accent" />
          <h1 className="text-3xl font-bold text-admin-text">Configuración</h1>
        </div>
        <p className="text-sm text-admin-text-muted">Administra la configuración general de la plataforma</p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <div key={section.id} className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-admin-border bg-[rgba(116,133,151,0.05)]">
                <div className="size-10 rounded-[10px] bg-accent/10 flex items-center justify-center">
                  <Icon size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-admin-text">{section.title}</h2>
                  <p className="text-xs text-admin-text-muted">{section.description}</p>
                </div>
              </div>

              <div className="px-6 py-6 flex flex-col gap-5">
                {section.settings.map((s, i) => (
                  <div key={i} className={`flex items-center justify-between ${i < section.settings.length - 1 ? 'pb-5 border-b border-admin-border' : ''}`}>
                    <label className="text-sm font-medium text-admin-text">{s.label}</label>
                    <div className="min-w-[200px] flex justify-end">
                      <SettingControl setting={s} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-admin-border bg-[rgba(116,133,151,0.05)]">
                <button className="px-4 py-2 border border-admin-border rounded-md text-sm font-medium text-admin-text hover:bg-admin-bg transition-colors">
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold hover:-translate-y-px transition-all">
                  Guardar cambios
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-admin-card-bg rounded-xl border-2 border-red overflow-hidden">
        <div className="px-6 py-5 border-b border-red bg-red/5">
          <h2 className="text-lg font-semibold text-red mb-1">Zona de Peligro</h2>
          <p className="text-xs text-admin-text-muted">Acciones irreversibles que afectan toda la plataforma</p>
        </div>
        <div className="px-6 py-6 flex flex-col gap-4">
          {[
            { label: 'Limpiar caché de la aplicación', desc: 'Elimina todos los archivos temporales y caché', btn: 'Limpiar caché', danger: false },
            { label: 'Exportar base de datos', desc: 'Descarga una copia completa de la base de datos', btn: 'Exportar', danger: false },
            { label: 'Resetear toda la plataforma', desc: '⚠️ Elimina TODOS los datos. Esta acción no se puede deshacer.', btn: 'Resetear plataforma', danger: true },
          ].map((a, i) => (
            <div key={i} className={`flex items-center justify-between ${i < 2 ? 'pb-4 border-b border-admin-border' : ''}`}>
              <div>
                <div className={`text-sm font-medium mb-1 ${a.danger ? 'text-red' : 'text-admin-text'}`}>{a.label}</div>
                <div className="text-xs text-admin-text-muted">{a.desc}</div>
              </div>
              <button className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${a.danger ? 'bg-red text-white hover:bg-red/90' : 'border border-admin-border text-admin-text hover:bg-admin-bg'}`}>
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
