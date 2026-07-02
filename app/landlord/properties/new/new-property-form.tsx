'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Target01Icon,
} from "hugeicons-react"
import { uploadImageAction } from "@/app/actions/upload-actions"
import { useCityDistrictOptions } from "@/hooks/useCityDistrictOptions"
import { Combobox } from "@/components/ui/combobox"

const AMENITIES_LIST = [
  { id: "wifi", label: "Wi-Fi de Alta Velocidad" },
  { id: "hot_water", label: "Agua Caliente" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "elevator", label: "Ascensor" },
  { id: "pets", label: "Mascotas Permitidas" },
  { id: "laundry", label: "Lavandería en Edificio" },
  { id: "terrace", label: "Terraza / Zona de Parrillas" },
  { id: "parking_visits", label: "Estacionamiento de Visitas" },
]

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
]

export function NewPropertyForm() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<"HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL">("DEPARTAMENTO")
  const [condition, setCondition] = useState<"SIN_MUEBLES" | "SEMI_AMOBLADO" | "AMOBLADO">("SIN_MUEBLES")
  const [district, setDistrict] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState("")
  const [deposit, setDeposit] = useState("1")
  const [minDuration, setMinDuration] = useState("12")
  const [area, setArea] = useState("")
  const [rooms, setRooms] = useState("1")
  const [bathrooms, setBathrooms] = useState("1")
  const [parking, setParking] = useState("0")
  const [city, setCity] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState<string | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageUrl1, setImageUrl1] = useState("")
  const [imageUrl2, setImageUrl2] = useState("")
  const [imageUrl3, setImageUrl3] = useState("")
  const [uploading1, setUploading1] = useState(false)
  const [uploading2, setUploading2] = useState(false)
  const [uploading3, setUploading3] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [conditions, setConditions] = useState("")
  const { cities, citiesLoading, districts, districtsLoading } = useCityDistrictOptions(city)

  useEffect(() => {
    const raw = sessionStorage.getItem("habitaperu_onboarding_draft")
    if (!raw) return
    sessionStorage.removeItem("habitaperu_onboarding_draft")
    try {
      const draft = JSON.parse(raw)
      if (draft.type) setType(draft.type)
      if (draft.condition) setCondition(draft.condition)
      if (draft.city) setCity(draft.city)
      if (draft.district) setDistrict(draft.district)
      if (draft.address) setAddress(draft.address)
      if (draft.lat) setLat(draft.lat)
      if (draft.lng) setLng(draft.lng)
      setStep(3)
    } catch {
      // draft was malformed, ignore and start from step 1
    }
  }, [])

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void,
    setUploading: (loading: boolean) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await uploadImageAction(formData, "properties")
      if (res.success && res.url) {
        setImageUrl(res.url)
      } else {
        setError(res.isMocked
          ? "Cloudinary no configurado. Ingresa la URL manualmente o usa fotos de prueba."
          : (res.error || "Error al subir la imagen."))
      }
    } catch {
      setError("Error de conexión al subir la imagen.")
    } finally {
      setUploading(false)
    }
  }

  const handleGetLocation = () => {
    setLocError(null)
    if (!navigator.geolocation) { setLocError("Tu dispositivo no soporta geolocalización."); return }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setLocLoading(false) },
      () => { setLocError("No se pudo detectar tu ubicación. Asegúrate de dar permiso al navegador."); setLocLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const nextStep = () => {
    setError(null)
    if (step === 2 && (!district || !address)) { setError("Por favor ingresa el distrito y la dirección."); return }
    if (step === 3) {
      if (!price || Number(price) < 100) { setError("El precio mínimo de alquiler es S/ 100."); return }
      if (!rooms || Number(rooms) < 1) { setError("La propiedad debe tener al menos 1 habitación."); return }
      if (!bathrooms || Number(bathrooms) < 1) { setError("La propiedad debe tener al menos 1 baño."); return }
    }
    setStep(prev => prev + 1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (title.length < 10) { setError("El título debe tener al menos 10 caracteres."); return }
    if (description.length < 30) { setError("La descripción debe tener al menos 30 caracteres."); return }
    setLoading(true)
    const images: string[] = [imageUrl1, imageUrl2, imageUrl3].map(u => u.trim()).filter(Boolean)
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, type, condition, district, city: city || undefined,
          address: address || undefined,
          area: area ? Number(area) : undefined,
          rooms: Number(rooms), bathrooms: Number(bathrooms), parking: Number(parking),
          price: Number(price), deposit: Number(deposit), minDuration: Number(minDuration),
          amenities: selectedAmenities,
          images: images.length > 0 ? images : undefined,
          conditions: conditions || undefined,
          lat: lat ? Number(lat) : undefined,
          lng: lng ? Number(lng) : undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Si esta era su primera propiedad, el servidor acaba de marcar la
        // cuenta como isLandlord=true: hay que refrescar la sesión antes de
        // navegar, o el gate de /landlord/properties la rechazaría por JWT viejo.
        if (!session?.user?.isLandlord) await updateSession()
        router.push("/landlord/properties")
        router.refresh()
      } else {
        setError(data.error || "Ocurrió un error al guardar la propiedad.")
      }
    } catch {
      setError("Error inesperado al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10 px-4 md:px-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/landlord/properties" className="text-xs font-bold text-text-muted hover:text-text no-underline flex items-center gap-1.5 transition-colors">
          &larr; Volver a mis propiedades
        </Link>
      </div>

      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text">Publicar Nueva Propiedad</h1>
            <p className="text-xs text-text-muted mt-0.5">Paso {step} de 5</p>
          </div>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`h-2 w-8 rounded-full transition-all ${step >= s ? "bg-accent" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="bg-red/10 border border-red/20 text-red rounded-xl p-4 flex items-start gap-2.5 mb-6 text-xs font-medium">
              <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Tipo de Inmueble</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[{id:"DEPARTAMENTO",label:"Departamento"},{id:"CASA",label:"Casa"},{id:"HABITACION",label:"Habitación"},{id:"OFICINA",label:"Oficina"},{id:"LOCAL",label:"Local Comercial"}].map(t => (
                    <button key={t.id} type="button" onClick={() => setType(t.id as any)}
                      className={`h-14 px-3 text-xs font-bold border rounded-xl transition-all cursor-pointer ${type === t.id ? "border-accent bg-accent/5 text-accent" : "border-slate-200 text-text-muted hover:border-slate-300"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Estado / Amoblado</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:"SIN_MUEBLES",label:"Sin Muebles"},{id:"SEMI_AMOBLADO",label:"Semi-amoblado"},{id:"AMOBLADO",label:"Amoblado"}].map(c => (
                    <button key={c.id} type="button" onClick={() => setCondition(c.id as any)}
                      className={`h-14 px-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${condition === c.id ? "border-accent bg-accent/5 text-accent" : "border-slate-200 text-text-muted hover:border-slate-300"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Ciudad</label>
                  <Combobox
                    value={city}
                    onChange={setCity}
                    options={cities}
                    loading={citiesLoading}
                    placeholder="Escribe o elige una ciudad"
                    className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Distrito / Barrio</label>
                  <Combobox
                    value={district}
                    onChange={setDistrict}
                    options={districts}
                    loading={districtsLoading}
                    placeholder="Ej: El Porvenir, Miraflores…"
                    emptyLabel={city.trim() ? "Distrito nuevo, se agregará al escribirlo." : "Primero elige una ciudad."}
                    className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Dirección Exacta</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Av. España 123, Dpto 202"
                  className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-text mb-2 uppercase tracking-wider">
                  Ubicación exacta <span className="font-normal normal-case text-slate-400">(opcional)</span>
                </p>
                {lat && lng ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckmarkCircle01Icon size={13} className="text-emerald-500" /> Ubicación registrada
                      </p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">{lat}, {lng}</p>
                    </div>
                    <button type="button" onClick={() => { setLat(""); setLng("") }}
                      className="text-[10px] font-bold text-emerald-600 border border-emerald-300 rounded-lg px-2.5 py-1 cursor-pointer bg-white">
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button type="button" onClick={handleGetLocation} disabled={locLoading}
                      className="w-full h-12 border-2 border-dashed border-accent/40 rounded-xl text-sm font-bold text-accent flex items-center justify-center gap-2.5 cursor-pointer bg-accent/5 hover:bg-accent/10 transition-colors disabled:opacity-60">
                      {locLoading
                        ? <><div className="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin" /> Detectando ubicación…</>
                        : <><Target01Icon size={16} /> Detectar mi ubicación actual</>
                      }
                    </button>
                    {locError && <p className="text-[11px] text-red-500 font-medium">{locError}</p>}
                    <p className="text-[10px] text-slate-400">
                      Al pulsar el botón, el navegador pedirá permiso para usar tu ubicación. Activa el filtro &quot;Cerca de universidad&quot;.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Precio Mensual (S/)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="1800"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Meses de Garantía</label>
                  <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="1"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Vigencia Mínima (meses)</label>
                  <input type="number" value={minDuration} onChange={e => setMinDuration(e.target.value)} placeholder="12"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Área Total (m²)</label>
                  <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="85"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{label:"Habitaciones",val:rooms,set:setRooms},{label:"Baños",val:bathrooms,set:setBathrooms},{label:"Estacionam.",val:parking,set:setParking}].map(({label,val,set}) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">{label}</label>
                    <input type="number" value={val} onChange={e => set(e.target.value)}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Comodidades</h3>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES_LIST.map(a => (
                    <label key={a.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${selectedAmenities.includes(a.id) ? "border-accent bg-accent/5" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="checkbox" checked={selectedAmenities.includes(a.id)}
                        onChange={() => setSelectedAmenities(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                        className="size-4 shrink-0 rounded text-accent" />
                      <span className="text-xs font-bold text-text">{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider">Fotos de la Propiedad</h3>
                  <button type="button" onClick={() => { setImageUrl1(DEMO_IMAGES[0]); setImageUrl2(DEMO_IMAGES[1]); setImageUrl3(DEMO_IMAGES[2]) }}
                    className="text-[10px] font-bold text-accent hover:underline bg-transparent border-0 cursor-pointer">
                    Usar fotos de prueba
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {label:"Foto Principal (Obligatoria)",url:imageUrl1,setUrl:setImageUrl1,uploading:uploading1,setUploading:setUploading1},
                    {label:"Foto Secundaria",url:imageUrl2,setUrl:setImageUrl2,uploading:uploading2,setUploading:setUploading2},
                    {label:"Foto Adicional",url:imageUrl3,setUrl:setImageUrl3,uploading:uploading3,setUploading:setUploading3},
                  ].map(({label,url,setUrl,uploading,setUploading}) => (
                    <div key={label} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-text">{label}</span>
                        {uploading && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                      </div>
                      <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setUrl, setUploading)}
                          className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800" />
                        {url && <img src={url} alt={label} className="size-10 rounded object-cover border border-slate-200" />}
                      </div>
                      <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                        placeholder="O pega la URL de la foto aquí"
                        className="w-full h-9 px-3 border border-slate-200 rounded-xl text-[11px] font-semibold focus:border-accent mt-2 bg-white outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Título del Anuncio</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Habitación amoblada cerca de la UNT, Trujillo"
                  className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent" />
                <span className="text-[10px] text-text-muted mt-1 block">Mín. 10 caracteres, máx. 80.</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Descripción Detallada</label>
                <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Habitación amplia con cama de 1.5 plazas, armario, escritorio y baño compartido. Agua caliente, Wi-Fi incluido. A 5 minutos caminando de la UNT..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent resize-none" />
                <span className="text-[10px] text-text-muted mt-1 block">Mín. 30 caracteres, máx. 600.</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Condiciones adicionales (Opcional)</label>
                <textarea rows={2} value={conditions} onChange={e => setConditions(e.target.value)}
                  placeholder="No se permiten fiestas. Pago puntual."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent resize-none" />
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => { setError(null); setStep(s => s - 1) }}
                className="h-11 px-5 border border-slate-200 rounded-xl text-xs font-bold text-text-muted hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer bg-white">
                <ArrowLeft01Icon size={16} /> Atrás
              </button>
            ) : <div />}

            {step < 5 ? (
              <button type="button" onClick={nextStep}
                className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border-0">
                Continuar <ArrowRight01Icon size={16} />
              </button>
            ) : (
              <button type="button" onClick={() => handleSubmit()} disabled={loading}
                className="h-12 px-6 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer border-0 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}>
                {loading
                  ? <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publicando…</>
                  : <><CheckmarkCircle01Icon size={16} /> Publicar Propiedad</>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
