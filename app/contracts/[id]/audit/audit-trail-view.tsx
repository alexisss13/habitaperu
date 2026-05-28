'use client'

import Link from "next/link"
import {
  ArrowLeft01Icon, SecurityCheckIcon, CheckmarkCircle02Icon,
  Clock05Icon, FileValidationIcon, UserCircleIcon
} from "hugeicons-react"

const ACTION_META: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  VIEWED:                { label: "Documento visualizado",     color: "bg-blue-50 text-blue-700 border-blue-200",    Icon: FileValidationIcon },
  SIGNED_TENANT:         { label: "Firmado por el inquilino",  color: "bg-amber-50 text-amber-700 border-amber-200", Icon: CheckmarkCircle02Icon },
  COUNTERSIGNED_LANDLORD:{ label: "Contrafirmado por el arrendador", color: "bg-green/10 text-green border-green/30",   Icon: SecurityCheckIcon },
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  DRAFT:               { label: "Borrador",        cls: "bg-gray-100 text-gray-500" },
  PENDING_TENANT:      { label: "Pend. inquilino", cls: "bg-amber-100 text-amber-700" },
  PENDING_LANDLORD:    { label: "Pend. arrendador",cls: "bg-amber-100 text-amber-700" },
  ACTIVE:              { label: "Activo",           cls: "bg-green/10 text-green" },
  FINISHED:            { label: "Finalizado",       cls: "bg-gray-100 text-gray-500" },
  BREACHED_CANCELLED:  { label: "Rescindido",       cls: "bg-red/10 text-red" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
}

export interface AuditEntry {
  id: string; action: string; userName: string; userRole: string
  ipAddress: string; userAgent: string; cryptoHash: string; timestamp: string
}

interface AuditData {
  contractId: string; status: string; documentHash: string | null; createdAt: string
  landlord: { name: string; email: string }
  tenant:   { name: string; email: string }
  property: { title: string; district: string }
  entries:  AuditEntry[]
}

export function AuditTrailView({ data }: { data: AuditData }) {
  const statusMeta = STATUS_META[data.status] ?? { label: data.status, cls: "bg-gray-100 text-gray-500" }

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href={`/contracts/${data.contractId}`}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#151c26] no-underline mb-6 transition-colors"
      >
        <ArrowLeft01Icon size={14} />
        Volver al contrato
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SecurityCheckIcon size={18} className="text-accent" />
              <h1 className="text-lg font-extrabold text-[#151c26]">Audit Trail — Evidencia Legal</h1>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Registro inmutable de acciones sobre el contrato. Válido bajo Ley 30201 y Ley 27269.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
              <span className="text-xs text-gray-400">
                Contrato #{data.contractId.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Creado: {formatDate(data.createdAt)}</p>
            <p>{data.entries.length} evento{data.entries.length !== 1 ? "s" : ""} registrado{data.entries.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Arrendador", ...data.landlord },
            { label: "Inquilino",  ...data.tenant },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-3">
              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
              >
                {p.name[0]}
              </div>
              <div>
                <p className="text-xs text-gray-400">{p.label}</p>
                <p className="text-sm font-bold text-[#151c26]">{p.name}</p>
                <p className="text-xs text-gray-400">{p.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Property */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Propiedad</p>
          <p className="text-sm font-bold text-[#151c26]">{data.property.title}</p>
          <p className="text-xs text-gray-400">{data.property.district}, Lima</p>
        </div>

        {/* Document hash */}
        {data.documentHash && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              Hash SHA-256 del documento
            </p>
            <p className="text-[11px] font-mono text-gray-500 break-all bg-gray-50 p-2 rounded-lg">
              {data.documentHash}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-[#151c26] mb-6 uppercase tracking-wide">
          Historial de eventos
        </h2>

        {data.entries.length === 0 ? (
          <div className="text-center py-12">
            <Clock05Icon size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-400">Sin eventos registrados aún</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100" />

            <div className="flex flex-col gap-6">
              {data.entries.map((entry, i) => {
                const meta = ACTION_META[entry.action] ?? {
                  label: entry.action,
                  color: "bg-gray-100 text-gray-500 border-gray-200",
                  Icon: Clock05Icon,
                }
                const Icon = meta.Icon
                return (
                  <div key={entry.id} className="flex gap-5 relative">
                    {/* Dot */}
                    <div className={`size-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${meta.color}`}>
                      <Icon size={14} />
                    </div>

                    <div className="flex-1 min-w-0 pb-2">
                      {/* Event header */}
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <div>
                          <p className="text-sm font-bold text-[#151c26]">{meta.label}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <UserCircleIcon size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {entry.userName}
                              <span className="text-gray-300 mx-1">·</span>
                              {entry.userRole}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 font-mono shrink-0">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-[11px]">
                        <div className="flex gap-2">
                          <span className="text-gray-400 w-20 shrink-0">IP</span>
                          <span className="font-mono text-gray-600">{entry.ipAddress}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-400 w-20 shrink-0">Hash</span>
                          <span className="font-mono text-gray-600 break-all">{entry.cryptoHash}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-400 w-20 shrink-0 mt-0.5">User-Agent</span>
                          <span className="text-gray-500 leading-relaxed">{entry.userAgent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Legal footer */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Este registro es <strong>inmutable</strong>. Cada entrada contiene el hash criptográfico SHA-256
            del documento exacto que vio el usuario al momento de la acción, conforme a la{" "}
            <strong>Ley 27269</strong> (Firmas Digitales) y la <strong>Ley 30201</strong> (Allanamiento Futuro).
            Este audit trail constituye evidencia legal válida del Clickwrap Agreement.
          </p>
        </div>
      </div>
    </div>
  )
}
