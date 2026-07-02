"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  SecurityCheckIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon
} from "hugeicons-react"
import { approveKYC, rejectKYC } from "@/app/actions/kyc-actions"
import type { AdminKYCItem } from "./kyc-view"

interface Props {
  verifications: AdminKYCItem[]
  currentFilter?: string | null
}

export function AdminKYCMobile({ verifications, currentFilter }: Props) {
  const router = useRouter()
  const statusToTab: Record<string, string> = { EN_REVISION: "EN_REVISION", APROBADO: "APROBADOS", RECHAZADO: "RECHAZADOS", PENDIENTE: "TODAS" }
  const initialFilter = currentFilter ? (statusToTab[currentFilter] ?? "TODAS") : "TODAS"
  const [filter, setFilter] = useState<string>(initialFilter)
  const [searchQuery, setSearchQuery] = useState("")

  // Modals state
  const [selectedKyc, setSelectedKyc] = useState<AdminKYCItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  const [viewKyc, setViewKyc] = useState<AdminKYCItem | null>(null)

  const inReviewCount = verifications.filter(v => v.status === "EN_REVISION").length
  const approvedCount = verifications.filter(v => v.status === "APROBADO").length
  const rejectedCount = verifications.filter(v => v.status === "RECHAZADO").length

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APROBADO":
        return <span className="px-2 py-0.5 text-[9px] font-semibold bg-admin-success-bg text-admin-success rounded">Verificado</span>
      case "EN_REVISION":
        return <span className="px-2 py-0.5 text-[9px] font-semibold bg-admin-warning-bg text-admin-warning rounded animate-pulse">En Revisión</span>
      case "RECHAZADO":
        return <span className="px-2 py-0.5 text-[9px] font-semibold bg-admin-error-bg text-admin-error rounded">Rechazado</span>
      case "PENDIENTE":
        return <span className="px-2 py-0.5 text-[9px] font-semibold bg-admin-info-bg text-admin-info rounded">Pendiente</span>
      default:
        return <span className="px-2 py-0.5 text-[9px] font-semibold bg-slate-100 text-slate-700 rounded">{status}</span>
    }
  }

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

  const handleApprove = async () => {
    if (!selectedKyc) return
    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await approveKYC(selectedKyc.userId)
      if (res.success) {
        setModalSuccess("¡Aprobado con éxito!")
        setTimeout(() => {
          setSelectedKyc(null)
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
    if (!selectedKyc) return
    if (!rejectionReason.trim()) {
      setModalError("Ingrese motivo.")
      return
    }

    setIsSubmitting(true)
    setModalError(null)
    setModalSuccess(null)

    try {
      const res = await rejectKYC(selectedKyc.userId, rejectionReason)
      if (res.success) {
        setModalSuccess("¡Rechazado con éxito!")
        setTimeout(() => {
          setSelectedKyc(null)
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

  return (
    <div className="min-h-screen bg-admin-bg pb-24">
      <h1 className="text-lg font-bold text-admin-text px-4 pt-6">Verificaciones KYC</h1>

      {/* Metrics scroll */}
      <div className="flex gap-3 overflow-x-auto pt-4 pb-4 scrollbar-hide -mx-4 px-4 mb-4">
        <div className="bg-admin-card-bg border border-admin-border p-3 rounded-xl shrink-0 w-36">
          <p className="text-[9px] font-bold text-admin-text-muted uppercase mb-0.5">En revisión</p>
          <p className="text-lg font-bold text-admin-warning">{inReviewCount}</p>
        </div>
        <div className="bg-admin-card-bg border border-admin-border p-3 rounded-xl shrink-0 w-36">
          <p className="text-[9px] font-bold text-admin-text-muted uppercase mb-0.5">Verificados</p>
          <p className="text-lg font-bold text-admin-success">{approvedCount}</p>
        </div>
        <div className="bg-admin-card-bg border border-admin-border p-3 rounded-xl shrink-0 w-36">
          <p className="text-[9px] font-bold text-admin-text-muted uppercase mb-0.5">Rechazados</p>
          <p className="text-lg font-bold text-admin-error">{rejectedCount}</p>
        </div>
      </div>

      {/* Search & filters */}
      <div className="px-4 space-y-3 mb-4">
        <input 
          type="text" 
          placeholder="Buscar por nombre, correo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 px-3 border border-admin-border rounded-xl text-xs font-semibold focus:border-admin-accent bg-admin-bg text-admin-text outline-none"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {[
            { key: "TODAS", label: "Todos" },
            { key: "EN_REVISION", label: "En Revisión" },
            { key: "APROBADOS", label: "Verificados" },
            { key: "RECHAZADOS", label: "Rechazados" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg shrink-0 border border-admin-border cursor-pointer transition-colors ${
                filter === tab.key 
                  ? "bg-admin-accent text-white border-admin-accent" 
                  : "bg-admin-card-bg text-admin-text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filteredList.length > 0 ? (
          filteredList.map(v => (
            <div key={v.id} className="bg-admin-card-bg border border-admin-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-admin-text truncate max-w-[200px]">{v.user.name}</h3>
                  <p className="text-[10px] text-admin-text-muted mt-0.5">{v.user.email} • {v.user.role}</p>
                </div>
                {getStatusBadge(v.status)}
              </div>

              <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-admin-text-muted border-t border-b border-admin-border py-2 text-center">
                <div>
                  <span className="block text-[8px] uppercase">DNI</span>
                  <span className={v.dniVerified ? "text-admin-success" : "text-admin-text-muted"}>{v.dniVerified ? "✓ Si" : "⚙ Pend"}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase">Rostro</span>
                  <span className={v.biometricVerified ? "text-admin-success" : "text-admin-text-muted"}>{v.biometricVerified ? "✓ Valid" : "⚙ Pend"}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase">Penal</span>
                  <span className={v.backgroundCheck ? "text-admin-success" : "text-admin-text-muted"}>{v.backgroundCheck ? "✓ Limp" : "⚙ Pend"}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                {v.status === "EN_REVISION" ? (
                  <button
                    onClick={() => {
                      setSelectedKyc(v)
                      setRejectMode(false)
                      setRejectionReason("")
                    }}
                    className="w-full h-10 bg-admin-accent text-white rounded-lg font-bold text-xs cursor-pointer border-0 shadow-sm"
                  >
                    Evaluar Expediente
                  </button>
                ) : (
                  <button
                    onClick={() => setViewKyc(v)}
                    className="w-full h-10 border border-admin-border text-admin-text hover:bg-admin-bg rounded-lg font-bold text-xs cursor-pointer bg-transparent"
                  >
                    Ver Detalles
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-admin-card-bg border border-admin-border rounded-xl">
            <SecurityCheckIcon size={36} className="text-admin-border mx-auto mb-2" />
            <p className="text-xs font-bold text-admin-text mb-0.5">Sin registros</p>
            <p className="text-[10px] text-admin-text-muted">No se registran solicitudes.</p>
          </div>
        )}
      </div>

      {/* MOBILE MODAL 1: Evaluar */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-end justify-center">
          <div className="bg-admin-card-bg border-t border-admin-border shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="bg-admin-bg border-b border-admin-border px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-admin-text">Evaluar Solicitud</h3>
                <p className="text-[10px] text-admin-text-muted mt-0.5">{selectedKyc.user.name} • {selectedKyc.user.role}</p>
              </div>
              <button 
                onClick={() => setSelectedKyc(null)}
                className="p-1.5 text-admin-text-muted hover:text-admin-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-admin-bg"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 pb-8">
              {modalError && (
                <div className="bg-red-950/20 border border-red-500/35 text-red rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-500/35 text-emerald-500 rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <CheckmarkCircle01Icon size={14} className="shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              {(selectedKyc.dniDocument || selectedKyc.selfiePhoto) && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedKyc.dniDocument && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-admin-text-muted uppercase block font-bold">DNI:</span>
                      <div className="border border-admin-border rounded-xl overflow-hidden relative h-32 bg-admin-bg flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedKyc.dniDocument}
                          alt="DNI"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {selectedKyc.selfiePhoto && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-admin-text-muted uppercase block font-bold">Selfie:</span>
                      <div className="border border-admin-border rounded-xl overflow-hidden relative h-32 bg-admin-bg flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedKyc.selfiePhoto}
                          alt="Selfie"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-admin-bg border border-admin-border p-3 rounded-lg text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Cotejo Facial:</span>
                  {selectedKyc.faceMatchScore != null ? (
                    <span className={`font-bold ${selectedKyc.biometricVerified ? "text-admin-success" : "text-admin-warning"}`}>
                      {Math.round(selectedKyc.faceMatchScore)}% coincidencia
                    </span>
                  ) : (
                    <span className="text-admin-warning font-bold">⚙ Pendiente</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Antecedentes Penales:</span>
                  {selectedKyc.backgroundCheck ? (
                    <span className="text-admin-success font-bold">✓ Limpio</span>
                  ) : (
                    <span className="text-admin-warning font-bold">⚙ Pendiente</span>
                  )}
                </div>
              </div>

              {rejectMode ? (
                <form onSubmit={handleReject} className="space-y-3 pt-3 border-t border-admin-border">
                  <div>
                    <label className="block text-[10px] font-bold text-red mb-1 uppercase">Motivo del Rechazo</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Ingrese los comentarios para el usuario..."
                      className="w-full p-3 border border-red-500/30 rounded-xl text-xs font-semibold bg-admin-bg text-admin-text focus:border-red outline-none resize-none"
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
                      className="w-full h-11 border border-admin-border bg-transparent rounded-xl text-xs font-bold text-admin-text-muted cursor-pointer hover:bg-admin-bg"
                    >
                      Volver
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2 pt-3 border-t border-admin-border">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !!modalSuccess}
                    className="w-full h-11 bg-admin-accent text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    Aprobar y Verificar Cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectMode(true)}
                    className="w-full h-11 border border-red text-red rounded-xl text-xs font-bold cursor-pointer bg-transparent"
                  >
                    Rechazar Solicitud
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MOBILE MODAL 2: Ver Detalles */}
      {viewKyc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-end justify-center">
          <div className="bg-admin-card-bg border-t border-admin-border shadow-2xl rounded-t-2xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            <div className="bg-admin-bg border-b border-admin-border px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-admin-text">Detalle KYC</h3>
                <p className="text-[10px] text-admin-text-muted mt-0.5">{viewKyc.user.name}</p>
              </div>
              <button 
                onClick={() => setViewKyc(null)}
                className="p-1.5 text-admin-text-muted hover:text-admin-text bg-transparent border-0 cursor-pointer rounded-lg hover:bg-admin-bg"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 pb-8 text-xs font-semibold text-admin-text">
              <div className="bg-admin-bg border border-admin-border p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Estado:</span>
                  <span>{getStatusBadge(viewKyc.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Verificado:</span>
                  <span>{viewKyc.user.verified ? "✓ Sí" : "⚙ No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Evaluado el:</span>
                  <span>{viewKyc.verifiedAt ? formatLocalDate(viewKyc.verifiedAt) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-text-muted">Radicado el:</span>
                  <span>{formatLocalDate(viewKyc.createdAt)}</span>
                </div>
              </div>

              {(viewKyc.dniDocument || viewKyc.selfiePhoto) && (
                <div className="grid grid-cols-2 gap-2">
                  {viewKyc.dniDocument && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-admin-text-muted uppercase block">DNI</span>
                      <div className="border border-admin-border rounded-xl overflow-hidden relative h-32 bg-admin-bg flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={viewKyc.dniDocument}
                          alt="DNI"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {viewKyc.selfiePhoto && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-admin-text-muted uppercase block">Selfie</span>
                      <div className="border border-admin-border rounded-xl overflow-hidden relative h-32 bg-admin-bg flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={viewKyc.selfiePhoto}
                          alt="Selfie"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {viewKyc.faceMatchScore != null && (
                <div className="bg-admin-bg border border-admin-border p-3 rounded-lg text-[10px]">
                  <span className="text-admin-text-muted block mb-0.5">Cotejo Facial:</span>
                  <span className={`font-bold ${viewKyc.biometricVerified ? "text-admin-success" : "text-admin-warning"}`}>
                    {Math.round(viewKyc.faceMatchScore)}% coincidencia
                  </span>
                </div>
              )}

              {viewKyc.reviewNotes && (
                <div className="bg-red-950/10 border border-red-500/20 p-3 rounded-lg text-red">
                  <span className="text-[9px] uppercase font-bold block mb-1">Notas:</span>
                  <p className="font-normal text-admin-text leading-normal">{viewKyc.reviewNotes}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setViewKyc(null)}
                className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 mt-2"
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
