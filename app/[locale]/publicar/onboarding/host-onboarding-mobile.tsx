'use client'

import Link from "next/link"
import { useLocale } from "@/lib/i18n-context"
import { Combobox } from "@/components/ui/combobox"
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Target01Icon,
  Cancel01Icon,
} from "hugeicons-react"
import { useHostOnboarding, PROPERTY_TYPES, CONDITIONS, TOTAL_STEPS } from "./use-host-onboarding"

const STEP_TITLES: Record<number, string> = {
  1: "Ubicación",
  2: "Tipo de espacio",
  3: "Entrega",
}

export function HostOnboardingMobile() {
  const locale = useLocale()
  const {
    step, goBack,
    city, setCity,
    district, setDistrict,
    address, setAddress,
    lat, lng, locLoading, locError, handleGetLocation, clearLocation,
    type, setType,
    condition, setCondition,
    cities, citiesLoading,
    districts, districtsLoading,
    canAdvance, handleNext,
  } = useHostOnboarding()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed header */}
      <div className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Atrás"
              className="size-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted cursor-pointer shrink-0"
            >
              <ArrowLeft01Icon size={16} />
            </button>
          ) : <div className="size-8 shrink-0" />}

          <h1 className="text-[0.9375rem] font-semibold text-[#151c26] m-0">{STEP_TITLES[step]}</h1>

          <Link
            href={`/${locale}`}
            aria-label="Guardar y salir"
            className="size-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted no-underline shrink-0"
          >
            <Cancel01Icon size={14} />
          </Link>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-20 pb-28">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-extrabold text-[#151c26] mb-2 leading-tight tracking-tight">
              ¿Dónde está ubicada tu propiedad?
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Esta información solo se comparte con inquilinos una vez que reserven.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ciudad</label>
                <Combobox
                  value={city}
                  onChange={setCity}
                  options={cities}
                  loading={citiesLoading}
                  placeholder="Escribe o elige una ciudad"
                  className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-base font-semibold focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Distrito</label>
                <Combobox
                  value={district}
                  onChange={setDistrict}
                  options={districts}
                  loading={districtsLoading}
                  placeholder="Ej: Miraflores"
                  emptyLabel={city.trim() ? "Distrito nuevo, se agregará al escribirlo." : "Primero elige una ciudad."}
                  className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-base font-semibold focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Dirección exacta</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. España 123, Dpto 202"
                  className="w-full h-14 px-4 border border-gray-200 rounded-2xl text-base font-semibold focus:border-accent focus:outline-none"
                />
              </div>

              {lat && lng ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <p className="text-xs font-bold text-emerald-700">Ubicación registrada</p>
                  <button type="button" onClick={clearLocation}
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
              {locError && <p className="text-xs text-red-500 font-medium">{locError}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-extrabold text-[#151c26] mb-6 leading-tight tracking-tight">
              ¿Cuál de estas opciones describe mejor tu espacio?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setType(id)}
                  className={`flex flex-col items-start gap-3 p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                    type === id ? "border-accent border-2 bg-accent/5" : "border-gray-200"
                  }`}
                >
                  <Icon size={24} className="text-[#151c26]" />
                  <span className="text-sm font-bold text-[#151c26]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-extrabold text-[#151c26] mb-6 leading-tight tracking-tight">
              ¿Cómo vas a entregar la propiedad?
            </h2>
            <div className="flex flex-col gap-3">
              {CONDITIONS.map(({ id, label, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCondition(id)}
                  className={`flex items-center justify-between gap-4 p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                    condition === id ? "border-accent border-2 bg-accent/5" : "border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#151c26] mb-1">{label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[100] bg-white border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className="w-full h-14 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: "linear-gradient(135deg, #0f3457 0%, #0a2540 100%)" }}
        >
          {step < TOTAL_STEPS ? "Siguiente" : "Continuar"}
          <ArrowRight01Icon size={16} />
        </button>
      </div>
    </div>
  )
}
