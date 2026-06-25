"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  SecurityCheckIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { AdminPagination } from "@/components/ui/pagination"
import { approveKYC, rejectKYC } from "@/app/actions/kyc-actions"
import type { AdminKYCItem } from "./kyc-view"

interface Props {
  verifications: AdminKYCItem[]
}

export function AdminKYCDesktop({ verifications }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("TODAS")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal review state
  const [selectedKyc, setSelectedKyc] = useState<AdminKYCItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  // Modal details state
  const [viewKyc, setViewKyc] = useState<AdminKYCItem | null>(null)

  // Calculations
  const inReviewCount = verifications.filter(v => v.status === "EN_REVISION").length
  const approvedCount = verifications.filter(v => v.status === "APROBADO").length
  const rejectedCount = verifications.filter(v => v.status === "RECHAZADO").length

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APROBADO":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-admin-success-bg text-admin-success rounded-full">Verificado</span>
      case "EN_REVISION":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-admin-warning-bg text-admin-warning rounded-full animate-pulse">En Revisión</span>
      case "RECHAZADO":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-admin-error-bg text-admin-error rounded-full">Rechado</span>
      case "PENDIENTE":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-admin-info-bg text-admin-info rounded-full">Pendiente</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{status}</span>
    }
  }

  // Filter list
  const filteredList = verifications.filter(v => {
    const matchesSearch = 
      v.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    if (filter === "TODAS") return true
    if (filter === "EN_REVISION") return v.status === "EN_REVISION"
    if (filter === "APROBADOS") return v.status === "APROBADO"
    if (filter === "RECHAZADOS") return v.status === "RECHAZADO"

    return true
  })

  const pagination = usePagination(filteredList, 10, [filter, searchQuery])

  // Approve action
  const handleApprove = async () => {
    if (!selectedKyc) return
    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await approveKYC(selectedKyc.userId)
      if (res.success) {
        setModalSuccess("¡Usuario verificado con éxito!")
        setTimeout(() => {
          setSelectedKyc(null)
          setModalSuccess(null)
          router.refresh()
        }, 1500)
      } else {
        setModalError(res.error || "Ocurrió un error al aprobar.")
      }
    } catch (err) {
      console.error(err)
      setModalError("Error de red al aprobar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reject action
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedKyc) return
    if (!rejectionReason.trim()) {
      setModalError("Ingrese la justificación del rechazo.")
      return
    }

    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await rejectKYC(selectedKyc.userId, rejectionReason)
      if (res.success) {
        setModalSuccess("¡Expediente de identidad rechazado!")
        setTimeout(() => {
          setSelectedKyc(null)
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
      setModalError("Error de red al rechazar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-10 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SecurityCheckIcon size={32} className="text-admin-accent" />
          <h1 className="text-3xl font-bold text-admin-text">Verificaciones KYC</h1>
        </div>
        <p className="text-sm text-admin-text-muted">Revisa y evalúa la autenticidad de los documentos e identidades de los usuarios.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
          <div className="text-xs font-bold text-admin-text-muted mb-2">EN REVISIÓN</div>
          <div className="text-[2rem] font-bold text-admin-warning">{inReviewCount}</div>
        </div>
        <div className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
          <div className="text-xs font-bold text-admin-text-muted mb-2">VERIFICADOS</div>
          <div className="text-[2rem] font-bold text-admin-success">{approvedCount}</div>
        </div>
        <div className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
          <div className="text-xs font-bold text-admin-text-muted mb-2">RECHAZADOS</div>
          <div className="text-[2rem] font-bold text-admin-error">{rejectedCount}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-admin-card-bg px-6 py-4 rounded-xl border border-admin-border mb-6 flex items-center justify-between gap-4">
        <div className="flex bg-admin-bg p-1 border border-admin-border rounded-lg">
          {[
            { key: "TODAS", label: "Todos" },
            { key: "EN_REVISION", label: "En Revisión" },
            { key: "APROBADOS", label: "Verificados" },
            { key: "RECHAZADOS", label: "Rechazados" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer border-0 ${
                filter === tab.key 
                  ? "bg-admin-accent text-white" 
                  : "text-admin-text-muted hover:text-admin-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-80">
          <input
            type="text"
            placeholder="Buscar por usuario, correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
        {filteredList.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg border-b border-admin-border text-xs font-bold text-admin-text-muted">
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Fecha de Envío</th>
                <th className="p-4">DNI</th>
                <th className="p-4">Biometría</th>
                <th className="p-4">Antecedentes</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedItems.map((v) => (
                <tr key={v.id} className="border-b border-admin-border last:border-0 hover:bg-admin-bg/30 transition-colors text-xs text-admin-text font-medium">
                  <td className="p-4">
                    <p className="font-bold text-admin-text">{v.user.name}</p>
                    <p className="text-[10px] text-admin-text-muted mt-0.5">{v.user.email}</p>
                  </td>
                  <td className="p-4 text-admin-text-muted font-bold text-[10px]">
                    {v.user.role}
                  </td>
                  <td className="p-4 text-admin-text-muted">
                    {formatLocalDate(v.updatedAt)}
                  </td>
                  <td className="p-4">
                    <span className={v.dniVerified ? "text-admin-success font-bold" : "text-admin-text-muted"}>
                      {v.dniVerified ? "✓ Verificado" : "⚙ Pendiente"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={v.biometricVerified ? "text-admin-success font-bold" : "text-admin-text-muted"}>
                      {v.biometricVerified ? "✓ Validado" : "⚙ Pendiente"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={v.backgroundCheck ? "text-admin-success font-bold" : "text-admin-text-muted"}>
                      {v.backgroundCheck ? "✓ Limpio" : "⚙ Pendiente"}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(v.status)}
                  </td>
                  <td className="p-4 text-right">
                    {v.status === "EN_REVISION" ? (
                      <button
                        onClick={() => {
                          setSelectedKyc(v)
                          setRejectMode(false)
                          setRejectionReason("")
                        }}
                        className="px-3.5 py-2 bg-admin-accent text-white rounded-lg font-bold text-xs hover:-translate-y-px transition-all cursor-pointer border-0 shadow-sm shadow-admin-accent/10"
                      >
                        Evaluar Solicitud
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewKyc(v)}
                        className="px-3.5 py-2 border border-admin-border text-admin-text hover:bg-admin-bg rounded-lg font-bold text-xs cursor-pointer"
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
          <div className="text-center py-20 bg-admin-card-bg">
            <SecurityCheckIcon size={56} className="text-admin-border mx-auto mb-4" />
            <h3 className="text-base font-bold text-admin-text mb-1">Sin solicitudes</h3>
            <p className="text-xs font-medium text-admin-text-muted">
              No hay solicitudes KYC registradas con el filtro seleccionado.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredList.length > 0 && (
        <div className="bg-admin-card-bg rounded-b-xl border border-t-0 border-admin-border">
          <AdminPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemLabel="verificaciones"
          />
        </div>
      )}

      {/* MODAL 1: Evaluar Expediente (Aprobar / Rechazar) */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-admin-card-bg border border-admin-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-admin-bg border-b border-admin-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-admin-text">Evaluar Expediente KYC</h3>
                <p className="text-xs text-admin-text-muted mt-0.5">{selectedKyc.user.name} • Rol: {selectedKyc.user.role}</p>
              </div>
              <button 
                onClick={() => setSelectedKyc(null)}
                className="p-1.5 text-admin-text-muted hover:text-admin-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-admin-bg"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-950/20 border border-red-500/35 text-red rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-500/35 text-emerald-500 rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium">
                  <CheckmarkCircle01Icon size={16} className="shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              {/* DNI Document Frame */}
              {selectedKyc.dniDocument && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-admin-text-muted uppercase block font-bold">Documento DNI Frontal:</span>
                  <div className="border border-admin-border rounded-xl overflow-hidden relative h-56 bg-admin-bg flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedKyc.dniDocument} 
                      alt="DNI Frontal" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-admin-text bg-admin-bg p-4 rounded-xl border border-admin-border">
                <div>
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Cotejo Biométrico Facial:</span>
                  {selectedKyc.biometricVerified ? (
                    <span className="text-admin-success">✓ Validado</span>
                  ) : (
                    <span className="text-admin-warning">⚙ Pendiente</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Control de Antecedentes:</span>
                  {selectedKyc.backgroundCheck ? (
                    <span className="text-admin-success">✓ Limpio</span>
                  ) : (
                    <span className="text-admin-warning">⚙ Pendiente</span>
                  )}
                </div>
              </div>

              {/* Rejection Form */}
              {rejectMode ? (
                <form onSubmit={handleReject} className="space-y-3 pt-3 border-t border-admin-border">
                  <div>
                    <label className="block text-xs font-bold text-red mb-1.5 uppercase">Motivo del Rechazo</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Ej: La imagen cargada no es legible o no corresponde al documento original..."
                      className="w-full p-3 border border-red-400 rounded-xl text-xs font-semibold bg-admin-bg text-admin-text focus:border-red outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectMode(false)}
                      className="h-10 px-4 border border-admin-border rounded-lg text-xs font-bold text-admin-text-muted bg-transparent cursor-pointer hover:bg-admin-bg"
                    >
                      Volver
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
                <div className="pt-4 border-t border-admin-border flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRejectMode(true)}
                    className="h-11 px-5 border border-red text-red hover:bg-red/10 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-transparent"
                  >
                    Rechazar Expediente
                  </button>
                  
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !!modalSuccess}
                    className="h-11 px-6 bg-admin-accent text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <CheckmarkCircle01Icon size={16} />
                        <span>Aprobar y Verificar Cuenta</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ver Detalles */}
      {viewKyc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-admin-card-bg border border-admin-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-admin-bg border-b border-admin-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-admin-text">Historial de Verificación KYC</h3>
                <p className="text-xs text-admin-text-muted mt-0.5">{viewKyc.user.name} • Rol: {viewKyc.user.role}</p>
              </div>
              <button 
                onClick={() => setViewKyc(null)}
                className="p-1.5 text-admin-text-muted hover:text-admin-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-admin-bg"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-admin-text">
              <div className="grid grid-cols-2 gap-4 bg-admin-bg border border-admin-border p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Estado KYC</span>
                  <span>{getStatusBadge(viewKyc.status)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Usuario Verificado</span>
                  <span className={viewKyc.user.verified ? "text-emerald-500" : "text-admin-text-muted"}>
                    {viewKyc.user.verified ? "✓ SÍ (Habilitado)" : "⚙ NO"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Fecha Evaluación</span>
                  <span>{viewKyc.verifiedAt ? formatLocalDate(viewKyc.verifiedAt) : "—"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-admin-text-muted uppercase block mb-0.5">Fecha Radicación</span>
                  <span>{formatLocalDate(viewKyc.createdAt)}</span>
                </div>
              </div>

              {viewKyc.dniDocument && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-admin-text-muted uppercase block">Documento DNI:</span>
                  <div className="border border-admin-border rounded-xl overflow-hidden relative h-48 bg-admin-bg flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={viewKyc.dniDocument} 
                      alt="DNI" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {viewKyc.reviewNotes && (
                <div className="bg-red-950/10 border border-red-500/20 p-3 rounded-lg text-red">
                  <span className="text-[9px] uppercase font-bold block mb-1">Notas de la Evaluación:</span>
                  <p className="font-normal text-admin-text leading-normal">{viewKyc.reviewNotes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-admin-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewKyc(null)}
                  className="h-11 px-6 bg-admin-accent text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
