'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckmarkCircle02Icon,
  SmartPhone02Icon, Location01Icon, Cancel01Icon
} from "hugeicons-react"
import { updateProfileAction } from "@/app/actions/user-actions"
import type { UserProfile } from "./profile-view"

export function ProfileMobile({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    bio: profile.bio,
    district: profile.district,
  })

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const result = await updateProfileAction(form)
      if (result.success) {
        setSuccess("Perfil actualizado")
        setEditing(false)
        router.refresh()
      } else {
        setError(result.error ?? "Error al guardar")
      }
    } catch {
      setError("Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  const memberDate = new Date(profile.memberSince).toLocaleDateString("es-PE", {
    month: "short",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-panel-bg pb-24">
      {/* Editar/Cancelar */}
      <div className="bg-panel-card-bg border-b border-panel-border px-4 py-3">
        <div className="flex items-center justify-end">
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setSuccess(""); setError("") }}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent bg-transparent border-none cursor-pointer"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={() => { setEditing(false); setError(""); setForm({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone, bio: profile.bio, district: profile.district }) }}
              className="text-panel-text-dim bg-transparent border-none cursor-pointer"
            >
              <Cancel01Icon size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">

        {/* Avatar card */}
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-5 flex items-center gap-4">
          <div
            className="size-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
          >
            {profile.firstName?.[0] ?? '?'}{profile.lastName?.[0] ?? ''}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-panel-text truncate">{profile.firstName} {profile.lastName}</p>
            <p className="text-xs text-panel-text-dim truncate">{profile.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {profile.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full">
                  <CheckmarkCircle02Icon size={11} />
                  Verificado
                </span>
              )}
              <span className="text-[11px] text-panel-text-dim">Desde {memberDate}</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="px-4 py-3 bg-green/10 text-green rounded-xl text-sm font-semibold flex items-center gap-2">
            <CheckmarkCircle02Icon size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 bg-red/10 text-red rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Form fields */}
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-4 flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-panel-text-dim uppercase tracking-wide mb-1 block">Nombre</label>
              {editing ? (
                <input
                  value={form.firstName}
                  onChange={set("firstName")}
                  className="w-full px-3 py-2 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-hover-bg"
                />
              ) : (
                <p className="text-sm font-semibold text-panel-text">{profile.firstName}</p>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-panel-text-dim uppercase tracking-wide mb-1 block">Apellido</label>
              {editing ? (
                <input
                  value={form.lastName}
                  onChange={set("lastName")}
                  className="w-full px-3 py-2 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-hover-bg"
                />
              ) : (
                <p className="text-sm font-semibold text-panel-text">{profile.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-panel-text-dim uppercase tracking-wide mb-1 block flex items-center gap-1">
              <SmartPhone02Icon size={11} /> Teléfono
            </label>
            {editing ? (
              <input
                value={form.phone}
                onChange={set("phone")}
                placeholder="+51 999 999 999"
                className="w-full px-3 py-2 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-hover-bg"
              />
            ) : (
              <p className="text-sm text-panel-text">{profile.phone || <span className="text-panel-text-dim">Sin teléfono</span>}</p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-panel-text-dim uppercase tracking-wide mb-1 block flex items-center gap-1">
              <Location01Icon size={11} /> Distrito
            </label>
            {editing ? (
              <input
                value={form.district}
                onChange={set("district")}
                placeholder="Ej: Miraflores"
                className="w-full px-3 py-2 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-hover-bg"
              />
            ) : (
              <p className="text-sm text-panel-text">{profile.district || <span className="text-panel-text-dim">Sin distrito</span>}</p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-panel-text-dim uppercase tracking-wide mb-1 block">Descripción</label>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={set("bio")}
                rows={3}
                placeholder="Cuéntanos un poco sobre ti..."
                className="w-full px-3 py-2 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-hover-bg resize-none"
              />
            ) : (
              <p className="text-sm text-panel-text">
                {profile.bio || <span className="text-panel-text-dim">Sin descripción</span>}
              </p>
            )}
          </div>
        </div>

        {editing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-accent text-white font-bold text-sm rounded-2xl hover:bg-accent/90 transition-all cursor-pointer border-none disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </div>
    </div>
  )
}
