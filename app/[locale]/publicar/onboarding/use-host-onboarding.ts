'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home01Icon,
  Building02Icon,
  Store01Icon,
  Door01Icon,
} from "hugeicons-react"
import { useCityDistrictOptions } from "@/hooks/useCityDistrictOptions"

export const PROPERTY_TYPES = [
  { id: "DEPARTAMENTO", label: "Departamento", Icon: Building02Icon },
  { id: "CASA", label: "Casa", Icon: Home01Icon },
  { id: "HABITACION", label: "Habitación", Icon: Door01Icon },
  { id: "OFICINA", label: "Oficina", Icon: Building02Icon },
  { id: "LOCAL", label: "Local Comercial", Icon: Store01Icon },
] as const

export const CONDITIONS = [
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

export const TOTAL_STEPS = 3
const DRAFT_KEY = "habitaperu_onboarding_draft"

export function useHostOnboarding() {
  const router = useRouter()

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
  const { cities, citiesLoading, districts, districtsLoading } = useCityDistrictOptions(city)

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

  const goBack = () => setStep((s) => Math.max(1, s - 1))

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

    // Para cuando se llega aquí ya se pasó el guard de /publicar/onboarding:
    // hay sesión y el rol es LANDLORD, así que se va directo al formulario.
    router.push("/landlord/properties/new")
  }

  return {
    step, goBack,
    city, setCity,
    district, setDistrict,
    address, setAddress,
    lat, lng, locLoading, locError, handleGetLocation, clearLocation: () => { setLat(""); setLng("") },
    type, setType,
    condition, setCondition,
    cities, citiesLoading,
    districts, districtsLoading,
    canAdvance, handleNext,
  }
}
