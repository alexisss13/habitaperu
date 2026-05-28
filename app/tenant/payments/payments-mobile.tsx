"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CreditCardIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon, 
  ImageAdd01Icon 
} from "hugeicons-react"
import { submitPaymentReceipt } from "@/app/actions/payment-actions"
import type { TenantPaymentItem } from "./payments-view"

interface Props {
  payments: TenantPaymentItem[]
}

export function TenantPaymentsMobile({ payments }: Props) {
  const router = useRouter()
  
  // State for upload receipt modal
  const [selectedPayment, setSelectedPayment] = useState<TenantPaymentItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("BCP")
  const [receiptUrl, setReceiptUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState(false)

  // State for previewing receipt modal
  const [previewPayment, setPreviewPayment] = useState<TenantPaymentItem | null>(null)

  // Calculate metrics
  const totalPaid = payments
    .filter(p => p.status === "PAGADO")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingPayments = payments.filter(p => ["PENDIENTE", "VENCIDO"].includes(p.status))
  const nextPayment = pendingPayments.length > 0 
    ? pendingPayments[pendingPayments.length - 1] 
    : null

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getMonthName = (isoString: string) => {
    const formatted = new Date(isoString).toLocaleDateString("es-PE", {
      month: "long",
      year: "numeric",
    })
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAGADO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Pagado</span>
      case "EN_PROCESO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">En Proceso</span>
      case "PENDIENTE":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded">Pendiente</span>
      case "VENCIDO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-red/10 text-red border border-red/20 rounded animate-pulse">Vencido</span>
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  const handleSimulateFile = () => {
    const mockReceipts = [
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80"
    ]
    const randomReceipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)]
    setReceiptUrl(randomReceipt)
  }

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayment) return
    if (!receiptUrl.trim()) {
      setModalError("Por favor adjunte el comprobante de pago.")
      return
    }

    setModalError(null)
    setIsSubmitting(true)

    try {
      const res = await submitPaymentReceipt(selectedPayment.id, paymentMethod, receiptUrl, notes)
      if (res.success) {
        setModalSuccess(true)
        setTimeout(() => {
          setSelectedPayment(null)
          setModalSuccess(false)
          setReceiptUrl("")
          setNotes("")
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Error al enviar el comprobante.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error inesperado al subir.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-2 pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text">Mis Pagos</h1>
        <p className="text-xs font-medium text-text-muted mt-1">Registra y consulta tus cuotas mensuales</p>
      </div>

      {/* Metrics horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 mb-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Próximo Pago</p>
          {nextPayment ? (
            <>
              <p className="text-lg font-bold text-[#151c26]">S/ {nextPayment.amount}</p>
              <p className="text-[9px] text-text-muted mt-0.5">Vence: {formatLocalDate(nextPayment.dueDate)}</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-emerald-600">Al día</p>
              <p className="text-[9px] text-text-muted mt-0.5">Sin pagos pendientes</p>
            </>
          )}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Estado Cuenta</p>
          {pendingPayments.some(p => p.status === "VENCIDO") ? (
            <p className="text-lg font-bold text-red">Atrasado</p>
          ) : pendingPayments.length > 0 ? (
            <p className="text-lg font-bold text-amber-600">Pendiente</p>
          ) : (
            <p className="text-lg font-bold text-emerald-600 font-bold">Al día</p>
          )}
          <p className="text-[9px] text-text-muted mt-0.5">{pendingPayments.length} pendientes</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Total Abonado</p>
          <p className="text-lg font-bold text-emerald-700">S/ {totalPaid.toLocaleString()}</p>
          <p className="text-[9px] text-text-muted mt-0.5">Alquileres liquidados</p>
        </div>
      </div>

      {/* Payment Cards List */}
      <div className="px-4 space-y-3">
        {payments.length > 0 ? (
          payments.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-text truncate max-w-[200px]">{p.propertyName}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Cuota: {getMonthName(p.dueDate)}</p>
                </div>
                {getStatusBadge(p.status)}
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-text-muted">
                <span>Vence: {formatLocalDate(p.dueDate)}</span>
                <span className="text-sm font-extrabold text-[#151c26]">S/ {p.amount.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                {["PENDIENTE", "VENCIDO"].includes(p.status) && (
                  <button
                    onClick={() => setSelectedPayment(p)}
                    className="w-full h-10 bg-accent text-white rounded-lg font-bold text-xs cursor-pointer border-0 shadow-sm"
                  >
                    Pagar / Reportar Voucher
                  </button>
                )}
                {["EN_PROCESO", "PAGADO"].includes(p.status) && (
                  <button
                    onClick={() => setPreviewPayment(p)}
                    className="w-full h-10 border border-slate-200 text-slate-700 rounded-lg font-bold text-xs cursor-pointer bg-white"
                  >
                    Ver Detalles / Voucher
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl px-4">
            <CreditCardIcon size={36} className="text-slate-300 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-text mb-1">Sin historial</h4>
            <p className="text-[10px] text-text-muted">No registras cuotas creadas.</p>
          </div>
        )}
      </div>

      {/* MOBILE MODAL 1: Subir Comprobante */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-text">Pagar Cuota</h3>
                <p className="text-[10px] text-text-muted mt-0.5">{getMonthName(selectedPayment.dueDate)} • S/ {selectedPayment.amount}</p>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4 pb-8">
              {modalError && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <CheckmarkCircle01Icon size={14} className="shrink-0 mt-0.5" />
                  <span>¡Enviado con éxito!</span>
                </div>
              )}

              {/* Instructions */}
              <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 text-[11px] leading-relaxed">
                <span className="font-bold text-amber-900 block mb-0.5">🏦 Transferencia requerida:</span>
                {(() => {
                  let paymentAccount = {
                    provider: "BCP",
                    accountNumber: "Consultar con el arrendador",
                    accountHolder: "Propietario"
                  }
                  try {
                    const parsed = selectedPayment.contractTerms ? JSON.parse(selectedPayment.contractTerms) : null
                    if (parsed?.paymentAccount) {
                      paymentAccount = parsed.paymentAccount
                    }
                  } catch {}
                  return (
                    <p className="text-amber-800">
                      Transfiere <strong>S/ {selectedPayment.amount}</strong> a la cuenta <strong>{paymentAccount.provider}</strong> N° <strong>{paymentAccount.accountNumber}</strong> a nombre de <strong>{paymentAccount.accountHolder}</strong>.
                    </p>
                  )
                })()}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted mb-1.5 uppercase">Método</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                >
                  <option value="BCP">Banco de Crédito (BCP)</option>
                  <option value="BBVA">Banco BBVA</option>
                  <option value="Interbank">Interbank</option>
                  <option value="YAPE">Yape</option>
                  <option value="PLIN">Plin</option>
                  <option value="OTRO">Otro / Transferencia</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-text-muted uppercase">Voucher (Carga de Foto)</label>
                  <button
                    type="button"
                    onClick={handleSimulateFile}
                    className="text-[9px] text-accent hover:underline bg-transparent border-0 cursor-pointer font-bold"
                  >
                    Simular Carga
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    placeholder="URL del voucher"
                    className="w-full h-11 pl-3 pr-10 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ImageAdd01Icon size={16} />
                  </div>
                </div>

                {receiptUrl && (
                  <div className="mt-3 border border-slate-100 rounded-xl p-2 bg-slate-50 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiptUrl} alt="Comprobante" className="size-10 rounded object-cover border border-slate-200" />
                    <div>
                      <p className="text-[10px] font-bold text-text">voucher.png</p>
                      <p className="text-[9px] text-text-muted">Simulado</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted mb-1.5 uppercase">Comentarios (Opcional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mensaje al arrendador..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || modalSuccess}
                  className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  {isSubmitting ? "Registrando..." : "Registrar Pago"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="w-full h-11 border border-slate-200 bg-white rounded-xl text-xs font-bold text-text-muted cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MOBILE MODAL 2: Ver Detalles */}
      {previewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-text">Detalle de Pago</h3>
                <p className="text-[10px] text-text-muted mt-0.5">{previewPayment.propertyName} • Cuota {getMonthName(previewPayment.dueDate)}</p>
              </div>
              <button 
                onClick={() => setPreviewPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 pb-8 text-xs font-semibold text-text">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Monto:</span>
                  <span className="font-extrabold text-sm">S/ {previewPayment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Estado:</span>
                  <span>{getStatusBadge(previewPayment.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Vencimiento:</span>
                  <span>{formatLocalDate(previewPayment.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Fecha de Pago:</span>
                  <span>{previewPayment.paidDate ? formatLocalDate(previewPayment.paidDate) : "—"}</span>
                </div>
              </div>

              {previewPayment.receipt && (
                <div className="space-y-2.5">
                  <span className="text-[10px] text-text-muted uppercase block">Voucher</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden relative h-40 bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewPayment.receipt} 
                      alt="Comprobante" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Método:</span>
                      <span>{previewPayment.paymentMethod || "—"}</span>
                    </div>
                    {previewPayment.notes && (
                      <div className="pt-1.5 border-t border-slate-150 mt-1">
                        <span className="text-text-muted block mb-0.5">Notas:</span>
                        <p className="font-normal text-text leading-normal">{previewPayment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPreviewPayment(null)}
                className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 mt-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
