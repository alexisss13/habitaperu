'use client'

/**
 * components/ui/payment-modal.tsx
 *
 * Modal de pago reutilizable para todos los cobros de Habita Perú.
 *
 * MODO SIMULACIÓN (sin Culqi configurado):
 *   Muestra una interfaz de pago falsa con botones para simular
 *   éxito o fallo. Útil para desarrollo y demos.
 *
 * MODO REAL (con CULQI_PUBLIC_KEY configurado):
 *   Carga Culqi.js y procesa el pago con la API real.
 */

import { useState } from "react"
import {
  Cancel01Icon,
  CreditCardIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  FlashIcon,
  SecurityCheckIcon,
} from "hugeicons-react"

export interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  /** Precio en soles (ej: 29, 9.90, 25) */
  amount: number
  title: string
  description: string
  ctaLabel?: string
  isMockMode: boolean
  /** Función que ejecuta el server action correspondiente */
  onProcessPayment: (token: string) => Promise<{ success: boolean; error?: string }>
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  title,
  description,
  isMockMode,
  onProcessPayment,
}: PaymentModalProps) {
  const [state, setState] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleMockPay = async (simulateFailure = false) => {
    setState("processing")
    setErrorMsg("")

    if (simulateFailure) {
      await new Promise(r => setTimeout(r, 1000))
      setState("error")
      setErrorMsg("Simulación de pago fallido: fondos insuficientes.")
      return
    }

    const res = await onProcessPayment("mock_token")

    if (res.success) {
      setState("success")
      setTimeout(() => {
        onSuccess()
        setState("idle")
        onClose()
      }, 1800)
    } else {
      setState("error")
      setErrorMsg(res.error ?? "Error al procesar el pago.")
    }
  }

  const handleClose = () => {
    if (state === "processing") return
    setState("idle")
    setErrorMsg("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">

        {/* Header */}
        <div
          className="relative px-6 py-5 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f3457 0%, #163a5c 60%, #8f8272 100%)" }}
        >
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/5" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <CreditCardIcon size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm leading-tight">{title}</h3>
                <p className="text-white/70 text-xs mt-0.5 leading-snug">{description}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={state === "processing"}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-none cursor-pointer transition-colors disabled:opacity-50 shrink-0"
            >
              <Cancel01Icon size={16} />
            </button>
          </div>
        </div>

        {/* Monto */}
        <div className="text-center pt-6 pb-5 px-6 border-b border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-1.5">Monto a pagar</p>
          <p className="text-[2.75rem] leading-none font-extrabold text-[#0f3457] tracking-tight">
            S/ {amount.toFixed(2)}
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
            Pago único · No recurrente
          </span>
        </div>

        {/* Body */}
        <div className="p-6 pt-5">

          {/* Estado success */}
          {state === "success" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 mb-4">
              <div className="size-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <CheckmarkCircle01Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-sm">¡Pago procesado!</p>
                <p className="text-emerald-600 text-xs">Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Estado error */}
          {state === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
              <div className="size-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircleIcon size={18} className="text-red-500" />
              </div>
              <p className="text-red-700 text-sm font-medium pt-1.5">{errorMsg}</p>
            </div>
          )}

          {/* MODO SIMULACIÓN */}
          {isMockMode ? (
            <div>
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-5">
                <FlashIcon size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-medium leading-relaxed">
                  <span className="font-bold">Modo simulación activo.</span> No se realizará ningún cobro real.
                  Configura <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">CULQI_SECRET_KEY</code> para activar pagos reales.
                </p>
              </div>

              {/* Tarjeta simulada (decorativa) — estilo tarjeta física, distinto del gradiente de marca */}
              <div className="relative rounded-2xl p-5 mb-5 text-white overflow-hidden shadow-lg"
                style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
              >
                <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-white/5" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-7">
                    <div className="w-9 h-6.5 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-sm" />
                    <span className="text-[10px] font-bold text-white/50 tracking-[0.15em]">SIMULACIÓN</span>
                  </div>
                  <p className="text-lg font-semibold tracking-[0.2em] mb-5 font-mono">4111 1111 1111 1111</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] uppercase text-white/40 tracking-wider mb-0.5">Titular</p>
                      <p className="text-[11px] font-semibold text-white/90">Usuario Demo</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-white/40 tracking-wider mb-0.5">Vence</p>
                      <p className="text-[11px] font-semibold text-white/90">12/28</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-white/40 tracking-wider mb-0.5">CVV</p>
                      <p className="text-[11px] font-semibold text-white/90">123</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleMockPay(false)}
                  disabled={state === "processing" || state === "success"}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 border-none cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-emerald-600/20"
                >
                  {state === "processing" ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckmarkCircle01Icon size={16} />
                      Simular pago exitoso — S/ {amount.toFixed(2)}
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleMockPay(true)}
                  disabled={state === "processing" || state === "success"}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-none bg-transparent cursor-pointer transition-colors disabled:opacity-50"
                >
                  Simular pago fallido (para pruebas)
                </button>
              </div>
            </div>
          ) : (
            /* MODO REAL — formulario de Culqi */
            <div>
              <p className="text-center text-slate-500 text-sm mb-4">
                Integración con Culqi activa. El formulario de pago se cargará aquí.
              </p>
              {/* TODO: Cargar Culqi.js y renderizar el formulario de tarjeta */}
              <div id="culqi-container" className="mb-4" />
              <button
                disabled
                className="w-full py-3 rounded-xl font-bold text-sm text-white/60 bg-slate-300 cursor-not-allowed"
              >
                Pagar S/ {amount.toFixed(2)}
              </button>
            </div>
          )}

          {/* Seguridad */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
            <SecurityCheckIcon size={13} />
            <span>Pago seguro · Habita Perú no almacena datos de tarjetas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
