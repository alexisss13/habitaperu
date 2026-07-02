"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CreditCardIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon
} from "hugeicons-react"
import { approvePayment, rejectPayment } from "@/app/actions/payment-actions"
import type { LandlordPaymentItem } from "./payments-view"

interface Props {
  payments: LandlordPaymentItem[]
}

export function LandlordPaymentsMobile({ payments }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("TODOS")
  const [searchQuery, setSearchQuery] = useState("")

  // Modals state
  const [reviewPayment, setReviewPayment] = useState<LandlordPaymentItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  const [viewPayment, setViewPayment] = useState<LandlordPaymentItem | null>(null)
  const [reminderPayment, setReminderPayment] = useState<LandlordPaymentItem | null>(null)
  const [isSendingReminder, setIsSendingReminder] = useState(false)
  const [reminderSuccess, setReminderSuccess] = useState(false)

  // Calculations
  const totalReceived = payments
    .filter(p => p.status === "PAGADO")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingApprovalsCount = payments.filter(p => p.status === "EN_PROCESO").length
  const overdueCount = payments.filter(p => p.status === "VENCIDO").length

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAGADO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Verificado</span>
      case "EN_PROCESO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded animate-pulse">Por Aprobar</span>
      case "PENDIENTE":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded">Pendiente</span>
      case "VENCIDO":
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-red/10 text-red border border-red/20 rounded">Atrasado</span>
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.propertyDistrict.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    if (filter === "TODOS") return true
    if (filter === "APROBADOS") return p.status === "PAGADO"
    if (filter === "POR_APROBAR") return p.status === "EN_PROCESO"
    if (filter === "VENCIDOS") return p.status === "VENCIDO"
    if (filter === "PENDIENTES") return p.status === "PENDIENTE"
    
    return true
  })

  const handleApprove = async () => {
    if (!reviewPayment) return
    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await approvePayment(reviewPayment.id)
      if (res.success) {
        setModalSuccess("¡Aprobado con éxito!")
        setTimeout(() => {
          setReviewPayment(null)
          setModalSuccess(null)
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Error al aprobar.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error al conectar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewPayment) return
    if (!rejectionReason.trim()) {
      setModalError("Ingrese el motivo del rechazo.")
      return
    }

    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await rejectPayment(reviewPayment.id, rejectionReason)
      if (res.success) {
        setModalSuccess("¡Pago rechazado!")
        setTimeout(() => {
          setReviewPayment(null)
          setRejectionReason("")
          setRejectMode(false)
          setModalSuccess(null)
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Error al rechazar.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error al conectar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendReminder = () => {
    if (!reminderPayment) return
    setIsSendingReminder(true)
    setTimeout(() => {
      setIsSendingReminder(false)
      setReminderSuccess(true)
      setTimeout(() => {
        setReminderPayment(null)
        setReminderSuccess(false)
      }, 1500)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-bg-2 pb-24">
      {/* Metrics horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pt-6 pb-4 scrollbar-hide -mx-4 px-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Recaudado</p>
          <p className="text-lg font-bold text-emerald-600">S/ {totalReceived.toLocaleString()}</p>
          <p className="text-[9px] text-text-muted mt-0.5">Cobros aprobados</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Por Aprobar</p>
          <p className="text-lg font-bold text-indigo-600">{pendingApprovalsCount}</p>
          <p className="text-[9px] text-text-muted mt-0.5">Vouchers en revisión</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shrink-0 w-44">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Atrasados</p>
          <p className="text-lg font-bold text-red">{overdueCount}</p>
          <p className="text-[9px] text-text-muted mt-0.5">Inquilinos vencidos</p>
        </div>
      </div>

      {/* Search & Filter select */}
      <div className="px-4 space-y-3 mb-4">
        <input 
          type="text" 
          placeholder="Buscar por inquilino, dpto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent outline-none"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {[
            { key: "TODOS", label: "Todos" },
            { key: "POR_APROBAR", label: "Por Aprobar" },
            { key: "VENCIDOS", label: "Atrasados" },
            { key: "APROBADOS", label: "Verificados" },
            { key: "PENDIENTES", label: "Pendientes" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg shrink-0 transition-all border border-slate-200 cursor-pointer ${
                filter === tab.key 
                  ? "bg-[#151c26] text-white border-[#151c26]" 
                  : "bg-white text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of payments */}
      <div className="px-4 space-y-3">
        {filteredPayments.length > 0 ? (
          filteredPayments.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-text truncate max-w-[200px]">{p.propertyName}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Inquilino: {p.tenantName}</p>
                </div>
                {getStatusBadge(p.status)}
              </div>

              <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted border-t border-b border-slate-50 py-2">
                <span>Vence: {formatLocalDate(p.dueDate)}</span>
                <span className="text-xs font-extrabold text-[#151c26]">S/ {p.amount.toLocaleString()}</span>
              </div>

              <div className="flex justify-end">
                {p.status === "EN_PROCESO" && (
                  <button
                    onClick={() => {
                      setReviewPayment(p)
                      setRejectMode(false)
                      setRejectionReason("")
                    }}
                    className="w-full h-10 bg-accent text-white rounded-lg font-bold text-xs cursor-pointer border-0 shadow-sm animate-pulse"
                  >
                    Revisar Pago
                  </button>
                )}
                {p.status === "VENCIDO" && (
                  <button
                    onClick={() => setReminderPayment(p)}
                    className="w-full h-10 border border-red text-red rounded-lg font-bold text-xs cursor-pointer bg-white"
                  >
                    Recordar Pago
                  </button>
                )}
                {["PAGADO"].includes(p.status) && (
                  <button
                    onClick={() => setViewPayment(p)}
                    className="w-full h-10 border border-slate-200 text-slate-700 rounded-lg font-bold text-xs cursor-pointer bg-white"
                  >
                    Ver Detalles / Voucher
                  </button>
                )}
                {p.status === "PENDIENTE" && (
                  <span className="text-[10px] text-slate-400 font-semibold italic w-full text-center py-2">Esperando pago del inquilino</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <CreditCardIcon size={36} className="text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-text mb-0.5">Sin pagos</p>
            <p className="text-[10px] text-text-muted">No se registran transacciones.</p>
          </div>
        )}
      </div>

      {/* MOBILE MODAL 1: Revisar Comprobante */}
      {reviewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-text">Revisar Comprobante</h3>
                <p className="text-[10px] text-text-muted mt-0.5">{reviewPayment.tenantName} • S/ {reviewPayment.amount}</p>
              </div>
              <button 
                onClick={() => setReviewPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 pb-8">
              {modalError && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <CheckmarkCircle01Icon size={14} className="shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-text bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-[9px] text-text-muted uppercase block">Monto</span>
                  <span className="font-extrabold text-sm">S/ {reviewPayment.amount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-muted uppercase block">Método</span>
                  <span>{reviewPayment.paymentMethod || "No especificado"}</span>
                </div>
              </div>

              {reviewPayment.receipt && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-text-muted uppercase block font-bold">Voucher:</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden relative h-48 bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={reviewPayment.receipt} 
                      alt="Voucher" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {reviewPayment.notes && (
                <div className="bg-slate-50 p-3 rounded-lg text-xs">
                  <span className="text-[9px] text-text-muted font-bold block mb-0.5">Notas del Inquilino:</span>
                  <p className="font-normal text-text">{reviewPayment.notes}</p>
                </div>
              )}

              {rejectMode ? (
                <form onSubmit={handleReject} className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-red mb-1 uppercase">Motivo del Rechazo</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Indique al inquilino la inconsistencia..."
                      className="w-full p-3 border border-red-200 rounded-xl text-xs font-semibold focus:border-red outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-red text-white rounded-xl text-xs font-bold cursor-pointer border-0 shadow-sm"
                    >
                      Confirmar Rechazo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectMode(false)}
                      className="w-full h-11 border border-slate-200 bg-white rounded-xl text-xs font-bold text-text-muted cursor-pointer"
                    >
                      Volver
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !!modalSuccess}
                    className="w-full h-11 bg-[#151c26] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    Aprobar y Confirmar Pago
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectMode(true)}
                    className="w-full h-11 border border-red text-red rounded-xl text-xs font-bold cursor-pointer bg-white"
                  >
                    Rechazar Comprobante
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MOBILE MODAL 2: Ver Detalles */}
      {viewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-text">Detalle de Pago</h3>
                <p className="text-[10px] text-text-muted mt-0.5">{viewPayment.tenantName} • S/ {viewPayment.amount}</p>
              </div>
              <button 
                onClick={() => setViewPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 pb-8 text-xs font-semibold text-text animate-in">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Monto:</span>
                  <span className="font-extrabold">S/ {viewPayment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Método:</span>
                  <span>{viewPayment.paymentMethod || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Vencimiento:</span>
                  <span>{formatLocalDate(viewPayment.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Confirmado el:</span>
                  <span>{viewPayment.paidDate ? formatLocalDate(viewPayment.paidDate) : "—"}</span>
                </div>
              </div>

              {viewPayment.receipt && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-text-muted uppercase block">Voucher</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden relative h-48 bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={viewPayment.receipt} 
                      alt="Voucher" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {viewPayment.notes && (
                <div>
                  <span className="text-[10px] text-text-muted uppercase block mb-1">Notas:</span>
                  <p className="font-normal text-text leading-normal">{viewPayment.notes}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setViewPayment(null)}
                className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 mt-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MODAL 3: Recordatorio */}
      {reminderPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl w-full animate-in slide-in-from-bottom duration-200">
            
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">Enviar Recordatorio</h3>
              <button 
                onClick={() => setReminderPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 pb-8">
              {reminderSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-4 text-center text-xs font-medium space-y-1.5">
                  <p className="text-sm font-bold text-green">¡Recordatorio Enviado!</p>
                  <p className="text-[10px] text-text-muted">Inquilino notificado con éxito por email y WhatsApp.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-text-muted leading-relaxed">
                    Se enviará una plantilla de cobranza automática a <strong>{reminderPayment.tenantName}</strong> por su alquiler vencido de S/ {reminderPayment.amount}.
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={handleSendReminder}
                      disabled={isSendingReminder}
                      className="w-full h-11 bg-accent text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
                    >
                      {isSendingReminder ? "Enviando..." : "Enviar por WhatsApp / Correo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderPayment(null)}
                      className="w-full h-11 border border-slate-200 bg-white rounded-xl text-xs font-bold text-text-muted cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
