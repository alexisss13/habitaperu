"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CreditCardIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon, 
  ImageAdd01Icon, 
  FileValidationIcon 
} from "hugeicons-react"
import { submitPaymentReceipt } from "@/app/actions/payment-actions"
import { uploadImageAction } from "@/app/actions/upload-actions"
import type { TenantPaymentItem } from "./payments-view"

interface Props {
  payments: TenantPaymentItem[]
}

export function TenantPaymentsDesktop({ payments }: Props) {
  const router = useRouter()
  
  // State for upload receipt modal
  const [selectedPayment, setSelectedPayment] = useState<TenantPaymentItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("BCP")
  const [receiptUrl, setReceiptUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setModalError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await uploadImageAction(formData, "payments")
      if (res.success && res.url) {
        setReceiptUrl(res.url)
      } else {
        if (res.isMocked) {
          setModalError("Cloudinary no configurado. Se mantiene el simulador, por favor ingresa la URL de forma manual o usa la simulación.")
        } else {
          setModalError(res.error || "Error al subir el comprobante.")
        }
      }
    } catch (err) {
      console.error(err)
      setModalError("Error de conexión al subir la imagen del comprobante.")
    } finally {
      setUploading(false)
    }
  }

  // State for previewing receipt modal
  const [previewPayment, setPreviewPayment] = useState<TenantPaymentItem | null>(null)

  // Calculate metrics
  const totalPaid = payments
    .filter(p => p.status === "PAGADO")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingPayments = payments.filter(p => ["PENDIENTE", "VENCIDO"].includes(p.status))
  const nextPayment = pendingPayments.length > 0 
    ? pendingPayments[pendingPayments.length - 1] // oldest pending
    : null

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
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-lg">Pagado</span>
      case "EN_PROCESO":
        return <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-250 rounded-lg">En Proceso</span>
      case "PENDIENTE":
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-250 rounded-lg">Pendiente</span>
      case "VENCIDO":
        return <span className="px-2.5 py-1 text-xs font-bold bg-red/10 text-red border border-red/20 rounded-lg">Vencido</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg">{status}</span>
    }
  }

  // File simulator
  const handleSimulateFile = () => {
    // Generate a beautiful placeholder from unsplash simulating a payment receipt
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
      setModalError("Ocurrió un error inesperado al subir.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-2 pt-[80px]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-2">Mis Pagos de Alquiler</h1>
          <p className="text-base font-medium text-text-muted">
            Lleva el control de tus cuotas mensuales, sube tus comprobantes de pago y revisa el historial.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Próximo Pago</p>
            {nextPayment ? (
              <>
                <p className="text-2xl font-bold text-[#151c26]">S/ {nextPayment.amount.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">Vence el {formatLocalDate(nextPayment.dueDate)}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-emerald-600">Al día</p>
                <p className="text-xs text-text-muted mt-1">No registras pagos vencidos o pendientes</p>
              </>
            )}
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Estado de Cuenta</p>
            {pendingPayments.some(p => p.status === "VENCIDO") ? (
              <>
                <p className="text-2xl font-bold text-red">Atrasado</p>
                <p className="text-xs text-text-muted mt-1">Tienes cuotas vencidas pendientes</p>
              </>
            ) : pendingPayments.length > 0 ? (
              <>
                <p className="text-2xl font-bold text-amber-600">Pendiente</p>
                <p className="text-xs text-text-muted mt-1">Tienes {pendingPayments.length} pago(s) por realizar</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-emerald-600">Excelente</p>
                <p className="text-xs text-text-muted mt-1">Cuentas totalmente liquidadas</p>
              </>
            )}
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Abonado</p>
            <p className="text-2xl font-bold text-emerald-700">S/ {totalPaid.toLocaleString()}</p>
            <p className="text-xs text-text-muted mt-1">Monto acumulado en alquileres pagados</p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-bold text-text uppercase tracking-wider">Historial de Transacciones</h2>
          </div>

          {payments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-text-muted">
                  <th className="p-4">Propiedad</th>
                  <th className="p-4">Mes / Periodo</th>
                  <th className="p-4">Vencimiento</th>
                  <th className="p-4">Fecha de Pago</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors text-xs">
                    <td className="p-4">
                      <p className="font-bold text-text truncate max-w-[200px]">{p.propertyName}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{p.propertyDistrict}</p>
                    </td>
                    <td className="p-4 text-text font-semibold">
                      {getMonthName(p.dueDate)}
                    </td>
                    <td className="p-4 text-text-muted font-medium">
                      {formatLocalDate(p.dueDate)}
                    </td>
                    <td className="p-4 text-text-muted font-medium">
                      {p.paidDate ? formatLocalDate(p.paidDate) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-4 font-bold text-text">
                      S/ {p.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="p-4 text-right">
                      {["PENDIENTE", "VENCIDO"].includes(p.status) && (
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="h-9 px-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-bold text-xs transition-colors cursor-pointer border-0"
                        >
                          Pagar / Reportar
                        </button>
                      )}
                      {p.status === "EN_PROCESO" && (
                        <button
                          onClick={() => setPreviewPayment(p)}
                          className="h-9 px-3 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Ver Voucher
                        </button>
                      )}
                      {p.status === "PAGADO" && (
                        <button
                          onClick={() => setPreviewPayment(p)}
                          className="h-9 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Ver Detalles
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20">
              <CreditCardIcon size={56} className="text-slate-350 mx-auto mb-4" />
              <h3 className="text-base font-bold text-text mb-1">Sin registros de pagos</h3>
              <p className="text-xs font-medium text-text-muted">
                No tienes cuotas programadas o registradas en este momento.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Subir Comprobante / Registrar Pago */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text">Registrar Comprobante de Pago</h3>
                <p className="text-xs text-text-muted mt-0.5">{selectedPayment.propertyName} • Cuota {getMonthName(selectedPayment.dueDate)}</p>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRegisterPayment} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <CheckmarkCircle01Icon size={16} className="shrink-0 mt-0.5" />
                  <span>¡Comprobante enviado con éxito para revisión!</span>
                </div>
              )}

              {/* Bank accounts references */}
              <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 text-xs leading-relaxed">
                <span className="font-bold text-amber-900 block mb-1">🏦 Datos para la Transferencia:</span>
                {(() => {
                  let paymentAccount = {
                    provider: "BCP",
                    accountNumber: "Consultar con el arrendador",
                    accountHolder: "Propietario del Inmueble"
                  }
                  try {
                    const parsed = selectedPayment.contractTerms ? JSON.parse(selectedPayment.contractTerms) : null
                    if (parsed?.paymentAccount) {
                      paymentAccount = parsed.paymentAccount
                    }
                  } catch {}
                  return (
                    <p className="text-amber-800">
                      Realiza el depósito/transferencia a la cuenta <strong>{paymentAccount.provider}</strong> N° <strong>{paymentAccount.accountNumber}</strong> a nombre de <strong>{paymentAccount.accountHolder}</strong> por un total de <strong>S/ {selectedPayment.amount}</strong>.
                    </p>
                  )
                })()}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Método de Pago</label>
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
                  <option value="OTRO">Otro / Transferencia Directa</option>
                </select>
              </div>

              {/* Receipt File upload */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-text-muted uppercase">Comprobante de Pago (Voucher)</label>
                  <div className="flex gap-2">
                    {uploading && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                    <button
                      type="button"
                      onClick={handleSimulateFile}
                      className="text-[10px] text-accent hover:underline bg-transparent border-0 cursor-pointer font-bold"
                    >
                      Simular Carga de Voucher
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800 w-full"
                  />
                  <input
                    type="text"
                    required
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    placeholder="O pega la URL de la imagen del comprobante aquí"
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent bg-white"
                  />
                </div>

                {receiptUrl && (
                  <div className="mt-3 border border-slate-100 rounded-xl p-2 bg-slate-50 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiptUrl} alt="Comprobante" className="size-12 rounded object-cover border border-slate-200" />
                    <div>
                      <p className="text-[10px] font-bold text-text line-clamp-1">comprobante_pago.png</p>
                      <p className="text-[9px] text-text-muted">Archivo listo para verificación</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Notas / Comentarios (Opcional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Pago de alquiler del mes de Mayo, transferido en la mañana..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="h-11 px-5 border border-slate-200 rounded-xl text-xs font-bold text-text-muted hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || modalSuccess}
                  className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Registrar Pago</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Vista Previa Comprobante / Detalles */}
      {previewPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text">Detalle del Pago</h3>
                <p className="text-xs text-text-muted mt-0.5">{previewPayment.propertyName} • Cuota {getMonthName(previewPayment.dueDate)}</p>
              </div>
              <button 
                onClick={() => setPreviewPayment(null)}
                className="p-1.5 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-text">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-text-muted uppercase block mb-0.5">Monto de la Cuota</span>
                  <span className="text-base font-extrabold">S/ {previewPayment.amount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block mb-0.5">Estado del Alquiler</span>
                  <span className="block mt-1">{getStatusBadge(previewPayment.status)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-text-muted uppercase block mb-0.5">Fecha de Vencimiento</span>
                  <span>{formatLocalDate(previewPayment.dueDate)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-text-muted uppercase block mb-0.5">Fecha de Pago</span>
                  <span>{previewPayment.paidDate ? formatLocalDate(previewPayment.paidDate) : "—"}</span>
                </div>
              </div>

              {previewPayment.receipt ? (
                <div className="space-y-3">
                  <span className="text-[10px] text-text-muted uppercase block">Voucher Cargado</span>
                  
                  {/* Voucher Preview Frame */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden relative h-56 bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewPayment.receipt} 
                      alt="Comprobante" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase block mb-0.5">Método de Pago</span>
                      <span className="text-text">{previewPayment.paymentMethod || "No especificado"}</span>
                    </div>
                    {previewPayment.notes && (
                      <div>
                        <span className="text-[10px] text-text-muted uppercase block mb-0.5">Comentarios del Inquilino</span>
                        <p className="text-text font-normal leading-relaxed">{previewPayment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-text-muted font-normal">
                  No se ha registrado ningún comprobante de pago para esta cuota.
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewPayment(null)}
                  className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                >
                  Cerrar Detalles
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
