"use client"

import Link from "next/link"
import { 
  FileValidationIcon, 
  Home01Icon, 
  BedIcon, 
  Bathtub02Icon, 
  SquareIcon, 
  Location01Icon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Download01Icon, 
  SignatureIcon, 
  SecurityCheckIcon
} from "hugeicons-react"
import type { TenantContractItem } from "./contract-view"

interface Props {
  contracts: TenantContractItem[]
}

export function TenantContractDesktop({ contracts }: Props) {
  // Find active, pending, or past contracts
  const activeContract = contracts.find(c => c.status === "ACTIVE")
  const pendingContract = contracts.find(c => c.status === "PENDING_TENANT" || c.status === "DRAFT")
  const waitingContract = contracts.find(c => c.status === "PENDING_LANDLORD")
  const pastContracts = contracts.filter(c => ["FINISHED", "BREACHED_CANCELLED"].includes(c.status))

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Vigente / Activo</span>
      case "PENDING_TENANT":
      case "DRAFT":
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Pendiente de tu firma</span>
      case "PENDING_LANDLORD":
        return <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">Esperando Propietario</span>
      case "FINISHED":
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">Finalizado</span>
      case "BREACHED_CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-bold bg-red/10 text-red border border-red/20 rounded-lg">Rescindido</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg">{status}</span>
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case "HABITACION": return "Habitación"
      case "DEPARTAMENTO": return "Departamento"
      case "CASA": return "Casa"
      case "OFICINA": return "Oficina"
      case "LOCAL": return "Local Comercial"
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-bg-2 pt-[80px]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-2">Mi Contrato de Alquiler</h1>
          <p className="text-base font-medium text-text-muted">
            Consulta los términos de tu arriendo, descarga tu copia firmada y revisa el historial.
          </p>
        </div>

        {/* 1. Contrato Activo / Vigente */}
        {activeContract && (
          <div className="grid grid-cols-3 gap-6 mb-10">
            {/* Left side (2 cols): Core Details & Payment accounts */}
            <div className="col-span-2 space-y-6">
              {/* Main Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                      <FileValidationIcon size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-text">Contrato de Arrendamiento</h2>
                      <p className="text-xs text-text-muted mt-0.5">Código: {activeContract.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(activeContract.status)}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Inmueble Arrendado</span>
                  <Link 
                    href={`/propiedades/${activeContract.property.id}`}
                    className="text-base font-bold text-text hover:text-accent no-underline block truncate mb-2"
                  >
                    {activeContract.property.title}
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mb-4">
                    <Location01Icon size={14} className="text-slate-400" />
                    <span>{activeContract.property.district} • {activeContract.property.address}</span>
                  </div>
                  
                  <div className="flex gap-6 text-slate-500 text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <BedIcon size={16} className="text-slate-400" />
                      <span>{activeContract.property.rooms} hab.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bathtub02Icon size={16} className="text-slate-400" />
                      <span>{activeContract.property.bathrooms} bañ.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SquareIcon size={16} className="text-slate-400" />
                      <span>{activeContract.property.area} m²</span>
                    </div>
                  </div>
                </div>

                {/* Financial & Contract Specs Grid */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="border border-slate-100 rounded-xl p-4 bg-white">
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Renta Mensual</span>
                    <p className="text-xl font-extrabold text-text">S/ {activeContract.monthlyRent.toLocaleString()}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">Moneda: {activeContract.currency}</span>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 bg-white">
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Garantía</span>
                    <p className="text-xl font-extrabold text-text">S/ {activeContract.deposit.toLocaleString()}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">Depósito de seguridad</span>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 bg-white">
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Día de Pago</span>
                    <p className="text-xl font-extrabold text-text">Día {activeContract.paymentDay}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">De cada mes</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-6 text-xs font-semibold text-text">
                  <div>
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Fecha de Inicio</span>
                    <p className="text-sm font-bold">{formatLocalDate(activeContract.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Fecha de Término</span>
                    <p className="text-sm font-bold">{formatLocalDate(activeContract.endDate)}</p>
                  </div>
                </div>
              </div>

              {/* Bank Account/Payment Instructions Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Instrucciones de Pago</h3>
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
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Banco / Proveedor</span>
                        <p className="text-sm font-extrabold text-accent">{paymentAccount.provider}</p>
                        
                        <div className="mt-3">
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-0.5">Número de Cuenta</span>
                          <p className="text-sm font-mono font-bold select-all text-slate-800">{paymentAccount.accountNumber}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Titular</span>
                        <p className="text-sm font-bold text-text">{paymentAccount.accountHolder}</p>
                        
                        <div className="mt-3">
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-0.5">Destino de Pago</span>
                          <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block font-semibold">Alquiler Mensual</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Right side (1 col): Landlord contact & Security Seal */}
            <div className="space-y-6">
              {/* Landlord Contact Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Arrendador</h3>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg">
                    {activeContract.landlord.firstName[0]}{activeContract.landlord.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{activeContract.landlord.firstName} {activeContract.landlord.lastName}</p>
                    <p className="text-xs text-text-muted">{activeContract.landlord.email}</p>
                  </div>
                </div>

                {activeContract.landlord.phone && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-xs font-semibold text-text">
                      Teléfono: <span className="text-text-muted">{activeContract.landlord.phone}</span>
                    </p>
                    <a
                      href={`https://wa.me/51${activeContract.landlord.phone.replace(/\D/g, "")}?text=Hola%20${activeContract.landlord.firstName},%20te%20escribo%20desde%20Habita%20Perú%20por%20el%20alquiler.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-11 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
                    >
                      <span className="text-sm">💬</span>
                      <span>Contactar por WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* LegalTech Seal */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <SecurityCheckIcon size={20} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-text">Respaldo Criptográfico</h4>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                      Este contrato cuenta con sello digital e inmutabilidad garantizada mediante tecnología LegalTech bajo la firma del inquilino y propietario.
                    </p>
                  </div>
                </div>

                {activeContract.documentHash && (
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 font-mono text-[9px] break-all select-all text-slate-500 mb-4">
                    {activeContract.documentHash}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-text-muted">
                  <div className="flex justify-between">
                    <span>Firma Inquilino:</span>
                    <span className="text-green">
                      {activeContract.tenantSignedAt ? formatLocalDate(activeContract.tenantSignedAt) : "Pendiente"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firma Propietario:</span>
                    <span className="text-green">
                      {activeContract.landlordSignedAt ? formatLocalDate(activeContract.landlordSignedAt) : "Pendiente"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={`/api/contracts/${activeContract.id}/download`}
                    target="_blank"
                    className="w-full h-12 bg-[#151c26] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
                  >
                    <Download01Icon size={16} />
                    <span>Descargar PDF del Contrato</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Alerta de Contrato Pendiente de Firma */}
        {pendingContract && (
          <div className="bg-white border border-amber-200 shadow-lg rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-600 shrink-0">
                <SignatureIcon size={28} />
              </div>
              <div>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-1.5">
                  Firma Pendiente (Clickwrap)
                </span>
                <h2 className="text-lg font-bold text-text">Tienes un contrato de arrendamiento listo para firmar</h2>
                <p className="text-xs text-text-muted mt-1 max-w-xl">
                  El propietario ha generado un borrador de contrato para el inmueble <strong className="text-text">{pendingContract.property.title}</strong> en {pendingContract.property.district}. Por favor revisa los términos legales y fírmalo digitalmente para activar tu alquiler.
                </p>
                <div className="flex gap-4 mt-3 text-xs font-semibold text-text">
                  <p>Precio: S/ {pendingContract.monthlyRent.toLocaleString()}/mes</p>
                  <p>Garantía: S/ {pendingContract.deposit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Link
              href={`/contracts/${pendingContract.id}`}
              className="h-12 px-6 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline shrink-0"
            >
              <SignatureIcon size={16} />
              <span>Ver y Firmar Contrato</span>
            </Link>
          </div>
        )}

        {/* 3. Esperando Firma de la Otra Parte */}
        {waitingContract && (
          <div className="bg-white border border-indigo-200 shadow-sm rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600 shrink-0">
                <SecurityCheckIcon size={28} />
              </div>
              <div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-bold px-2 py-0.5 inline-block mb-1.5">
                  Esperando Contrafirma
                </span>
                <h2 className="text-lg font-bold text-text">Contrato firmado — Esperando al arrendador</h2>
                <p className="text-xs text-text-muted mt-1 max-w-xl">
                  Has firmado digitalmente el contrato para <strong className="text-text">{waitingContract.property.title}</strong>. El contrato se activará en cuanto el propietario ({waitingContract.landlord.firstName} {waitingContract.landlord.lastName}) contrafirme el documento.
                </p>
              </div>
            </div>
            
            <Link
              href={`/contracts/${waitingContract.id}`}
              className="h-11 px-5 border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline shrink-0"
            >
              <span>Ver Documento</span>
            </Link>
          </div>
        )}

        {/* Empty state (Si no hay ningún contrato activo ni pendiente) */}
        {!activeContract && !pendingContract && !waitingContract && (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto my-10">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-6">
              <FileValidationIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Sin contratos registrados</h3>
            <p className="text-xs font-medium text-text-muted max-w-sm mx-auto mb-8 leading-relaxed">
              Actualmente no tienes ningún contrato de arrendamiento activo, borrador o pendiente de firma en la plataforma.
            </p>
            <Link
              href="/propiedades"
              className="inline-flex h-12 items-center justify-center px-6 rounded-xl text-xs font-bold text-white transition-all no-underline shadow-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
            >
              Explorar Propiedades Disponibles
            </Link>
          </div>
        )}

        {/* Historial de Contratos Anteriores */}
        {pastContracts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Historial de Contratos</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-text-muted">
                    <th className="p-4">Propiedad</th>
                    <th className="p-4">Arrendador</th>
                    <th className="p-4">Vigencia</th>
                    <th className="p-4">Renta Mensual</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pastContracts.map(c => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors text-xs">
                      <td className="p-4">
                        <p className="font-bold text-text truncate max-w-[200px]">{c.property.title}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{c.property.district}</p>
                      </td>
                      <td className="p-4 text-text-muted font-medium">
                        {c.landlord.firstName} {c.landlord.lastName}
                      </td>
                      <td className="p-4 text-text-muted font-medium">
                        {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-text">
                        S/ {c.monthlyRent.toLocaleString()}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="p-4 text-right">
                        <a 
                          href={`/api/contracts/${c.id}/download`}
                          target="_blank"
                          className="inline-flex h-9 items-center justify-center px-3 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-text-muted no-underline"
                        >
                          <Download01Icon size={14} className="mr-1" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
