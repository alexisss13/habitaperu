'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  UserCircleIcon, Mail01Icon, SmartPhone02Icon, Location01Icon,
  CheckmarkCircle02Icon, SecurityCheckIcon, CalendarAdd01Icon
} from "hugeicons-react"
import { updateProfileAction } from "@/app/actions/user-actions"
import type { UserProfile } from "./profile-view"

export function ProfileDesktop({ profile }: { profile: UserProfile }) {
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
        setSuccess("Perfil actualizado correctamente")
        setEditing(false)
        router.refresh()
      } else {
        setError(result.error ?? "Error al guardar")
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const memberDate = new Date(profile.memberSince).toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#151c26] mb-1">Mi Perfil</h1>
          <p className="text-sm text-gray-500">Gestiona tu información personal</p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Left sidebar — avatar & stats */}
          <div className="col-span-1 flex flex-col gap-4">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3">
              <div
                className="size-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
              >
                {profile.firstName?.[0] ?? '?'}{profile.lastName?.[0] ?? ''}
              </div>
              <div className="text-center">
                <p className="font-bold text-[#151c26]">{profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-gray-400">Inquilino</p>
              </div>
              {profile.verified && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green bg-green/10 px-2.5 py-1 rounded-full">
                  <CheckmarkCircle02Icon size={13} />
                  Verificado
                </span>
              )}
            </div>

            {/* Stats card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <CalendarAdd01Icon size={16} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Miembro desde</p>
                  <p className="font-semibold text-[#151c26] text-xs">{memberDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <SecurityCheckIcon size={16} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Contratos</p>
                  <p className="font-semibold text-[#151c26] text-xs">{profile.contractsCount} en total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#151c26] text-lg flex items-center gap-2">
                  <UserCircleIcon size={20} className="text-accent" />
                  Información personal
                </h2>
                {!editing ? (
                  <button
                    onClick={() => { setEditing(true); setSuccess(""); setError("") }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
                  >
                    Editar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditing(false); setError(""); setForm({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone, bio: profile.bio, district: profile.district }) }}
                      className="text-sm font-semibold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 text-sm font-semibold bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-accent/90 transition-all cursor-pointer border-none disabled:opacity-60"
                    >
                      {saving ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                )}
              </div>

              {success && (
                <div className="mb-4 px-4 py-3 bg-green/10 text-green rounded-xl text-sm font-semibold flex items-center gap-2">
                  <CheckmarkCircle02Icon size={16} />
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red/10 text-red rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nombre</label>
                  {editing ? (
                    <input
                      value={form.firstName}
                      onChange={set("firstName")}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50"
                    />
                  ) : (
                    <p className="text-sm text-[#151c26] font-medium">{profile.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Apellido</label>
                  {editing ? (
                    <input
                      value={form.lastName}
                      onChange={set("lastName")}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50"
                    />
                  ) : (
                    <p className="text-sm text-[#151c26] font-medium">{profile.lastName}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
                    <Mail01Icon size={12} />
                    Correo electrónico
                  </label>
                  <p className="text-sm text-gray-400">{profile.email}</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">No se puede cambiar el correo</p>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
                    <SmartPhone02Icon size={12} />
                    Teléfono
                  </label>
                  {editing ? (
                    <input
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+51 999 999 999"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50"
                    />
                  ) : (
                    <p className="text-sm text-[#151c26] font-medium">{profile.phone || <span className="text-gray-300">Sin teléfono</span>}</p>
                  )}
                </div>

                {/* Distrito */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
                    <Location01Icon size={12} />
                    Distrito
                  </label>
                  {editing ? (
                    <input
                      value={form.district}
                      onChange={set("district")}
                      placeholder="Ej: Miraflores"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50"
                    />
                  ) : (
                    <p className="text-sm text-[#151c26] font-medium">{profile.district || <span className="text-gray-300">Sin distrito</span>}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Descripción personal</label>
                  {editing ? (
                    <textarea
                      value={form.bio}
                      onChange={set("bio")}
                      rows={3}
                      placeholder="Cuéntanos un poco sobre ti..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-[#151c26]">
                      {profile.bio || <span className="text-gray-300">Sin descripción</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
