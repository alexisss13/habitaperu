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
  LockIcon,
} from "hugeicons-react"

/// Tarjeta de prueba que simula un rechazo (misma convención que usan
/// pasarelas reales como Stripe/Culqi con tarjetas terminadas en 0002).
const DECLINE_TEST_CARD = "4000000000000002"

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

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
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111")
  const [cardName, setCardName] = useState("Usuario Demo")
  const [cardExpiry, setCardExpiry] = useState("12/28")
  const [cardCvv, setCardCvv] = useState("123")

  if (!isOpen) return null

  const handleMockPay = async (simulateFailure = false) => {
    setState("processing")
    setErrorMsg("")

    // Simular latencia de red hacia la pasarela antes de resolver, para que
    // el formulario se sienta como un checkout real y no un botón instantáneo.
    await new Promise(r => setTimeout(r, 900))

    if (simulateFailure) {
      setState("error")
      setErrorMsg("Pago rechazado: fondos insuficientes en la tarjeta de prueba.")
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

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const digitsOnly = cardNumber.replace(/\D/g, "")
    const simulateFailure = digitsOnly === DECLINE_TEST_CARD
    handleMockPay(simulateFailure)
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

              {/* Formulario de tarjeta — pide los datos como un checkout real,
                  pero el envío siempre resuelve en modo simulado (no se cobra
                  nada ni se contacta a ninguna pasarela real). */}
              <form onSubmit={handleMockSubmit} className="flex flex-col gap-3.5 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Número de tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      required
                      disabled={state === "processing" || state === "success"}
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-mono tracking-wider outline-none focus:border-accent bg-slate-50 transition-colors disabled:opacity-60"
                    />
                    <CreditCardIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nombre del titular
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Como aparece en la tarjeta"
                    required
                    disabled={state === "processing" || state === "success"}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-accent bg-slate-50 transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      required
                      disabled={state === "processing" || state === "success"}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-accent bg-slate-50 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      required
                      disabled={state === "processing" || state === "success"}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-accent bg-slate-50 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state === "processing" || state === "success"}
                  className="w-full mt-1.5 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 border-none cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-emerald-600/20"
                >
                  {state === "processing" ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <LockIcon size={15} />
                      Pagar S/ {amount.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                  Datos de prueba precargados, no se realiza ningún cobro real.
                  Para simular un rechazo, usa la tarjeta <span className="font-mono font-semibold text-slate-500">4000 0000 0000 0002</span>.
                </p>
              </form>
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
