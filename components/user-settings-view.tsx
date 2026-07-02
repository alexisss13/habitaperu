"use client"

import { useState } from "react"
import { useResponsive } from "@/hooks/useResponsive"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { SecurityIcon, UserIcon, CheckmarkCircle01Icon, Notification02Icon } from "hugeicons-react"
import { toggleTwoFactorAction } from "@/app/actions/user-actions"

interface UserSettingsViewProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    role: string
    twoFactorEnabled: boolean
  }
}

export function UserSettingsView({ user }: UserSettingsViewProps) {
  const { isMobile, isLoading } = useResponsive()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleToggle2FA = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    setSaving(true)
    try {
      const res = await toggleTwoFactorAction()
      if (res.success) {
        setTwoFactorEnabled(res.twoFactorEnabled)
        setSuccessMsg(
          res.twoFactorEnabled
            ? "Autenticación de 2 factores (2FA) ACTIVADA con éxito."
            : "Autenticación de 2 factores (2FA) DESACTIVADA."
        )
        setTimeout(() => setSuccessMsg(""), 4000)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "Error al actualizar la configuración.")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Cargando configuración..." />
  }

  const containerCls = isMobile
    ? "px-4 py-6 flex flex-col gap-6"
    : "max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8"

  // Admin usa sidebar (sin pestaña activa que indique la sección), así que
  // sí necesita el título acá. Landlord/tenant ya lo ven en su topbar.
  const showTitle = user.role === "ADMIN"

  return (
    <div className={containerCls}>
      {showTitle && (
        <h1 className={isMobile ? "text-lg font-bold text-admin-text" : "text-2xl font-bold text-admin-text"}>
          Configuración
        </h1>
      )}

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-panel-hover-bg border border-panel-border rounded-xl text-green text-sm font-semibold transition-all">
          <CheckmarkCircle01Icon size={18} className="shrink-0 text-green" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-red/10 border border-red/20 rounded-xl text-red text-sm font-semibold transition-all">
          <span className="shrink-0">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {/* Profile Info Section */}
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-panel-border bg-panel-hover-bg">
            <UserIcon size={20} className="text-accent" />
            <h2 className="text-base font-bold text-panel-text">Datos del Perfil</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <div className="px-4 py-2.5 bg-panel-card-bg border border-panel-border rounded-lg text-sm text-panel-text font-semibold">
                {user.name}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="px-4 py-2.5 bg-panel-card-bg border border-panel-border rounded-lg text-sm text-panel-text font-mono">
                {user.email}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1.5">
                Rol de Usuario
              </label>
              <div className="px-4 py-2.5 bg-panel-card-bg border border-panel-border rounded-lg text-sm text-panel-text-dim font-bold uppercase tracking-wide">
                {user.role === "LANDLORD" ? "Arrendador" : user.role === "TENANT" ? "Inquilino" : user.role}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1.5">
                Teléfono de Contacto
              </label>
              <div className="px-4 py-2.5 bg-panel-card-bg border border-panel-border rounded-lg text-sm text-panel-text font-semibold">
                {user.phone || "No registrado"}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section (2FA Toggle) */}
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-panel-border bg-panel-hover-bg">
            <SecurityIcon size={20} className="text-accent" />
            <h2 className="text-base font-bold text-panel-text">Seguridad de la Cuenta</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-panel-text mb-1">
                  Autenticación de dos factores (2FA)
                </h3>
                <p className="text-xs text-panel-text-muted max-w-lg leading-relaxed">
                  Añade una capa extra de seguridad para tu cuenta. Al iniciar sesión, se te solicitará ingresar un código de 6 dígitos enviado por seguridad.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    twoFactorEnabled ? "bg-green" : "bg-gray-300"
                  } disabled:opacity-50`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-panel-text-dim min-w-16">
                  {twoFactorEnabled ? "Activado" : "Desactivado"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Preference — aún no hay backend para persistir esto
            (no existe el campo en el modelo de usuario), así que se muestra
            deshabilitado en vez de fingir que ya funciona. */}
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-panel-border bg-panel-hover-bg">
            <Notification02Icon size={20} className="text-accent" />
            <h2 className="text-base font-bold text-panel-text">Notificaciones y Alertas</h2>
            <span className="ml-auto text-[0.65rem] font-bold text-panel-text-muted uppercase tracking-wider bg-panel-border/60 px-2 py-0.5 rounded-full">
              Próximamente
            </span>
          </div>
          <div className="p-6 flex flex-col gap-4 opacity-60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-panel-text mb-0.5">Notificaciones por Correo</h3>
                <p className="text-xs text-panel-text-muted">Recibe resúmenes de contratos, cobros y recibos.</p>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input type="checkbox" checked readOnly disabled className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green"></div>
              </label>
            </div>
            <div className="h-px bg-panel-border" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-panel-text mb-0.5">Alertas de WhatsApp</h3>
                <p className="text-xs text-panel-text-muted">Recibe recordatorios de firma y pagos al instante.</p>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input type="checkbox" checked readOnly disabled className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
