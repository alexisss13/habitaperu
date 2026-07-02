'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Add01Icon, PencilEdit01Icon, Delete02Icon,
  Cancel01Icon, ArrowDown01Icon, ArrowUp01Icon,
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

export function LocationsMobile({ cities, districts }: Props) {
  const router = useRouter()
  const [expandedCityId, setExpandedCityId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const [showAddCity, setShowAddCity] = useState(false)
  const [newCityName, setNewCityName] = useState("")
  const [newDistrictName, setNewDistrictName] = useState("")
  const [editingCityId, setEditingCityId] = useState<string | null>(null)
  const [editingCityName, setEditingCityName] = useState("")
  const [editingDistrictId, setEditingDistrictId] = useState<string | null>(null)
  const [editingDistrictName, setEditingDistrictName] = useState("")

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    setError(null)
    setPending(true)
    const res = await fn()
    setPending(false)
    if (!res.success) { setError(res.error || "Ocurrió un error."); return }
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-white pb-24 pt-2">
      <h1 className="text-lg font-bold text-admin-text px-5">Ciudades y Distritos</h1>

      {error && (
        <div className="mx-5 mt-4 bg-admin-error-bg text-admin-error rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
          <Cancel01Icon size={14} /> {error}
        </div>
      )}

      <div className="px-5 py-4">
        {showAddCity ? (
          <form
            className="flex gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newCityName.trim()) return
              run(() => createCityAction(newCityName)).then(() => { setNewCityName(""); setShowAddCity(false) })
            }}
          >
            <input
              autoFocus
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="Nombre de la ciudad"
              className="flex-1 h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
            />
            <button type="submit" disabled={pending} className="h-11 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer border-0 disabled:opacity-50">
              Guardar
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddCity(true)}
            className="w-full h-11 mb-4 rounded-xl border-2 border-dashed border-slate-300 text-sm font-bold text-text-muted flex items-center justify-center gap-2 cursor-pointer bg-transparent"
          >
            <Add01Icon size={16} /> Nueva ciudad
          </button>
        )}

        <div className="flex flex-col gap-3">
          {cities.map((city) => {
            const isExpanded = expandedCityId === city.id
            const cityDistricts = districts.filter((d) => d.cityId === city.id)

            return (
              <div key={city.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                <div
                  onClick={() => setExpandedCityId(isExpanded ? null : city.id)}
                  className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 cursor-pointer"
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
                      className="flex-1 h-9 px-2 border border-accent rounded-lg text-sm font-semibold focus:outline-none bg-white"
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
                      disabled={pending}
                      onClick={() => run(() => updateCityAction({ id: city.id, name: city.name, isActive: !city.isActive }))}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer border-0 ${city.isActive ? "bg-admin-success-bg text-admin-success" : "bg-slate-200 text-slate-500"}`}
                    >
                      {city.isActive ? "Activa" : "Inactiva"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingCityId(city.id); setEditingCityName(city.name) }}
                      className="size-7 rounded-lg flex items-center justify-center text-text-muted cursor-pointer border-0 bg-transparent"
                    >
                      <PencilEdit01Icon size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (!confirm(`¿Eliminar "${city.name}" y sus distritos?`)) return
                        run(() => deleteCityAction(city.id))
                      }}
                      className="size-7 rounded-lg flex items-center justify-center text-admin-error cursor-pointer border-0 bg-transparent"
                    >
                      <Delete02Icon size={13} />
                    </button>
                    {isExpanded ? <ArrowUp01Icon size={16} className="text-text-muted" /> : <ArrowDown01Icon size={16} className="text-text-muted" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3">
                    <form
                      className="flex gap-2 mb-3"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!newDistrictName.trim()) return
                        run(() => createDistrictAction({ name: newDistrictName, cityId: city.id })).then(() => setNewDistrictName(""))
                      }}
                    >
                      <input
                        value={newDistrictName}
                        onChange={(e) => setNewDistrictName(e.target.value)}
                        placeholder="Nuevo distrito…"
                        className="flex-1 h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
                      />
                      <button type="submit" disabled={pending} className="size-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center cursor-pointer border-0 disabled:opacity-50">
                        <Add01Icon size={16} />
                      </button>
                    </form>

                    <div className="flex flex-col gap-2">
                      {cityDistricts.map((district) => (
                        <div key={district.id} className="flex items-center justify-between gap-2 px-3 py-2.5 border border-slate-100 rounded-xl">
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
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-text truncate">{district.name}</p>
                              {district.source === "HOST" && (
                                <p className="text-[10px] font-bold text-admin-info">Agregado por arrendador</p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => run(() => updateDistrictAction({ id: district.id, name: district.name, isActive: !district.isActive, cityId: district.cityId }))}
                              className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer border-0 ${district.isActive ? "bg-admin-success-bg text-admin-success" : "bg-slate-200 text-slate-500"}`}
                            >
                              {district.isActive ? "Activo" : "Inactivo"}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingDistrictId(district.id); setEditingDistrictName(district.name) }}
                              className="size-7 rounded-lg flex items-center justify-center text-text-muted cursor-pointer border-0 bg-transparent"
                            >
                              <PencilEdit01Icon size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => {
                                if (!confirm(`¿Eliminar el distrito "${district.name}"?`)) return
                                run(() => deleteDistrictAction(district.id))
                              }}
                              className="size-7 rounded-lg flex items-center justify-center text-admin-error cursor-pointer border-0 bg-transparent"
                            >
                              <Delete02Icon size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {cityDistricts.length === 0 && (
                        <p className="text-center text-xs text-text-muted py-3">Sin distritos todavía.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {cities.length === 0 && <p className="text-center text-sm text-text-muted py-10">Sin ciudades todavía.</p>}
        </div>
      </div>
    </div>
  )
}
