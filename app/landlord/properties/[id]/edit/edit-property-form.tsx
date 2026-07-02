'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle01Icon,
  AlertCircleIcon, Target01Icon,
} from "hugeicons-react"
import { uploadImageAction } from "@/app/actions/upload-actions"

const PERU_CITIES = [
  "Lima","Trujillo","Chiclayo","Arequipa","Piura","Cusco",
  "Ica","Tacna","Huancayo","Iquitos","Cajamarca","Puno",
]

const MAX_PHOTOS = 5

const AMENITIES_LIST = [
  { id: "wifi",           label: "Wi-Fi de Alta Velocidad" },
  { id: "hot_water",      label: "Agua Caliente" },
  { id: "security",       label: "Seguridad 24/7" },
  { id: "elevator",       label: "Ascensor" },
  { id: "pets",           label: "Mascotas Permitidas" },
  { id: "laundry",        label: "Lavandería en Edificio" },
  { id: "terrace",        label: "Terraza / Zona de Parrillas" },
  { id: "parking_visits", label: "Estacionamiento de Visitas" },
]

interface PropertyData {
  id: string; title: string; description: string
  type: string; condition: string; status: string
  district: string; address: string; area: string
  rooms: string; bathrooms: string; parking: string
  price: string; deposit: string; minDuration: string
  amenities: string[]; images: string[]; conditions: string
  lat: number | null; lng: number | null
}

export function EditPropertyForm({ property }: { property: PropertyData }) {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state — pre-populated from existing property
  const [type, setType]             = useState(property.type)
  const [condition, setCondition]   = useState(property.condition)
  const [status, setStatus]         = useState(property.status)
  const [district, setDistrict]     = useState(property.district)
  const [address, setAddress]       = useState(property.address)
  const [price, setPrice]           = useState(property.price)
  const [deposit, setDeposit]       = useState(property.deposit)
  const [minDuration, setMinDuration] = useState(property.minDuration)
  const [area, setArea]             = useState(property.area)
  const [rooms, setRooms]           = useState(property.rooms)
  const [bathrooms, setBathrooms]   = useState(property.bathrooms)
  const [parking, setParking]       = useState(property.parking)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property.amenities)
  const [images, setImages] = useState<string[]>(
    Array.from({ length: MAX_PHOTOS }, (_, i) => property.images[i] ?? "")
  )
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set())
  const [city, setCity]             = useState(() => PERU_CITIES.find(c => property.district.includes(c)) ?? "")
  const [lat, setLat]               = useState(property.lat?.toString() ?? "")
  const [lng, setLng]               = useState(property.lng?.toString() ?? "")
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError]     = useState<string | null>(null)
  const [title, setTitle]           = useState(property.title)
  const [description, setDescription] = useState(property.description)
  const [conditions, setConditions] = useState(property.conditions)

  const handleGetLocation = () => {
    setLocError(null)
    if (!navigator.geolocation) {
      setLocError("Tu dispositivo no soporta geolocalización.")
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6))
        setLng(pos.coords.longitude.toFixed(6))
        setLocLoading(false)
      },
      () => {
        setLocError("No se pudo detectar tu ubicación. Asegúrate de dar permiso al navegador.")
        setLocLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const toggleAmenity = (id: string) =>
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const setImageAt = (index: number, url: string) => {
    setImages(prev => prev.map((u, i) => (i === index ? url : u)))
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIndexes(prev => new Set(prev).add(index))
    setError(null)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await uploadImageAction(fd, "properties")
      if (res.success && res.url) setImageAt(index, res.url)
      else setError(res.error ?? "Error al subir imagen")
    } catch { setError("Error de conexión") }
    finally {
      setUploadingIndexes(prev => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }
  }

  const nextStep = () => {
    setError(null)
    if (step === 2 && (!district || !address)) {
      setError("Ingresa el distrito y la dirección.")
      return
    }
    if (step === 3) {
      if (!price || Number(price) < 100) { setError("Precio mínimo: S/ 100."); return }
      if (!rooms || Number(rooms) < 1)   { setError("Al menos 1 habitación."); return }
      if (!bathrooms || Number(bathrooms) < 1) { setError("Al menos 1 baño."); return }
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (title.length < 10) { setError("Título: mínimo 10 caracteres."); return }
    if (description.length < 30) { setError("Descripción: mínimo 30 caracteres."); return }

    setLoading(true)
    const finalImages = images
      .map(u => u.trim())
      .filter(Boolean)

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, type, condition, status,
          district, address: address || undefined,
          area:        area        ? Number(area)        : undefined,
          rooms:       Number(rooms),
          bathrooms:   Number(bathrooms),
          parking:     Number(parking),
          price:       Number(price),
          deposit:     Number(deposit),
          minDuration: Number(minDuration),
          amenities:   selectedAmenities,
          images:      finalImages.length > 0 ? finalImages : undefined,
          conditions:  conditions || undefined,
          lat:         lat ? Number(lat) : undefined,
          lng:         lng ? Number(lng) : undefined,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/landlord/properties")
          router.refresh()
        }, 1200)
      } else {
        const data = await res.json()
        setError(data.error ?? "Error al guardar los cambios.")
      }
    } catch {
      setError("Error inesperado al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
        <CheckmarkCircle01Icon size={56} className="text-green" />
        <p className="text-xl font-bold text-[#151c26]">¡Propiedad actualizada!</p>
        <p className="text-sm text-gray-400">Redirigiendo a tus propiedades…</p>
      </div>
    )
  }

  const inputCls = "w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-accent transition-colors"
  const labelCls = "block text-[11px] font-bold text-text-muted mb-1.5 uppercase tracking-wider"

  return (
    <div className="py-8 px-4 md:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/landlord/properties"
        className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-text no-underline mb-6 transition-colors"
      >
        <ArrowLeft01Icon size={14} />
        Volver a mis propiedades
      </Link>

      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-text">Editar Propiedad</h1>
            <p className="text-xs text-text-muted mt-0.5">Paso {step} de 5</p>
          </div>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(s => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-all cursor-pointer ${
                  step >= s ? 'bg-accent' : 'bg-slate-200'
                }`}
                onClick={() => setStep(s)}
              />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3.5 flex items-start gap-2.5 mb-5 text-xs font-medium">
              <AlertCircleIcon size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* STEP 1: Tipo + Condición + Estado */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Tipo de Inmueble</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(['DEPARTAMENTO','CASA','HABITACION','OFICINA','LOCAL'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      className={`h-12 px-3 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                        type === t ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-text-muted hover:border-slate-300'
                      }`}
                    >
                      { {DEPARTAMENTO:'Departamento',CASA:'Casa',HABITACION:'Habitación',OFICINA:'Oficina',LOCAL:'Local'}[t] }
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Estado / Amoblado</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['SIN_MUEBLES','SEMI_AMOBLADO','AMOBLADO'] as const).map(c => (
                    <button key={c} type="button" onClick={() => setCondition(c)}
                      className={`h-12 px-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                        condition === c ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-text-muted hover:border-slate-300'
                      }`}
                    >
                      { {SIN_MUEBLES:'Sin Muebles',SEMI_AMOBLADO:'Semi-amoblado',AMOBLADO:'Amoblado'}[c] }
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Estado de publicación</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['DISPONIBLE','MANTENIMIENTO','OCUPADA'] as const).map(s => (
                    <button key={s} type="button" onClick={() => setStatus(s)}
                      className={`h-12 px-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                        status === s ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 text-text-muted hover:border-slate-300'
                      }`}
                    >
                      { {DISPONIBLE:'Disponible',MANTENIMIENTO:'Mantenimiento',OCUPADA:'Ocupada'}[s] }
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ubicación */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <select
                    className={inputCls + " cursor-pointer"}
                    value={city}
                    onChange={e => {
                      setCity(e.target.value)
                      setDistrict(e.target.value)
                    }}
                  >
                    <option value="">-- Selecciona --</option>
                    {PERU_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Distrito / Barrio</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="Ej: El Porvenir, Miraflores…"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Dirección exacta</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Av. España 123, Dpto 202" className={inputCls} />
              </div>
              <div>
                <p className="text-xs font-bold text-text mb-2 uppercase tracking-wider">
                  Ubicación exacta <span className="text-text-muted font-normal normal-case">(opcional)</span>
                </p>
                {lat && lng ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"><CheckmarkCircle01Icon size={13} className="text-emerald-500" /> Ubicación registrada</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">{lat}, {lng}</p>
                    </div>
                    <button type="button" onClick={() => { setLat(""); setLng("") }}
                      className="text-[10px] font-bold text-emerald-600 border border-emerald-300 rounded-lg px-2.5 py-1 cursor-pointer bg-white">
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locLoading}
                      className="w-full h-12 border-2 border-dashed border-accent/40 rounded-xl text-sm font-bold text-accent flex items-center justify-center gap-2.5 cursor-pointer bg-accent/5 hover:bg-accent/10 transition-colors disabled:opacity-60"
                    >
                      {locLoading ? (
                        <><div className="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin" /> Detectando ubicación…</>
                      ) : (
                        <><Target01Icon size={16} /> Detectar mi ubicación actual</>
                      )}
                    </button>
                    {locError && <p className="text-[11px] text-red-500 font-medium">{locError}</p>}
                    <p className="text-[10px] text-text-muted">
                      Al pulsar el botón, el navegador pedirá permiso para usar tu ubicación. Activa el filtro &quot;Cerca de universidad&quot;.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Características y Precio */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Precio Mensual (S/)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="1800" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Meses de Garantía</label>
                  <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)}
                    placeholder="1" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Vigencia Mínima (meses)</label>
                  <input type="number" value={minDuration} onChange={e => setMinDuration(e.target.value)}
                    placeholder="12" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Área (m²)</label>
                  <input type="number" value={area} onChange={e => setArea(e.target.value)}
                    placeholder="85" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"Habitaciones", val:rooms, set:setRooms },
                  { label:"Baños",        val:bathrooms, set:setBathrooms },
                  { label:"Estacionam.",  val:parking,   set:setParking },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">{label}</label>
                    <input type="number" value={val} onChange={e => set(e.target.value)} className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Amenities + Imágenes */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-text mb-4 uppercase tracking-wider">Comodidades</p>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES_LIST.map(a => (
                    <label key={a.id}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                        selectedAmenities.includes(a.id) ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input type="checkbox" checked={selectedAmenities.includes(a.id)}
                        onChange={() => toggleAmenity(a.id)} className="size-4 shrink-0 rounded text-accent" />
                      <span className="text-xs font-bold text-text">{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-text mb-1 uppercase tracking-wider">Fotos</p>
                <p className="text-[10px] text-text-muted mb-4">Sube hasta 5 fotos. La primera es la portada del anuncio.</p>
                {images.map((url, index) => {
                  const label = index === 0 ? "Foto 1 — Portada" : `Foto ${index + 1}`
                  const uploading = uploadingIndexes.has(index)
                  return (
                    <div key={index} className="border border-slate-200 rounded-xl p-3 bg-slate-50 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-text">{label}</span>
                        {uploading && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo…</span>}
                      </div>
                      <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                        <input type="file" accept="image/*"
                          onChange={e => handleFileUpload(e, index)}
                          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer" />
                        {url && <img src={url} alt={label} className="size-10 rounded object-cover border border-slate-200" />}
                      </div>
                      <input type="text" value={url} onChange={e => setImageAt(index, e.target.value)}
                        placeholder="O pega la URL aquí"
                        className="w-full h-9 px-3 border border-slate-200 rounded-xl text-[11px] font-semibold focus:border-accent mt-2 bg-white outline-none" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Título y Descripción */}
          {step === 5 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelCls}>Título del anuncio</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Hermoso departamento en Miraflores" className={inputCls} />
                <p className="text-[10px] text-text-muted mt-1">Mín. 10 caracteres</p>
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe la propiedad con detalle…"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-accent resize-none transition-colors" />
                <p className="text-[10px] text-text-muted mt-1">Mín. 30 caracteres</p>
              </div>
              <div>
                <label className={labelCls}>Condiciones adicionales (opcional)</label>
                <textarea rows={2} value={conditions} onChange={e => setConditions(e.target.value)}
                  placeholder="No se permiten fiestas. Pago puntual."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-accent resize-none transition-colors" />
              </div>
            </form>
          )}

          {/* Navigation */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => { setError(null); setStep(s => s - 1) }}
                className="h-10 px-5 border border-slate-200 rounded-xl text-xs font-bold text-text-muted hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer bg-white transition-colors">
                <ArrowLeft01Icon size={15} /> Atrás
              </button>
            ) : <div />}

            {step < 5 ? (
              <button type="button" onClick={nextStep}
                className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-0 transition-colors">
                Continuar <ArrowRight01Icon size={15} />
              </button>
            ) : (
              <button type="button" onClick={() => handleSubmit()} disabled={loading}
                className="h-11 px-6 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-60 transition-opacity"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}>
                {loading ? (
                  <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando…</>
                ) : (
                  <><CheckmarkCircle01Icon size={15} /> Guardar cambios</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
