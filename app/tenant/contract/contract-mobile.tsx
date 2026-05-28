"use client"

import Link from "next/link"
import { 
  FileValidationIcon, 
  Home01Icon, 
  Location01Icon, 
  Download01Icon, 
  SignatureIcon, 
  SecurityCheckIcon
} from "hugeicons-react"
import type { TenantContractItem } from "./contract-view"

interface Props {
  contracts: TenantContractItem[]
}

export function TenantContractMobile({ contracts }: Props) {
  const activeContract = contracts.find(c => c.status === "ACTIVE")
  const pendingContract = contracts.find(c => c.status === "PENDING_TENANT" || c.status === "DRAFT")
  const waitingContract = contracts.find(c => c.status === "PENDING_LANDLORD")
  const pastContracts = contracts.filter(c => ["FINISHED", "BREACHED_CANCELLED"].includes(c.status))

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250 rounded">Vigente</span>
      case "PENDING_TENANT":
      case "DRAFT":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-250 rounded animate-pulse">Pendiente Firma</span>
      case "PENDING_LANDLORD":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-250 rounded">Propietario</span>
      case "FINISHED":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 rounded">Finalizado</span>
      case "BREACHED_CANCELLED":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-red/10 text-red border border-red/20 rounded">Rescindido</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-bg-2 pb-24">
      {/* Top Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text">Mi Contrato</h1>
        <p className="text-xs font-medium text-text-muted mt-1">Consulta tu arriendo activo e historial</p>
      </div>

      {/* Main Flow Containers */}
      <div className="px-4 space-y-4">
        
        {/* 1. Borrador Pendiente de Firma */}
        {pendingContract && (
          <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
            <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-2">
              Firma Requerida
            </span>
            <h3 className="font-bold text-sm text-text mb-1 truncate">{pendingContract.property.title}</h3>
            <p className="text-[11px] text-text-muted leading-normal mb-3">
              Tienes un contrato de arrendamiento en <strong>{pendingContract.property.district}</strong> listo para tu firma digital.
            </p>
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg mb-3 text-[11px] font-semibold text-text">
              <span>Alquiler: S/ {pendingContract.monthlyRent}</span>
              <span>Garantía: S/ {pendingContract.deposit}</span>
            </div>
            <Link
              href={`/contracts/${pendingContract.id}`}
              className="w-full h-11 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <SignatureIcon size={14} />
              <span>Ver y Firmar Contrato</span>
            </Link>
          </div>
        )}

        {/* 2. Esperando Firma Propietario */}
        {waitingContract && (
          <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm">
            <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-bold px-2 py-0.5 inline-block mb-2">
              Firma Registrada
            </span>
            <h3 className="font-bold text-sm text-text mb-1 truncate">{waitingContract.property.title}</h3>
            <p className="text-[11px] text-text-muted leading-normal mb-3">
              Firmaste este contrato. Se activará en cuanto el propietario ({waitingContract.landlord.firstName}) firme la contrafirma.
            </p>
            <Link
              href={`/contracts/${waitingContract.id}`}
              className="w-full h-10 border border-indigo-250 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer no-underline"
            >
              <span>Ver Contrato Firmado</span>
            </Link>
          </div>
        )}

        {/* 3. Contrato Activo / Vigente */}
        {activeContract && (
          <div className="space-y-4">
            {/* Core Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-text">
                  <FileValidationIcon size={18} className="text-emerald-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Arriendo Vigente</span>
                </div>
                {getStatusBadge(activeContract.status)}
              </div>

              <h3 className="font-bold text-sm text-text truncate mb-1">{activeContract.property.title}</h3>
              <p className="text-[10px] text-text-muted flex items-center gap-1 mb-4">
                <Location01Icon size={12} className="text-slate-400" />
                <span>{activeContract.property.district} • {activeContract.property.address}</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[9px] text-text-muted uppercase font-bold block mb-0.5">Alquiler</span>
                  <span className="text-sm font-extrabold text-text">S/ {activeContract.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[9px] text-text-muted uppercase font-bold block mb-0.5">Día de Pago</span>
                  <span className="text-sm font-extrabold text-text">Día {activeContract.paymentDay}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-text-muted font-semibold">
                <div className="flex justify-between">
                  <span>Inicio:</span>
                  <span className="text-text">{formatLocalDate(activeContract.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fin:</span>
                  <span className="text-text">{formatLocalDate(activeContract.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Payment Account */}
            {(() => {
              let paymentAccount = {
                provider: "BCP",
                accountNumber: "Consultar con el arrendador",
                accountHolder: `${activeContract.landlord.firstName} ${activeContract.landlord.lastName}`
              }
              try {
                const parsed = activeContract.terms ? JSON.parse(activeContract.terms) : null
                if (parsed?.paymentAccount) {
                  paymentAccount = parsed.paymentAccount
                }
              } catch {}

              return (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Cuentas de Alquiler</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-[11px] font-semibold text-text space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Banco:</span>
                      <span className="font-extrabold text-accent">{paymentAccount.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Cuenta:</span>
                      <span className="font-mono font-bold select-all">{paymentAccount.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Titular:</span>
                      <span>{paymentAccount.accountHolder}</span>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Landlord & PDF */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-text mb-2 uppercase tracking-wider">Propietario</h4>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                    {activeContract.landlord.firstName[0]}{activeContract.landlord.lastName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text">{activeContract.landlord.firstName} {activeContract.landlord.lastName}</p>
                    <p className="text-[10px] text-text-muted">{activeContract.landlord.email}</p>
                  </div>
                </div>
              </div>

              {activeContract.landlord.phone && (
                <a
                  href={`https://wa.me/51${activeContract.landlord.phone.replace(/\D/g, "")}?text=Hola%20${activeContract.landlord.firstName},%20te%20escribo%20desde%20Habita%20Perú.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#25D366] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
                >
                  <span className="text-base">💬</span>
                  <span>Enviar WhatsApp</span>
                </a>
              )}

              <a
                href={`/api/contracts/${activeContract.id}/download`}
                target="_blank"
                className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
              >
                <Download01Icon size={14} />
                <span>Descargar PDF</span>
              </a>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!activeContract && !pendingContract && !waitingContract && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <FileValidationIcon size={24} />
            </div>
            <h3 className="text-sm font-bold text-text mb-1">Sin contratos</h3>
            <p className="text-[11px] font-medium text-text-muted mb-6 max-w-xs mx-auto leading-relaxed">
              No registras contratos activos o pendientes en Habita Perú.
            </p>
            <Link
              href="/propiedades"
              className="w-full h-11 bg-accent text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer no-underline shadow-sm"
            >
              Buscar Alquileres
            </Link>
          </div>
        )}

        {/* Past Contracts History (Compact Cards) */}
        {pastContracts.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Historial</h4>
            <div className="space-y-3">
              {pastContracts.map(c => (
                <div key={c.id} className="bg-white border border-slate-250 rounded-xl p-3.5 flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="text-xs font-bold text-text truncate max-w-[180px]">{c.property.title}</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">S/ {c.monthlyRent} • {getStatusBadge(c.status)}</p>
                  </div>
                  <a 
                    href={`/api/contracts/${c.id}/download`}
                    target="_blank"
                    className="size-9 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center text-text-muted no-underline"
                  >
                    <Download01Icon size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
