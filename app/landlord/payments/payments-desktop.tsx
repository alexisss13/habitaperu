"use client"

import { PanelPageHeader } from "@/components/panel-page-header"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CreditCardIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon,
  Wallet01Icon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { Pagination } from "@/components/ui/pagination"
import { approvePayment, rejectPayment } from "@/app/actions/payment-actions"
import type { LandlordPaymentItem } from "./payments-view"

interface Props {
  payments: LandlordPaymentItem[]
}

export function LandlordPaymentsDesktop({ payments }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("TODOS")
  const [searchQuery, setSearchQuery] = useState("")

  // State for Review Payment Modal
  const [reviewPayment, setReviewPayment] = useState<LandlordPaymentItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  // State for View Details Modal
  const [viewPayment, setViewPayment] = useState<LandlordPaymentItem | null>(null)

  // State for WhatsApp Reminder simulation
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
      month: "long",
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
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Verificado</span>
      case "EN_PROCESO":
        return <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg animate-pulse">Por Aprobar</span>
      case "PENDIENTE":
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Pendiente Inquilino</span>
      case "VENCIDO":
        return <span className="px-2.5 py-1 text-xs font-bold bg-red/10 text-red border border-red/20 rounded-lg">Atrasado</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-panel-hover-bg text-panel-text-dim border border-panel-border rounded-lg">{status}</span>
    }
  }

  // Filter payments
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

  const pagination = usePagination(filteredPayments, 10, [filter, searchQuery])

  // Approve Payment Action
  const handleApprove = async () => {
    if (!reviewPayment) return
    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await approvePayment(reviewPayment.id)
      if (res.success) {
        setModalSuccess("¡Pago aprobado y verificado correctamente!")
        setTimeout(() => {
          setReviewPayment(null)
          setModalSuccess(null)
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Ocurrió un error al aprobar.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error al conectar con el servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reject Payment Action
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewPayment) return
    if (!rejectionReason.trim()) {
      setModalError("Por favor ingrese el motivo del rechazo.")
      return
    }

    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await rejectPayment(reviewPayment.id, rejectionReason)
      if (res.success) {
        setModalSuccess("¡Pago rechazado y notificado al inquilino!")
        setTimeout(() => {
          setReviewPayment(null)
          setRejectionReason("")
          setRejectMode(false)
          setModalSuccess(null)
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Ocurrió un error al rechazar.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error al conectar con el servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Send reminder action mock
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
    <div>
      <div className="py-8 px-6 max-w-7xl mx-auto">
        
        <PanelPageHeader
          icon={<Wallet01Icon size={32} className="text-admin-accent" />}
          title="Control y Gestión de Pagos"
          subtitle="Monitorea el recaudo mensual de tus propiedades alquiladas y valida los comprobantes recibidos."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-5">
            <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Recaudo Total</p>
            <p className="text-3xl font-bold text-emerald-600">S/ {totalReceived.toLocaleString()}</p>
            <p className="text-xs text-panel-text-muted mt-1">Cuotas cobradas y verificadas</p>
          </div>

          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-5">
            <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Pendientes de Aprobación</p>
            <p className="text-3xl font-bold text-indigo-600">{pendingApprovalsCount}</p>
            <p className="text-xs text-panel-text-muted mt-1">Comprobantes por revisar en el panel</p>
          </div>

          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-5">
            <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Alquileres Atrasados</p>
            <p className="text-3xl font-bold text-red">{overdueCount}</p>
            <p className="text-xs text-panel-text-muted mt-1">Inquilinos con fecha de pago vencida</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-panel-card-bg border border-panel-border p-5 rounded-2xl mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-1.5 bg-panel-hover-bg p-1 border border-panel-border rounded-xl">
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
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all border-0 ${
                  filter === tab.key 
                    ? "bg-[#151c26] text-white shadow-sm" 
                    : "text-panel-text-muted hover:text-panel-text hover:bg-panel-hover-bg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <input 
              type="text" 
              placeholder="Buscar por inquilino o propiedad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3 border border-panel-border rounded-xl text-xs font-semibold focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-panel-card-bg border border-panel-border rounded-2xl overflow-hidden">
          {filteredPayments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-panel-hover-bg border-b border-panel-border text-xs font-bold text-panel-text-muted">
                  <th className="p-4">Propiedad</th>
                  <th className="p-4">Inquilino</th>
                  <th className="p-4">Cuota / Periodo</th>
                  <th className="p-4">Vencimiento</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((p) => (
                  <tr key={p.id} className="border-b border-panel-border last:border-0 hover:bg-panel-hover-bg transition-colors text-xs">
                    <td className="p-4">
                      <p className="font-bold text-panel-text truncate max-w-[180px]">{p.propertyName}</p>
                      <p className="text-[10px] text-panel-text-muted mt-0.5">{p.propertyDistrict}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-panel-text">{p.tenantName}</p>
                      <p className="text-[10px] text-panel-text-muted mt-0.5">{p.tenantEmail}</p>
                    </td>
                    <td className="p-4 text-panel-text font-semibold">
                      {getMonthName(p.dueDate)}
                    </td>
                    <td className="p-4 text-panel-text-muted font-medium">
                      {formatLocalDate(p.dueDate)}
                    </td>
                    <td className="p-4 font-bold text-panel-text">
                      S/ {p.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="p-4 text-right">
                      {p.status === "EN_PROCESO" && (
                        <button
                          onClick={() => {
                            setReviewPayment(p)
                            setRejectMode(false)
                            setRejectionReason("")
                          }}
                          className="h-9 px-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-bold text-xs cursor-pointer border-0 shadow-sm animate-pulse"
                        >
                          Revisar Pago
                        </button>
                      )}
                      {p.status === "VENCIDO" && (
                        <button
                          onClick={() => setReminderPayment(p)}
                          className="h-9 px-3 border border-red text-red hover:bg-red/5 rounded-lg font-bold text-xs cursor-pointer"
                        >
                          Recordar Pago
                        </button>
                      )}
                      {p.status === "PAGADO" && (
                        <button
                          onClick={() => setViewPayment(p)}
                          className="h-9 px-3 border border-panel-border text-panel-text-dim hover:bg-panel-hover-bg rounded-lg font-bold text-xs cursor-pointer bg-panel-card-bg"
                        >
                          Ver Voucher
                        </button>
                      )}
                      {p.status === "PENDIENTE" && (
                        <span className="text-[10px] text-panel-text-dim font-semibold italic mr-2">Espera depósito</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 bg-panel-card-bg">
              <CreditCardIcon size={56} className="text-panel-text-dim mx-auto mb-4" />
              <h3 className="text-base font-bold text-panel-text mb-1">Sin registros de pagos</h3>
              <p className="text-xs font-medium text-panel-text-muted">
                No hay pagos cargados o programados con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemLabel="pagos"
          />
        )}

      </div>

      {/* MODAL 1: Revisar Comprobante (Aprobar / Rechazar) */}
      {reviewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-panel-card-bg border border-panel-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-panel-hover-bg border-b border-panel-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-panel-text">Revisar Pago del Inquilino</h3>
                <p className="text-xs text-panel-text-muted mt-0.5">{reviewPayment.tenantName} • Cuota {getMonthName(reviewPayment.dueDate)}</p>
              </div>
              <button 
                onClick={() => setReviewPayment(null)}
                className="p-1.5 text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-panel-hover-bg"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <CheckmarkCircle01Icon size={16} className="shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-panel-text bg-panel-hover-bg p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Monto Declarado</span>
                  <span className="text-base font-extrabold">S/ {reviewPayment.amount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Método de Pago</span>
                  <span className="text-sm font-semibold">{reviewPayment.paymentMethod || "No especificado"}</span>
                </div>
              </div>

              {/* Voucher Preview */}
              {reviewPayment.receipt && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-panel-text-muted uppercase block font-bold">Voucher Enviado:</span>
                  <div className="border border-panel-border rounded-xl overflow-hidden relative h-56 bg-panel-hover-bg flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={reviewPayment.receipt} 
                      alt="Voucher de Pago" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {reviewPayment.notes && (
                <div className="bg-panel-hover-bg p-3.5 rounded-xl border border-panel-border">
                  <span className="text-[9px] text-panel-text-muted font-bold uppercase block mb-0.5">Comentarios del Inquilino:</span>
                  <p className="text-xs text-panel-text font-normal leading-relaxed">{reviewPayment.notes}</p>
                </div>
              )}

              {/* Reject Mode Form */}
              {rejectMode ? (
                <form onSubmit={handleReject} className="space-y-3 pt-3 border-t border-panel-border">
                  <div>
                    <label className="block text-xs font-bold text-red mb-1.5 uppercase">Motivo del Rechazo</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Ej: El monto del voucher no coincide con el alquiler..."
                      className="w-full p-3 border border-red-200 rounded-xl text-xs font-semibold focus:border-red outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectMode(false)}
                      className="h-10 px-4 border border-panel-border rounded-lg text-xs font-bold text-panel-text-muted bg-panel-card-bg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 px-4 bg-red text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-0"
                    >
                      Confirmar Rechazo
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pt-4 border-t border-panel-border flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRejectMode(true)}
                    className="h-11 px-5 border border-red text-red hover:bg-red/5 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-panel-card-bg"
                  >
                    Rechazar Comprobante
                  </button>
                  
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !!modalSuccess}
                    className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <CheckmarkCircle01Icon size={16} />
                        <span>Aprobar y Confirmar Pago</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ver Comprobante Verificado */}
      {viewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-panel-card-bg border border-panel-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-panel-hover-bg border-b border-panel-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-panel-text">Voucher de Alquiler Verificado</h3>
                <p className="text-xs text-panel-text-muted mt-0.5">{viewPayment.tenantName} • Cuota {getMonthName(viewPayment.dueDate)}</p>
              </div>
              <button 
                onClick={() => setViewPayment(null)}
                className="p-1.5 text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-panel-hover-bg"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-panel-text">
              <div className="grid grid-cols-2 gap-4 bg-panel-hover-bg p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Monto de la Cuota</span>
                  <span className="text-base font-extrabold">S/ {viewPayment.amount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Método de Pago</span>
                  <span className="text-sm font-semibold">{viewPayment.paymentMethod || "No registrado"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Fecha de Vencimiento</span>
                  <span>{formatLocalDate(viewPayment.dueDate)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-0.5">Confirmado el</span>
                  <span>{viewPayment.paidDate ? formatLocalDate(viewPayment.paidDate) : "—"}</span>
                </div>
              </div>

              {viewPayment.receipt && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-panel-text-muted uppercase block">Comprobante de Pago:</span>
                  <div className="border border-panel-border rounded-xl overflow-hidden relative h-56 bg-panel-hover-bg flex items-center justify-center">
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
                  <span className="text-[10px] text-panel-text-muted uppercase block mb-1">Notas del Registro:</span>
                  <p className="text-panel-text font-normal leading-relaxed">{viewPayment.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-panel-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewPayment(null)}
                  className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Recordatorio de Pago */}
      {reminderPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-panel-card-bg border border-panel-border shadow-2xl rounded-2xl max-w-md w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-panel-hover-bg border-b border-panel-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-panel-text">Recordatorio de Alquiler Vencido</h3>
              <button 
                onClick={() => setReminderPayment(null)}
                className="p-1.5 text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-panel-hover-bg"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {reminderSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-4 text-center text-xs font-medium space-y-2">
                  <div className="size-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow">
                    ✓
                  </div>
                  <p>¡Notificación de cobro enviada a {reminderPayment.tenantName}!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-panel-text-muted leading-relaxed">
                    Vas a enviar un recordatorio automático por correo y una plantilla de WhatsApp a <strong>{reminderPayment.tenantName}</strong> por la cuota atrasada del mes de <strong>{getMonthName(reminderPayment.dueDate)}</strong> por el monto de <strong>S/ {reminderPayment.amount}</strong>.
                  </p>

                  <div className="bg-panel-hover-bg p-4 border border-panel-border rounded-xl text-[11px] leading-relaxed text-panel-text-dim">
                    <span className="font-bold text-panel-text block mb-1">Plantilla Mensaje:</span>
                    {'"'}{`Hola ${reminderPayment.tenantName.split(" ")[0]}, te recordamos que tienes una cuota de arriendo vencida el ${new Date(reminderPayment.dueDate).toLocaleDateString("es-PE")} por S/ ${reminderPayment.amount} para el inmueble ${reminderPayment.propertyName}. Por favor registra tu voucher en Habita Perú. Gracias.`}{'"'}
                  </div>

                  <div className="pt-4 border-t border-panel-border flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReminderPayment(null)}
                      className="h-10 px-5 border border-panel-border rounded-lg text-xs font-bold text-panel-text-muted bg-panel-card-bg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendReminder}
                      disabled={isSendingReminder}
                      className="h-10 px-6 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
                    >
                      {isSendingReminder ? "Enviando..." : "Enviar Recordatorio"}
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
