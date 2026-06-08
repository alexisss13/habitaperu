'use client'

import { useState } from "react"
import { CheckmarkCircle01Icon, Cancel01Icon, FlashIcon, Building03Icon, StarIcon } from "hugeicons-react"
import { PaymentModal } from "./payment-modal"
import { processPlanUpgrade } from "@/app/actions/culqi-actions"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (plan: "PRO" | "BUSINESS") => void
  currentPlan: string
  isMockMode: boolean
  propertyCount?: number
}

const PLANS = [
  {
    key: "FREE" as const,
    label: "Gratis",
    price: "S/ 0",
    period: "siempre",
    icon: Building03Icon,
    color: "slate",
    limit: "Hasta 3 propiedades",
    features: [
      "Contratos digitales ilimitados",
      "Verificación KYC de inquilinos",
      "Panel de gestión",
      "Ver contrato en pantalla",
    ],
    missing: ["Descarga PDF del contrato", "Analítica avanzada", "Soporte prioritario"],
  },
  {
    key: "PRO" as const,
    label: "Pro",
    price: "S/ 49",
    period: "/mes",
    icon: FlashIcon,
    color: "accent",
    limit: "Hasta 10 propiedades",
    features: [
      "Todo lo del plan Gratis",
      "Descarga PDF legal del contrato",
      "Hasta 10 propiedades activas",
      "1 destacado mensual incluido",
      "Soporte prioritario",
    ],
    missing: [],
  },
  {
    key: "BUSINESS" as const,
    label: "Business",
    price: "S/ 129",
    period: "/mes",
    icon: StarIcon,
    color: "amber",
    limit: "Propiedades ilimitadas",
    features: [
      "Todo lo del plan Pro",
      "Propiedades ilimitadas",
      "Badge «Arrendador Verificado»",
      "Onboarding asistido",
      "Analítica avanzada de vistas",
    ],
    missing: [],
  },
]

export function PlanUpgradeModal({ isOpen, onClose, onSuccess, currentPlan, isMockMode, propertyCount }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<"PRO" | "BUSINESS" | null>(null)

  if (!isOpen) return null

  const upgradeable = PLANS.filter(p => p.key !== "FREE")

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#151c26]">Elige tu plan</h2>
              {propertyCount !== undefined && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Tienes {propertyCount} {propertyCount === 1 ? "propiedad" : "propiedades"} — plan actual: <span className="font-bold text-accent">{currentPlan}</span>
                </p>
              )}
            </div>
            <button onClick={onClose} className="cursor-pointer bg-transparent border-0 text-slate-400 hover:text-slate-600">
              <Cancel01Icon size={20} />
            </button>
          </div>

          {/* Plans grid */}
          <div className="p-6 grid grid-cols-3 gap-4">
            {PLANS.map(plan => {
              const Icon = plan.icon
              const isCurrent = currentPlan === plan.key
              const isUpgrade = plan.key !== "FREE"
              return (
                <div
                  key={plan.key}
                  className={`rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${
                    isCurrent
                      ? "border-accent bg-accent/5"
                      : isUpgrade
                        ? "border-slate-200 hover:border-accent/50 cursor-pointer"
                        : "border-slate-100 bg-slate-50 opacity-60"
                  }`}
                  onClick={() => isUpgrade && !isCurrent ? setSelectedPlan(plan.key as "PRO" | "BUSINESS") : undefined}
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-lg flex items-center justify-center ${
                      plan.key === "FREE" ? "bg-slate-100" :
                      plan.key === "PRO" ? "bg-accent/10" : "bg-amber-50"
                    }`}>
                      <Icon size={16} className={
                        plan.key === "FREE" ? "text-slate-400" :
                        plan.key === "PRO" ? "text-accent" : "text-amber-500"
                      } />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#151c26]">{plan.label}</p>
                      <p className="text-[10px] text-slate-400">{plan.limit}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xl font-extrabold text-[#151c26]">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <ul className="space-y-1.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-[10px] text-slate-600">
                        <CheckmarkCircle01Icon size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.missing.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-[10px] text-slate-300 line-through">
                        <Cancel01Icon size={11} className="shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent && (
                    <span className="text-[10px] font-bold text-accent bg-accent/10 rounded-lg px-2 py-1 text-center">
                      Plan actual
                    </span>
                  )}
                  {isUpgrade && !isCurrent && (
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedPlan(plan.key as "PRO" | "BUSINESS") }}
                      className={`text-[11px] font-bold rounded-lg px-3 py-2 border-0 cursor-pointer transition-colors ${
                        plan.key === "PRO"
                          ? "bg-accent text-white hover:opacity-90"
                          : "bg-amber-400 text-amber-900 hover:opacity-90"
                      }`}
                    >
                      Activar {plan.label}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {isMockMode && (
            <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[11px] text-amber-700 font-medium">
              Modo simulación activo. No se realizará ningún cobro real.
            </div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => {
            setSelectedPlan(null)
            onSuccess(selectedPlan)
            onClose()
          }}
          amount={selectedPlan === "PRO" ? 49 : 129}
          title={`Plan ${selectedPlan}`}
          description={selectedPlan === "PRO" ? "Hasta 10 propiedades · PDF contratos · 1 destacado/mes" : "Propiedades ilimitadas · Todo Pro · Badge verificado"}
          ctaLabel={`Activar Plan ${selectedPlan} — S/ ${selectedPlan === "PRO" ? "49" : "129"}/mes`}
          isMockMode={isMockMode}
          onProcessPayment={(token) => processPlanUpgrade(selectedPlan, token)}
        />
      )}
    </>
  )
}
