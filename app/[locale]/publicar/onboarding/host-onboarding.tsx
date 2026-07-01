'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import {
  Home01Icon,
  Building02Icon,
  Store01Icon,
  Door01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Target01Icon,
  Cancel01Icon,
} from "hugeicons-react"

const PERU_CITIES = [
  "Lima", "Trujillo", "Chiclayo", "Arequipa", "Piura", "Cusco",
  "Ica", "Tacna", "Huancayo", "Iquitos", "Cajamarca", "Puno",
]

const PROPERTY_TYPES = [
  { id: "DEPARTAMENTO", label: "Departamento", Icon: Building02Icon },
  { id: "CASA", label: "Casa", Icon: Home01Icon },
  { id: "HABITACION", label: "Habitación", Icon: Door01Icon },
  { id: "OFICINA", label: "Oficina", Icon: Building02Icon },
  { id: "LOCAL", label: "Local Comercial", Icon: Store01Icon },
] as const

const CONDITIONS = [
  {
    id: "SIN_MUEBLES",
    label: "Sin muebles",
    description: "Entregas el espacio vacío, listo para que el inquilino lo amoble a su gusto.",
  },
  {
    id: "SEMI_AMOBLADO",
    label: "Semi-amoblado",
    description: "Incluye piezas básicas como cocina o closets, pero no muebles de sala ni dormitorio.",
  },
  {
    id: "AMOBLADO",
    label: "Amoblado",
    description: "El inquilino puede mudarse de inmediato: cama, muebles y electrodomésticos incluidos.",
  },
] as const

const TOTAL_STEPS = 3
const DRAFT_KEY = "habitaperu_onboarding_draft"

export function HostOnboarding({ locale }: { locale: string }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [step, setStep] = useState(1)
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [address, setAddress] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)

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

  const canAdvance =
    (step === 1 && district.trim().length > 0 && address.trim().length > 0) ||
    (step === 2 && type !== null) ||
    (step === 3 && condition !== null)

  const handleNext = () => {
    if (!canAdvance) return
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      return
    }

    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ city, district, address, lat, lng, type, condition })
    )

    const role = (session?.user as any)?.role
    if (status === "authenticated" && role === "LANDLORD") {
      router.push("/landlord/properties/new")
    } else {
      router.push(`/${locale}/register?role=LANDLORD`)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between h-14 md:h-[72px] px-6 max-w-7xl mx-auto">
          <Link href={`/${locale}`} className="flex items-center no-underline">
            <Image
              src="/habita-logo-horizontal.svg"
              alt="Habita Perú"
              width={180}
              height={48}
              className="h-9 w-auto md:h-12"
              priority
            />
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 no-underline hover:text-accent transition-colors"
          >
            <Cancel01Icon size={14} />
            Guardar y salir
          </Link>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[640px]">
          {step === 1 && (
            <div className="animate-fade-in">
              <p className="text-xs font-bold text-accent uppercase tracking-[0.1em] mb-3">Paso 1 de {TOTAL_STEPS}</p>
              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[#151c26] mb-3 -tracking-[0.02em]">
                ¿Dónde está ubicada tu propiedad?
              </h1>
              <p className="text-base text-gray-500 mb-8">
                Esta información solo se comparte con inquilinos una vez que reserven.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ciudad</label>
                  <select
                    className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-sm font-semibold focus:border-accent focus:outline-none cursor-pointer"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); if (!district) setDistrict(e.target.value) }}
                  >
                    <option value="">-- Selecciona --</option>
                    {PERU_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Distrito</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ej: Miraflores"
                    className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-sm font-semibold focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Dirección exacta</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. España 123, Dpto 202"
                className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-sm font-semibold focus:border-accent focus:outline-none mb-4"
              />

              {lat && lng ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <p className="text-xs font-bold text-emerald-700">Ubicación exacta registrada ({lat}, {lng})</p>
                  <button type="button" onClick={() => { setLat(""); setLng("") }}
                    className="text-[10px] font-bold text-emerald-600 border border-emerald-300 rounded-lg px-2.5 py-1 cursor-pointer bg-white">
                    Cambiar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locLoading}
                  className="inline-flex items-center gap-2 text-sm font-bold text-accent bg-transparent border-0 p-0 cursor-pointer disabled:opacity-60"
                >
                  <Target01Icon size={16} />
                  {locLoading ? "Detectando ubicación…" : "Usar mi ubicación actual"}
                </button>
              )}
              {locError && <p className="text-xs text-red-500 font-medium mt-2">{locError}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-xs font-bold text-accent uppercase tracking-[0.1em] mb-3">Paso 2 de {TOTAL_STEPS}</p>
              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[#151c26] mb-8 -tracking-[0.02em]">
                ¿Cuál de estas opciones describe mejor tu espacio?
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPES.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setType(id)}
                    className={`flex flex-col items-start gap-4 p-5 border rounded-2xl text-left transition-all cursor-pointer ${
                      type === id ? "border-accent border-2 bg-accent/5" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Icon size={26} className="text-[#151c26]" />
                    <span className="text-sm font-bold text-[#151c26]">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <p className="text-xs font-bold text-accent uppercase tracking-[0.1em] mb-3">Paso 3 de {TOTAL_STEPS}</p>
              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[#151c26] mb-8 -tracking-[0.02em]">
                ¿Cómo vas a entregar la propiedad?
              </h1>
              <div className="flex flex-col gap-3">
                {CONDITIONS.map(({ id, label, description }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCondition(id)}
                    className={`flex items-center justify-between gap-4 p-5 border rounded-2xl text-left transition-all cursor-pointer ${
                      condition === id ? "border-accent border-2 bg-accent/5" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#151c26] mb-1">{label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-[440px]">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
      <div className="flex items-center justify-between px-6 max-w-7xl mx-auto py-5">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#151c26] underline bg-transparent border-0 cursor-pointer p-0"
          >
            <ArrowLeft01Icon size={16} /> Atrás
          </button>
        ) : <div />}

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${step > i ? "bg-accent" : "bg-gray-200"}`} />
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-sm font-bold text-white cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: "linear-gradient(135deg, #0f3457 0%, #0a2540 100%)" }}
          >
            {step < TOTAL_STEPS ? "Siguiente" : "Continuar"}
            <ArrowRight01Icon size={16} />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
