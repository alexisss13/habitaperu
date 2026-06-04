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
  ctaLabel = "Pagar ahora",
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}>
          <div>
            <h3 className="font-bold text-white text-base">{title}</h3>
            <p className="text-white/70 text-xs mt-0.5">{description}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={state === "processing"}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-none cursor-pointer transition-colors disabled:opacity-50"
          >
            <Cancel01Icon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Monto */}
          <div className="text-center mb-6">
            <p className="text-4xl font-extrabold text-[#0f3457]">
              S/ {amount.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 mt-1">Pago único · No recurrente</p>
          </div>

          {/* Estado success */}
          {state === "success" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 mb-4">
              <CheckmarkCircle01Icon size={24} className="text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">¡Pago procesado!</p>
                <p className="text-emerald-600 text-xs">Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Estado error */}
          {state === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
              <AlertCircleIcon size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          {/* MODO SIMULACIÓN */}
          {isMockMode ? (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 mb-4">
                <FlashIcon size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-medium">
                  <span className="font-bold">Modo simulación activo.</span> No se realizará ningún cobro real.
                  Configura <code className="bg-amber-100 px-1 rounded">CULQI_SECRET_KEY</code> para activar pagos reales.
                </p>
              </div>

              {/* Tarjeta simulada (decorativa) */}
              <div
                className="rounded-xl p-4 mb-5 text-white"
                style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <CreditCardIcon size={22} className="text-white/80" />
                  <span className="text-xs font-bold text-white/60 tracking-widest">SIMULACIÓN</span>
                </div>
                <p className="text-lg font-bold tracking-widest mb-1">4111 1111 1111 1111</p>
                <div className="flex justify-between text-xs text-white/70">
                  <span>Usuario Demo</span>
                  <span>12/28 · CVV 123</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleMockPay(false)}
                  disabled={state === "processing" || state === "success"}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 border-none cursor-pointer transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
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
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50"
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
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <SecurityCheckIcon size={13} />
            <span>Pago seguro · Habita Perú no almacena datos de tarjetas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
