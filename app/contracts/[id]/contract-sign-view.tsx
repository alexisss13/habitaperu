'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileValidationIcon, SecurityCheckIcon, CheckmarkCircle02Icon,
  Clock05Icon, AlertCircleIcon, UserCircleIcon, Building03Icon,
  CalendarAdd01Icon, Wallet01Icon, ArrowLeft01Icon
} from "hugeicons-react"
import { recordContractView, signContractAsTenant, counterSignAsLandlord } from "@/app/actions/contract-actions"

interface AuditEntry {
  id: string
  action: string
  userId: string
  timestamp: string
  ipAddress: string | null
}

interface ContractSignProps {
  contract: {
    id: string
    status: string
    monthlyRent: number
    currency: string
    deposit: number
    startDate: string
    endDate: string
    paymentDay: number
    tenantSignedAt: string | null
    landlordSignedAt: string | null
    documentHash: string | null
    landlord: { id: string; firstName: string; lastName: string; email: string; phone: string | null; verified: boolean }
    tenant: { id: string; firstName: string; lastName: string; email: string; phone: string | null }
    property: { id: string; title: string; address: string | null; district: string; type: string; area: number | null; rooms: number | null; bathrooms: number | null }
    auditLogs: AuditEntry[]
  }
  currentUserId: string
  currentUserRole: string
}

const STATUS_LABELS: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  DRAFT:              { label: "Borrador",               cls: "bg-gray-100 text-gray-500",   Icon: Clock05Icon },
  PENDING_TENANT:     { label: "Esperando firma del inquilino", cls: "bg-amber-100 text-amber-700", Icon: Clock05Icon },
  PENDING_LANDLORD:   { label: "Esperando contrafirma del arrendador", cls: "bg-amber-100 text-amber-700", Icon: Clock05Icon },
  ACTIVE:             { label: "Activo",                 cls: "bg-green/10 text-green",       Icon: CheckmarkCircle02Icon },
  FINISHED:           { label: "Finalizado",             cls: "bg-gray-100 text-gray-500",   Icon: CheckmarkCircle02Icon },
  BREACHED_CANCELLED: { label: "Rescindido (Ley 30933)", cls: "bg-red/10 text-red",           Icon: AlertCircleIcon },
}

const ACTION_LABELS: Record<string, string> = {
  VIEWED: "Documento visualizado",
  SIGNED_TENANT: "Firmado por el inquilino",
  COUNTERSIGNED_LANDLORD: "Contrafirmado por el arrendador",
}

export function ContractSignView({ contract, currentUserId, currentUserRole }: ContractSignProps) {
  const router = useRouter()
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState("")
  const [viewRecorded, setViewRecorded] = useState(false)
  const [scrolledThrough, setScrolledThrough] = useState(false)
  const contractBodyRef = useRef<HTMLDivElement>(null)

  const isTenant = currentUserId === contract.tenant.id
  const isLandlord = currentUserId === contract.landlord.id
  const isAdmin = currentUserRole === "ADMIN"

  const canSignAsTenant = isTenant && contract.status === "PENDING_TENANT" && !contract.tenantSignedAt
  const canSignAsLandlord = isLandlord && contract.status === "PENDING_LANDLORD" && !contract.landlordSignedAt

  useEffect(() => {
    if (viewRecorded) return
    recordContractView(contract.id).then(() => setViewRecorded(true))
  }, [contract.id, viewRecorded])

  useEffect(() => {
    const el = contractBodyRef.current
    if (!el) return
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
        setScrolledThrough(true)
      }
    }
    el.addEventListener("scroll", onScroll)
    onScroll()
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  const handleSign = async () => {
    setSigning(true)
    setError("")
    try {
      const result = isTenant
        ? await signContractAsTenant(contract.id)
        : await counterSignAsLandlord(contract.id)

      if (result.success) {
        router.refresh()
      } else {
        setError(result.error?.message ?? "Error al firmar el contrato.")
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setSigning(false)
    }
  }

  const statusInfo = STATUS_LABELS[contract.status] ?? STATUS_LABELS.DRAFT
  const StatusIcon = statusInfo.Icon

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" })

  const fmtShort = (iso: string) =>
    new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Lima" })

  const typeLabels: Record<string, string> = {
    HABITACION: "Habitación", DEPARTAMENTO: "Departamento",
    CASA: "Casa", OFICINA: "Oficina", LOCAL: "Local",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">

        {/* Back + Status */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link
            href={isTenant ? "/tenant/contract" : isLandlord ? "/landlord/contracts" : "/admin/contracts"}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-accent no-underline transition-colors"
          >
            <ArrowLeft01Icon size={16} />
            Volver
          </Link>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.cls}`}>
            <StatusIcon size={13} />
            {statusInfo.label}
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#151c26] flex items-center gap-3 mb-1">
            <FileValidationIcon size={26} className="text-accent" />
            Contrato de Arrendamiento
          </h1>
          <p className="text-xs text-gray-400 font-mono">ID: {contract.id}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {/* Main contract body — 2/3 width */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Parties */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-[#151c26] text-sm mb-4 flex items-center gap-2">
                <UserCircleIcon size={16} className="text-accent" />
                Partes del contrato
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">Arrendador</p>
                  <p className="font-semibold text-[#151c26] text-sm">{contract.landlord.firstName} {contract.landlord.lastName}</p>
                  <p className="text-xs text-gray-400">{contract.landlord.email}</p>
                  {contract.landlord.phone && <p className="text-xs text-gray-400">{contract.landlord.phone}</p>}
                  {contract.landlord.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full mt-1">
                      <CheckmarkCircle02Icon size={10} /> Verificado
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">Inquilino</p>
                  <p className="font-semibold text-[#151c26] text-sm">{contract.tenant.firstName} {contract.tenant.lastName}</p>
                  <p className="text-xs text-gray-400">{contract.tenant.email}</p>
                  {contract.tenant.phone && <p className="text-xs text-gray-400">{contract.tenant.phone}</p>}
                </div>
              </div>
            </div>

            {/* Property */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-[#151c26] text-sm mb-4 flex items-center gap-2">
                <Building03Icon size={16} className="text-accent" />
                Propiedad arrendada
              </h2>
              <p className="font-semibold text-[#151c26]">{contract.property.title}</p>
              <p className="text-xs text-gray-400 mb-2">
                {typeLabels[contract.property.type] ?? contract.property.type} — {contract.property.district}
                {contract.property.address && ` — ${contract.property.address}`}
              </p>
              <div className="flex gap-3 text-xs text-gray-500">
                {contract.property.rooms && <span>{contract.property.rooms} dorm.</span>}
                {contract.property.bathrooms && <span>{contract.property.bathrooms} baño(s)</span>}
                {contract.property.area && <span>{contract.property.area} m²</span>}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-[#151c26] text-sm mb-4 flex items-center gap-2">
                <Wallet01Icon size={16} className="text-accent" />
                Condiciones económicas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Renta mensual</p>
                  <p className="text-xl font-bold text-accent">
                    {contract.currency === "PEN" ? "S/" : "$"} {contract.monthlyRent.toLocaleString("es-PE")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Depósito de garantía</p>
                  <p className="text-lg font-bold text-[#151c26]">
                    {contract.currency === "PEN" ? "S/" : "$"} {contract.deposit.toLocaleString("es-PE")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Vigencia</p>
                  <p className="text-sm font-semibold text-[#151c26]">{fmt(contract.startDate)}</p>
                  <p className="text-xs text-gray-400">hasta {fmt(contract.endDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Día de pago</p>
                  <p className="text-sm font-semibold text-[#151c26]">Día {contract.paymentDay} de cada mes</p>
                </div>
              </div>
            </div>

            {/* Legal framework */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-[#151c26] text-sm mb-3 flex items-center gap-2">
                <SecurityCheckIcon size={16} className="text-accent" />
                Marco legal aplicable
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { ley: "Ley 27269", desc: "Firmas y Certificados Digitales — firma electrónica con validez legal" },
                  { ley: "Ley 30201", desc: "Allanamiento Futuro — cláusula de desocupación voluntaria ante incumplimiento" },
                  { ley: "Ley 30933", desc: "Desalojo Notarial Exprés — aplicable tras 2 meses de impago" },
                  { ley: "Ley 29733", desc: "Protección de Datos Personales — datos tratados conforme a LOPD" },
                ].map(({ ley, desc }) => (
                  <div key={ley} className="flex items-start gap-2.5">
                    <span className="shrink-0 text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded mt-0.5">{ley}</span>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
              {contract.documentHash && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 mb-1 font-semibold">Hash SHA-256 del documento</p>
                  <p className="text-[10px] font-mono text-gray-400 break-all">{contract.documentHash}</p>
                </div>
              )}
            </div>

            {/* Sign action */}
            {(canSignAsTenant || canSignAsLandlord) && (
              <div
                ref={contractBodyRef}
                className="bg-white rounded-2xl border-2 border-accent/20 shadow-sm p-5"
              >
                <h2 className="font-bold text-[#151c26] text-sm mb-3">Firma electrónica</h2>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Al hacer clic en <strong>&quot;Aceptar y Firmar&quot;</strong>, confirmas que has leído y aceptas los
                  términos del presente contrato de arrendamiento, dando consentimiento electrónico
                  con plena validez legal conforme a la Ley N° 27269 (Firmas y Certificados Digitales del Perú).
                  Esta acción queda registrada en el Audit Trail con tu IP y fecha/hora exacta (UTC‑5 Lima).
                </p>
                {error && (
                  <div className="mb-4 px-4 py-3 bg-red/10 text-red rounded-xl text-sm font-semibold">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSign}
                  disabled={signing || !viewRecorded}
                  className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent/90 transition-all cursor-pointer border-none disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {signing ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Firmando...
                    </>
                  ) : (
                    <>
                      <CheckmarkCircle02Icon size={16} />
                      Aceptar y Firmar
                    </>
                  )}
                </button>
                {!viewRecorded && (
                  <p className="text-[11px] text-gray-400 text-center mt-2">Registrando visualización...</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 width */}
          <div className="flex flex-col gap-4">

            {/* Signature status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-[#151c26] text-sm mb-3 flex items-center gap-2">
                <CalendarAdd01Icon size={14} className="text-accent" />
                Estado de firmas
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  {contract.tenantSignedAt ? (
                    <CheckmarkCircle02Icon size={16} className="text-green shrink-0 mt-0.5" />
                  ) : (
                    <Clock05Icon size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[#151c26]">Inquilino</p>
                    <p className="text-[11px] text-gray-400">
                      {contract.tenantSignedAt ? fmtShort(contract.tenantSignedAt) : "Pendiente"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  {contract.landlordSignedAt ? (
                    <CheckmarkCircle02Icon size={16} className="text-green shrink-0 mt-0.5" />
                  ) : (
                    <Clock05Icon size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[#151c26]">Arrendador</p>
                    <p className="text-[11px] text-gray-400">
                      {contract.landlordSignedAt ? fmtShort(contract.landlordSignedAt) : "Pendiente"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active state signed confirmation */}
            {contract.status === "ACTIVE" && (
              <div className="bg-green/5 border border-green/20 rounded-2xl p-4 text-center">
                <CheckmarkCircle02Icon size={24} className="text-green mx-auto mb-2" />
                <p className="text-sm font-bold text-green">Contrato activo</p>
                <p className="text-xs text-gray-500 mt-1">Ambas partes han firmado</p>
              </div>
            )}

            {/* Audit trail */}
            {contract.auditLogs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#151c26] text-xs uppercase tracking-wide">Audit Trail</h3>
                  <Link
                    href={`/contracts/${contract.id}/audit`}
                    className="text-[11px] font-semibold text-accent no-underline hover:underline"
                  >
                    Ver completo →
                  </Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  {contract.auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <div className="size-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#151c26]">
                          {ACTION_LABELS[log.action] ?? log.action}
                        </p>
                        <p className="text-[10px] text-gray-400">{fmtShort(log.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin-only: download link */}
            {(isAdmin || contract.status === "ACTIVE") && (
              <Link
                href={`/api/contracts/${contract.id}/download`}
                className="block text-center py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-accent hover:bg-accent/5 transition-colors no-underline"
              >
                Descargar contrato
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
