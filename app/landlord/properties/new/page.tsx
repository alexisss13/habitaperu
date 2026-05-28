'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Home01Icon, 
  Cancel01Icon, 
  AlertCircleIcon, 
  CheckmarkCircle01Icon,
  LeftToRightListNumberIcon,
  ImageAdd01Icon,
  Location01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon
} from "hugeicons-react"
import { uploadImageAction } from "@/app/actions/upload-actions"
const DISTRICTS = [
  "Miraflores",
  "San Isidro",
  "Santiago de Surco",
  "San Borja",
  "La Molina",
  "Lince",
  "Jesús María",
  "Magdalena del Mar",
  "Barranco",
  "San Miguel",
  "Pueblo Libre",
  "Surquillo"
]

const AMENITIES_LIST = [
  { id: "wifi", label: "Wi-Fi de Alta Velocidad" },
  { id: "hot_water", label: "Agua Caliente" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "elevator", label: "Ascensor" },
  { id: "pets", label: "Mascotas Permitidas" },
  { id: "laundry", label: "Lavandería en Edificio" },
  { id: "terrace", label: "Terraza / Zona de Parrillas" },
  { id: "parking_visits", label: "Estacionamiento de Visitas" }
]

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form Field States
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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageUrl1, setImageUrl1] = useState("")
  const [imageUrl2, setImageUrl2] = useState("")
  const [imageUrl3, setImageUrl3] = useState("")
  const [uploading1, setUploading1] = useState(false)
  const [uploading2, setUploading2] = useState(false)
  const [uploading3, setUploading3] = useState(false)

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
        if (res.isMocked) {
          setError("Cloudinary no configurado. Se mantiene el simulador, por favor ingresa la URL de forma manual o usa fotos de prueba.")
        } else {
          setError(res.error || "Error al subir la imagen.")
        }
      }
    } catch (err) {
      console.error(err)
      setError("Error de conexión al subir la imagen.")
    } finally {
      setUploading(false)
    }
  }
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [conditions, setConditions] = useState("")

  const handleAmenityToggle = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const loadDemoImages = () => {
    setImageUrl1(DEMO_IMAGES[0])
    setImageUrl2(DEMO_IMAGES[1])
    setImageUrl3(DEMO_IMAGES[2])
  }

  const nextStep = () => {
    setError(null)
    if (step === 1 && (!type || !condition)) {
      setError("Por favor completa la información del paso 1.")
      return
    }
    if (step === 2 && (!district || !address)) {
      setError("Por favor selecciona un distrito e ingresa la dirección.")
      return
    }
    if (step === 3) {
      if (!price || Number(price) < 100) {
        setError("El precio mínimo de alquiler es S/ 100.")
        return
      }
      if (!rooms || Number(rooms) < 1) {
        setError("La propiedad debe tener al menos 1 habitación.")
        return
      }
      if (!bathrooms || Number(bathrooms) < 1) {
        setError("La propiedad debe tener al menos 1 baño.")
        return
      }
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError(null)
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Final step validations
    if (title.length < 10) {
      setError("El título del anuncio debe tener al menos 10 caracteres.")
      return
    }
    if (description.length < 30) {
      setError("La descripción debe tener al menos 30 caracteres para informar adecuadamente a los inquilinos.")
      return
    }

    setLoading(true)

    // Build image list
    const images: string[] = []
    if (imageUrl1.trim()) images.push(imageUrl1.trim())
    if (imageUrl2.trim()) images.push(imageUrl2.trim())
    if (imageUrl3.trim()) images.push(imageUrl3.trim())

    try {
      const payload = {
        title,
        description,
        type,
        condition,
        district,
        address: address || undefined,
        area: area ? Number(area) : undefined,
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        parking: Number(parking),
        price: Number(price),
        deposit: Number(deposit),
        minDuration: Number(minDuration),
        amenities: selectedAmenities,
        images: images.length > 0 ? images : undefined,
        conditions: conditions || undefined
      }

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/landlord/properties")
        router.refresh()
      } else {
        setError(data.error || "Ocurrió un error al guardar la propiedad.")
      }
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error inesperado al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10 px-4 md:px-6 max-w-2xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/landlord/properties" 
          className="text-xs font-bold text-text-muted hover:text-text no-underline flex items-center gap-1.5 transition-colors"
        >
          &larr; Volver a mis propiedades
        </Link>
      </div>

      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
        
        {/* Progress indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text">Publicar Nueva Propiedad</h1>
            <p className="text-xs text-text-muted mt-0.5">Paso {step} de 5</p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <div 
                key={s}
                className={`h-2 w-8 rounded-full transition-all ${
                  step >= s ? "bg-accent" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="p-6 md:p-8">
          
          {error && (
            <div className="bg-red/10 border border-red/20 text-red rounded-xl p-4 flex items-start gap-2.5 mb-6 text-xs font-medium">
              <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Type and condition */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Tipo de Inmueble</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "DEPARTAMENTO", label: "Departamento" },
                    { id: "CASA", label: "Casa" },
                    { id: "HABITACION", label: "Habitación" },
                    { id: "OFICINA", label: "Oficina" },
                    { id: "LOCAL", label: "Local Comercial" }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`h-14 px-3 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                        type === t.id 
                          ? "border-accent bg-accent/5 text-accent" 
                          : "border-slate-200 text-text-muted hover:border-slate-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Estado / Amoblado</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "SIN_MUEBLES", label: "Sin Muebles" },
                    { id: "SEMI_AMOBLADO", label: "Semi-amoblado" },
                    { id: "AMOBLADO", label: "Amoblado" }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCondition(c.id as any)}
                      className={`h-14 px-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                        condition === c.id 
                          ? "border-accent bg-accent/5 text-accent" 
                          : "border-slate-200 text-text-muted hover:border-slate-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Distrito</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                >
                  <option value="">-- Selecciona un distrito --</option>
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Dirección Exacta</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Larco 456, Dpto 502"
                  className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Core Features & Financials */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Precio Mensual (S/)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1800"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Meses de Garantía</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="1"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Vigencia Mínima (Meses)</label>
                  <input
                    type="number"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                    placeholder="12"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase">Área Total (m²)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="85"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Habitaciones</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Baños</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Estacionam.</label>
                  <input
                    type="number"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Amenities & Images */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Comodidades (Amenities)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES_LIST.map(a => (
                    <label 
                      key={a.id}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                        selectedAmenities.includes(a.id) 
                          ? "border-accent bg-accent/5" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(a.id)}
                        onChange={() => handleAmenityToggle(a.id)}
                        className="size-4 shrink-0 rounded text-accent focus:ring-accent"
                      />
                      <span className="text-xs font-bold text-text">{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider">Fotos de la Propiedad</h3>
                  <button
                    type="button"
                    onClick={loadDemoImages}
                    className="text-[10px] font-bold text-accent hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Usar fotos de prueba
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Image 1 */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-text">Foto Principal (Obligatoria)</span>
                      {uploading1 && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setImageUrl1, setUploading1)}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                      />
                      {imageUrl1 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl1} alt="Principal" className="size-10 rounded object-cover border border-slate-200" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={imageUrl1}
                      onChange={(e) => setImageUrl1(e.target.value)}
                      placeholder="O pega la URL de la foto principal aquí"
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl text-[11px] font-semibold focus:border-accent mt-2 bg-white"
                    />
                  </div>

                  {/* Image 2 */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-text">Foto Secundaria</span>
                      {uploading2 && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setImageUrl2, setUploading2)}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                      />
                      {imageUrl2 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl2} alt="Secundaria" className="size-10 rounded object-cover border border-slate-200" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={imageUrl2}
                      onChange={(e) => setImageUrl2(e.target.value)}
                      placeholder="O pega la URL de la foto secundaria aquí"
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl text-[11px] font-semibold focus:border-accent mt-2 bg-white"
                    />
                  </div>

                  {/* Image 3 */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-text">Foto Adicional</span>
                      {uploading3 && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setImageUrl3, setUploading3)}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                      />
                      {imageUrl3 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl3} alt="Adicional" className="size-10 rounded object-cover border border-slate-200" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={imageUrl3}
                      onChange={(e) => setImageUrl3(e.target.value)}
                      placeholder="O pega la URL de la foto adicional aquí"
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl text-[11px] font-semibold focus:border-accent mt-2 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Title & Description */}
          {step === 5 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Título del Anuncio</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Hermoso departamento de estreno en Miraflores"
                  className="w-full h-12 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent"
                />
                <span className="text-[10px] text-text-muted mt-1 block">Min. 10 caracteres, máx. 80.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Descripción Detallada</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Departamento amplio de 85m2 ubicado a 2 cuadras del Parque Kennedy. Cuenta con excelente iluminación natural, WiFi de alta velocidad, ideal para ejecutivos o parejas..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent resize-none"
                />
                <span className="text-[10px] text-text-muted mt-1 block">Min. 30 caracteres, máx. 600.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Condiciones adicionales (Opcional)</label>
                <textarea
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="No se permiten fiestas. Pago puntual."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:border-accent resize-none"
                />
              </div>
            </form>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="h-11 px-5 border border-slate-200 rounded-xl text-xs font-bold text-text-muted hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
              >
                <ArrowLeft01Icon size={16} />
                <span>Atrás</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border-0"
              >
                <span>Continuar</span>
                <ArrowRight01Icon size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="h-12 px-6 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-0"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publicando anuncio...</span>
                  </>
                ) : (
                  <>
                    <CheckmarkCircle01Icon size={16} />
                    <span>Publicar Propiedad</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
