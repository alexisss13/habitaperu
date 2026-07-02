'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Add01Icon, PencilEdit01Icon, Delete02Icon, Cancel01Icon,
} from "hugeicons-react"
import {
  createCityAction, updateCityAction, deleteCityAction,
  createDistrictAction, updateDistrictAction, deleteDistrictAction,
  type CityAdminRow, type DistrictAdminRow,
} from "@/app/actions/location-actions"

interface Props {
  cities: CityAdminRow[]
  districts: DistrictAdminRow[]
}

export function LocationsDesktop({ cities, districts }: Props) {
  const router = useRouter()
  const [selectedCityId, setSelectedCityId] = useState<string | null>(cities[0]?.id ?? null)
  const [error, setError] = useState<string | null>(null)

  const [newCityName, setNewCityName] = useState("")
  const [newDistrictName, setNewDistrictName] = useState("")
  const [editingCityId, setEditingCityId] = useState<string | null>(null)
  const [editingCityName, setEditingCityName] = useState("")
  const [editingDistrictId, setEditingDistrictId] = useState<string | null>(null)
  const [editingDistrictName, setEditingDistrictName] = useState("")
  const [pending, setPending] = useState(false)

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null
  const visibleDistricts = districts.filter((d) => d.cityId === selectedCityId)

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    setError(null)
    setPending(true)
    const res = await fn()
    setPending(false)
    if (!res.success) { setError(res.error || "Ocurrió un error."); return }
    router.refresh()
  }

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Ciudades y Distritos</h1>

      {error && (
        <div className="mb-4 bg-admin-error-bg text-admin-error rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
          <Cancel01Icon size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-[340px_1fr] gap-6 items-start">
        {/* Ciudades */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold text-text">Ciudades</h2>
          </div>

          <form
            className="flex gap-2 p-3 border-b border-slate-100"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newCityName.trim()) return
              run(() => createCityAction(newCityName)).then(() => setNewCityName(""))
            }}
          >
            <input
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="Nueva ciudad…"
              className="flex-1 h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
            />
            <button type="submit" disabled={pending} className="size-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center cursor-pointer border-0 disabled:opacity-50">
              <Add01Icon size={16} />
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {cities.map((city) => (
              <div
                key={city.id}
                onClick={() => setSelectedCityId(city.id)}
                className={`flex items-center justify-between gap-2 px-4 py-3 cursor-pointer transition-colors ${selectedCityId === city.id ? "bg-accent/5" : "hover:bg-slate-50"}`}
              >
                {editingCityId === city.id ? (
                  <input
                    autoFocus
                    value={editingCityName}
                    onChange={(e) => setEditingCityName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") run(() => updateCityAction({ id: city.id, name: editingCityName, isActive: city.isActive })).then(() => setEditingCityId(null))
                      if (e.key === "Escape") setEditingCityId(null)
                    }}
                    className="flex-1 h-8 px-2 border border-accent rounded-lg text-sm font-semibold focus:outline-none"
                  />
                ) : (
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{city.name}</p>
                    <p className="text-[11px] text-text-muted">{city.districtCount} distrito{city.districtCount === 1 ? "" : "s"}</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    title={city.isActive ? "Desactivar" : "Activar"}
                    disabled={pending}
                    onClick={() => run(() => updateCityAction({ id: city.id, name: city.name, isActive: !city.isActive }))}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer border-0 ${city.isActive ? "bg-admin-success-bg text-admin-success" : "bg-slate-100 text-slate-500"}`}
                  >
                    {city.isActive ? "Activa" : "Inactiva"}
                  </button>
                  <button
                    type="button"
                    title="Renombrar"
                    onClick={() => { setEditingCityId(city.id); setEditingCityName(city.name) }}
                    className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-slate-100 cursor-pointer border-0 bg-transparent"
                  >
                    <PencilEdit01Icon size={13} />
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm(`¿Eliminar "${city.name}" y sus ${city.districtCount} distritos?`)) return
                      run(() => deleteCityAction(city.id)).then(() => {
                        if (selectedCityId === city.id) setSelectedCityId(null)
                      })
                    }}
                    className="size-7 rounded-lg flex items-center justify-center text-admin-error hover:bg-admin-error-bg cursor-pointer border-0 bg-transparent"
                  >
                    <Delete02Icon size={13} />
                  </button>
                </div>
              </div>
            ))}
            {cities.length === 0 && <p className="px-4 py-6 text-center text-sm text-text-muted">Sin ciudades todavía.</p>}
          </div>
        </div>

        {/* Distritos */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold text-text">
              Distritos {selectedCity ? <span className="text-text-muted font-normal">— {selectedCity.name}</span> : null}
            </h2>
          </div>

          {!selectedCity ? (
            <p className="px-4 py-10 text-center text-sm text-text-muted">Elige una ciudad para ver y administrar sus distritos.</p>
          ) : (
            <>
              <form
                className="flex gap-2 p-3 border-b border-slate-100"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newDistrictName.trim()) return
                  run(() => createDistrictAction({ name: newDistrictName, cityId: selectedCity.id })).then(() => setNewDistrictName(""))
                }}
              >
                <input
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder={`Nuevo distrito en ${selectedCity.name}…`}
                  className="flex-1 h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
                />
                <button type="submit" disabled={pending} className="size-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center cursor-pointer border-0 disabled:opacity-50">
                  <Add01Icon size={16} />
                </button>
              </form>

              <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
                {visibleDistricts.map((district) => (
                  <div key={district.id} className="flex items-center justify-between gap-2 px-4 py-3">
                    {editingDistrictId === district.id ? (
                      <input
                        autoFocus
                        value={editingDistrictName}
                        onChange={(e) => setEditingDistrictName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") run(() => updateDistrictAction({ id: district.id, name: editingDistrictName, isActive: district.isActive, cityId: district.cityId })).then(() => setEditingDistrictId(null))
                          if (e.key === "Escape") setEditingDistrictId(null)
                        }}
                        className="flex-1 h-8 px-2 border border-accent rounded-lg text-sm font-semibold focus:outline-none"
                      />
                    ) : (
                      <div className="min-w-0 flex items-center gap-2">
                        <p className="text-sm font-bold text-text truncate">{district.name}</p>
                        {district.source === "HOST" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-admin-info-bg text-admin-info shrink-0">
                            Agregado por arrendador
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        title={district.isActive ? "Desactivar" : "Activar"}
                        disabled={pending}
                        onClick={() => run(() => updateDistrictAction({ id: district.id, name: district.name, isActive: !district.isActive, cityId: district.cityId }))}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer border-0 ${district.isActive ? "bg-admin-success-bg text-admin-success" : "bg-slate-100 text-slate-500"}`}
                      >
                        {district.isActive ? "Activo" : "Inactivo"}
                      </button>
                      <button
                        type="button"
                        title="Renombrar"
                        onClick={() => { setEditingDistrictId(district.id); setEditingDistrictName(district.name) }}
                        className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-slate-100 cursor-pointer border-0 bg-transparent"
                      >
                        <PencilEdit01Icon size={13} />
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm(`¿Eliminar el distrito "${district.name}"?`)) return
                          run(() => deleteDistrictAction(district.id))
                        }}
                        className="size-7 rounded-lg flex items-center justify-center text-admin-error hover:bg-admin-error-bg cursor-pointer border-0 bg-transparent"
                      >
                        <Delete02Icon size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {visibleDistricts.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-text-muted">Sin distritos en esta ciudad todavía.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
