"use client"

import { useState } from "react"
import { 
  DatabaseIcon, 
  Search01Icon, 
  FilterIcon, 
  Clock01Icon, 
  UserCircleIcon,
  CheckmarkCircle02Icon,
  EyeIcon,
  Copy01Icon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { AdminPagination } from "@/components/ui/pagination"
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
        cls: "bg-slate-100 text-slate-600 border border-slate-250", 
        label: action, 
        Icon: Clock01Icon 
      }
  }
}

const roleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-50 text-red-700 border border-red-200"
    case "LANDLORD":
      return "bg-amber-50 text-amber-700 border border-amber-200"
    case "TENANT":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200"
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200"
  }
}

export function AuditDesktop({ logs }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("ALL")
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
      second: "2-digit",
    })
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      `${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.contractId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter

    return matchesSearch && matchesAction
  })

  const pagination = usePagination(filteredLogs, 15, [searchTerm, actionFilter])

  // Calculate statistics
  const stats = {
    total: logs.length,
    signedTenant: logs.filter(l => l.action === "SIGNED_TENANT").length,
    signedLandlord: logs.filter(l => l.action === "COUNTERSIGNED_LANDLORD").length,
    viewed: logs.filter(l => l.action === "VIEWED").length,
  }

  return (
    <div className="p-10 min-h-screen bg-admin-bg">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DatabaseIcon size={32} className="text-admin-accent" />
          <h1 className="text-3xl font-bold text-admin-text">Auditoría Legal (Audit Trail)</h1>
        </div>
        <p className="text-sm text-admin-text-muted">
          Registro criptográfico de firmas digitales, consentimientos Clickwrap e historial de accesos (Ley N° 30201 / Ley N° 27269).
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "TOTAL LOGS", value: stats.total, color: "text-admin-text" },
          { label: "FIRMAS INQUILINO", value: stats.signedTenant, color: "text-emerald-600" },
          { label: "FIRMAS PROPIETARIO", value: stats.signedLandlord, color: "text-blue-600" },
          { label: "VISUALIZACIONES", value: stats.viewed, color: "text-slate-500" },
        ].map((s) => (
          <div key={s.label} className="bg-admin-card-bg p-5 rounded-xl border border-admin-border shadow-sm">
            <div className="text-xs font-bold text-admin-text-muted mb-2">{s.label}</div>
            <div className={`font-bold text-[1.8rem] ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-admin-card-bg px-6 py-4 rounded-xl border border-admin-border mb-6 flex items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search01Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, contrato, propiedad, IP..."
            className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <FilterIcon size={16} className="text-admin-text-muted" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent font-semibold"
          >
            <option value="ALL">Todas las acciones</option>
            <option value="SIGNED_TENANT">Firma Inquilino</option>
            <option value="COUNTERSIGNED_LANDLORD">Firma Arrendador</option>
            <option value="VIEWED">Visualizaciones</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr_1fr_1.2fr_1.2fr_0.4fr] px-6 py-4 border-b border-admin-border bg-[rgba(116,133,151,0.02)] text-xs font-bold text-admin-text-muted uppercase tracking-wider">
          <div>Fecha (Lima)</div>
          <div>Usuario</div>
          <div>Propiedad / Contrato</div>
          <div>Acción</div>
          <div>Dirección IP</div>
          <div>Hash Criptográfico (SHA-256)</div>
          <div></div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-sm text-admin-text-muted">
            No se encontraron registros de auditoría que coincidan con la búsqueda.
          </div>
        ) : (
          pagination.paginatedItems.map((log) => {
            const badge = actionBadge(log.action)
            const ActionIcon = badge.Icon

            return (
              <div
                key={log.id}
                className="grid grid-cols-[1.2fr_1.5fr_1.5fr_1fr_1.2fr_1.2fr_0.4fr] px-6 py-4.5 border-b border-admin-border items-center hover:bg-[rgba(116,133,151,0.02)] transition-colors text-xs text-admin-text"
              >
                {/* Date */}
                <div className="font-semibold text-admin-text">{fmtDate(log.timestamp)}</div>

                {/* User */}
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                    {log.user.firstName[0]}{log.user.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-admin-text truncate">
                      {log.user.firstName} {log.user.lastName}
                    </p>
                    <p className="text-[10px] text-admin-text-muted truncate mb-0.5">{log.user.email}</p>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border inline-block ${roleBadge(log.user.role)}`}>
                      {log.user.role}
                    </span>
                  </div>
                </div>

                {/* Property & Contract */}
                <div className="min-w-0 pr-3">
                  <p className="font-semibold text-admin-text truncate">{log.propertyTitle}</p>
                  <p className="text-[10px] text-admin-text-muted truncate mt-0.5">Contrato: #{log.contractId.slice(0, 8)}...</p>
                </div>

                {/* Action */}
                <div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-[10px] font-bold ${badge.cls}`}>
                    <ActionIcon size={12} className="shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* IP Address & User Agent */}
                <div className="min-w-0 pr-2">
                  <p className="font-mono font-bold text-admin-text">{log.ipAddress}</p>
                  <p className="text-[9px] text-admin-text-muted truncate mt-0.5" title={log.userAgent}>
                    {log.userAgent}
                  </p>
                </div>

                {/* Crypto Hash */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-admin-text-muted truncate max-w-[120px]" title={log.cryptoHash}>
                    {log.cryptoHash}
                  </span>
                  <button
                    onClick={() => handleCopyHash(log.cryptoHash, log.id)}
                    className="p-1 hover:bg-admin-bg rounded text-slate-400 hover:text-admin-accent transition-colors bg-transparent border-0 cursor-pointer"
                    title="Copiar Hash"
                  >
                    {copiedId === log.id ? (
                      <span className="text-[8px] text-emerald-600 font-bold">¡Listo!</span>
                    ) : (
                      <Copy01Icon size={12} />
                    )}
                  </button>
                </div>

                {/* Action button */}
                <div className="flex justify-end">
                  <a
                    href={`/api/contracts/${log.contractId}/download`}
                    target="_blank"
                    className="px-2.5 py-1.5 border border-admin-border hover:border-admin-accent rounded-md text-[10px] font-bold text-admin-text hover:text-admin-accent no-underline hover:bg-admin-bg transition-all"
                  >
                    Doc PDF
                  </a>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      <div className="bg-admin-card-bg rounded-b-xl border border-t-0 border-admin-border">
        <AdminPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="registros"
        />
      </div>
    </div>
  )
}
