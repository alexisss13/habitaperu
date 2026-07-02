"use client"

import { useState } from "react"
import { 
  DatabaseIcon, 
  Search01Icon, 
  Clock01Icon, 
  CheckmarkCircle02Icon,
  EyeIcon,
  Copy01Icon
} from "hugeicons-react"
import type { AuditLogItem } from "./audit-view"

interface Props {
  logs: AuditLogItem[]
}

const actionBadge = (action: string) => {
  switch (action) {
    case "SIGNED_TENANT":
      return { 
        cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", 
        label: "Firma Inquilino", 
        Icon: CheckmarkCircle02Icon 
      }
    case "COUNTERSIGNED_LANDLORD":
      return { 
        cls: "bg-blue-50 text-blue-700 border border-blue-200", 
        label: "Firma Arrendador", 
        Icon: CheckmarkCircle02Icon 
      }
    case "VIEWED":
      return { 
        cls: "bg-slate-50 text-slate-600 border border-slate-200", 
        label: "Visualizado", 
        Icon: EyeIcon 
      }
    default:
      return { 
        cls: "bg-slate-100 text-slate-600 border border-slate-200", 
        label: action, 
        Icon: Clock01Icon 
      }
  }
}

export function AuditMobile({ logs }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const fmtDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleString("es-PE", {
      timeZone: "America/Lima",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      `${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="p-4 pb-24 min-h-screen bg-admin-bg">
      <h1 className="text-lg font-bold text-admin-text mb-1">Auditoría</h1>
      <p className="text-xs text-admin-text-muted mb-4">
        Clickwrap Audit Trail (Ley N° 30201 / Ley N° 27269).
      </p>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search01Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar logs..."
          className="w-full pl-9 pr-4 py-2 border border-admin-border rounded-lg text-xs text-admin-text bg-admin-card-bg outline-none focus:border-admin-accent transition-all"
        />
      </div>

      {/* Cards Stack */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-admin-card-bg border border-admin-border rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <DatabaseIcon size={36} className="text-admin-text-muted mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-admin-text mb-1">No se encontraron registros</h3>
            <p className="text-xs text-admin-text-muted max-w-xs">
              No hay logs de auditoría registrados que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const badge = actionBadge(log.action)
            const ActionIcon = badge.Icon

            return (
              <div
                key={log.id}
                className="bg-admin-card-bg border border-admin-border rounded-xl p-4 space-y-3 shadow-sm text-xs text-admin-text"
              >
                {/* Header card info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-admin-text-muted font-mono block">
                      {fmtDate(log.timestamp)}
                    </span>
                    <h3 className="font-bold text-admin-text mt-0.5">
                      {log.user.firstName} {log.user.lastName}
                    </h3>
                    <span className="text-[9px] text-admin-text-muted block mt-0.5">{log.user.email}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${badge.cls}`}>
                    <ActionIcon size={10} className="shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="bg-admin-bg rounded-lg p-2.5 space-y-1.5 text-[11px] font-semibold text-admin-text-muted border border-admin-border/50">
                  <div className="flex justify-between">
                    <span>Propiedad:</span>
                    <span className="text-admin-text truncate max-w-[180px]">{log.propertyTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contrato ID:</span>
                    <span className="text-admin-text font-mono">#{log.contractId.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP del Cliente:</span>
                    <span className="text-admin-text font-mono">{log.ipAddress}</span>
                  </div>
                </div>

                {/* Cryptographic hash */}
                <div className="flex items-center justify-between pt-2 border-t border-admin-border/60">
                  <div className="min-w-0 pr-4">
                    <span className="text-[9px] text-admin-text-muted uppercase block font-bold mb-0.5">SHA-256 Hash</span>
                    <span className="font-mono text-[10px] text-admin-text-muted truncate block max-w-[180px]">
                      {log.cryptoHash}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHash(log.cryptoHash, log.id)}
                      className="p-2 border border-admin-border rounded-lg text-slate-500 hover:text-admin-accent transition-colors bg-admin-bg cursor-pointer"
                      title="Copiar Hash"
                    >
                      {copiedId === log.id ? (
                        <span className="text-[9px] text-emerald-600 font-bold">¡Copiado!</span>
                      ) : (
                        <Copy01Icon size={14} />
                      )}
                    </button>
                    <a
                      href={`/api/contracts/${log.contractId}/download`}
                      target="_blank"
                      className="px-3 py-2 bg-slate-900 text-white font-bold rounded-lg text-[10px] no-underline hover:bg-slate-800 transition-all text-center"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
