'use client'

import { PanelPageHeader } from "@/components/panel-page-header"
import { useState } from "react"
import Link from "next/link"
import {
  UserMultiple02Icon, Search01Icon, SecurityCheckIcon,
  FileValidationIcon, CheckmarkCircle02Icon, Cancel01Icon,
  Clock05Icon, AlertCircleIcon, UserGroupIcon
} from "hugeicons-react"
import type { TenantItem } from "./tenants-view"

const kycBadge = (kyc: TenantItem["kyc"]) => {
  if (!kyc) return { label: "Sin KYC", cls: "bg-panel-hover-bg text-panel-text-dim" }
  const map: Record<string, { label: string; cls: string }> = {
    APROBADO: { label: "KYC Aprobado", cls: "bg-green/10 text-green" },
    EN_REVISION: { label: "En revisión", cls: "bg-amber-100 text-amber-700" },
    PENDIENTE: { label: "Pendiente", cls: "bg-panel-hover-bg text-panel-text-dim" },
    RECHAZADO: { label: "Rechazado", cls: "bg-red/10 text-red" },
  }
  return map[kyc.status] ?? { label: kyc.status, cls: "bg-panel-hover-bg text-panel-text-dim" }
}

const paymentBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
    PAGADO: { label: "Al día", cls: "text-green", Icon: CheckmarkCircle02Icon },
    PENDIENTE: { label: "Pendiente", cls: "text-amber-600", Icon: Clock05Icon },
    EN_PROCESO: { label: "En proceso", cls: "text-blue-600", Icon: Clock05Icon },
    VENCIDO: { label: "Vencido", cls: "text-red", Icon: AlertCircleIcon },
  }
  return map[status] ?? { label: status, cls: "text-panel-text-dim", Icon: Clock05Icon }
}

export function TenantsDesktop({ tenants }: { tenants: TenantItem[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"todos" | "activos" | "sin_kyc">("todos")

  const filtered = tenants.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    const matchFilter =
      filter === "todos" ||
      (filter === "activos" && t.activeContract !== null) ||
      (filter === "sin_kyc" && (!t.kyc || t.kyc.status !== "APROBADO"))
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      <PanelPageHeader
        icon={<UserGroupIcon size={32} className="text-admin-accent" />}
        title="Mis Inquilinos"
        subtitle={`${tenants.length} ${tenants.length === 1 ? "inquilino" : "inquilinos"} en total`}
      />

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search01Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-panel-text-dim" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-panel-border rounded-xl outline-none focus:border-accent bg-panel-card-bg"
            />
          </div>
          <div className="flex gap-1.5 bg-panel-card-bg p-1 border border-panel-border rounded-xl">
            {(["todos", "activos", "sin_kyc"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
                  filter === f
                    ? "bg-accent text-white shadow-sm"
                    : "text-panel-text-muted hover:text-panel-text hover:bg-panel-hover-bg"
                }`}
              >
                {f === "todos" ? "Todos" : f === "activos" ? "Con Contrato" : "Sin KYC"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-panel-card-bg border border-panel-border rounded-2xl">
            <UserMultiple02Icon size={56} className="text-panel-text-dim mx-auto mb-4" />
            <h3 className="text-base font-bold text-panel-text mb-1">No se encontraron inquilinos</h3>
            <p className="text-xs font-medium text-panel-text-muted">Cuando publiques propiedades y se activen contratos, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="bg-panel-card-bg border border-panel-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-panel-border bg-panel-hover-bg/50">
                  <th className="text-left px-6 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">Inquilino</th>
                  <th className="text-left px-4 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">KYC</th>
                  <th className="text-left px-4 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">Propiedad</th>
                  <th className="text-left px-4 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">Contrato</th>
                  <th className="text-left px-4 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">Último pago</th>
                  <th className="text-right px-6 py-4 font-bold text-panel-text-muted text-xs uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {filtered.map((t) => {
                  const kyc = kycBadge(t.kyc)
                  const payment = t.lastPayment ? paymentBadge(t.lastPayment.status) : null
                  return (
                    <tr key={t.id} className="border-b border-panel-border last:border-0 hover:bg-panel-hover-bg transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                          >
                            {t.firstName?.[0] ?? '?'}{t.lastName?.[0] ?? ''}
                          </div>
                          <div>
                            <p className="font-semibold text-panel-text">{t.firstName} {t.lastName}</p>
                            <p className="text-xs text-panel-text-dim">{t.email}</p>
                            {t.phone && <p className="text-xs text-panel-text-dim">{t.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kyc.cls}`}>
                          <SecurityCheckIcon size={12} />
                          {kyc.label}
                        </span>
                        {t.kyc && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {[
                              { ok: t.kyc.dniVerified, label: "DNI" },
                              { ok: t.kyc.biometricVerified, label: "Bio" },
                              { ok: t.kyc.backgroundCheck, label: "BG" },
                            ].map(({ ok, label }) => (
                              <span key={label} className={`text-[10px] px-1.5 py-0.5 rounded ${ok ? "bg-green/10 text-green" : "bg-panel-hover-bg text-panel-text-dim"}`}>
                                {ok ? <CheckmarkCircle02Icon size={10} className="inline mr-0.5" /> : <Cancel01Icon size={10} className="inline mr-0.5" />}
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {t.activeContract ? (
                          <div>
                            <p className="font-medium text-panel-text text-sm">{t.activeContract.property.title}</p>
                            <p className="text-xs text-panel-text-dim">{t.activeContract.property.district}</p>
                          </div>
                        ) : (
                          <span className="text-panel-text-dim text-xs">Sin contrato activo</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {t.activeContract ? (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-green/10 text-green text-xs font-semibold mb-1">Activo</span>
                            <p className="text-xs text-panel-text-dim">
                              S/ {t.activeContract.monthlyRent.toLocaleString("es-PE")}/mes
                            </p>
                            <p className="text-xs text-panel-text-dim">
                              Hasta {new Date(t.activeContract.endDate).toLocaleDateString("es-PE", { month: "short", year: "numeric" })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-panel-text-dim">{t.contractsCount} contrato{t.contractsCount !== 1 ? "s" : ""} previo{t.contractsCount !== 1 ? "s" : ""}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {payment ? (
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${payment.cls}`}>
                            <payment.Icon size={14} />
                            <span>{payment.label}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-panel-text-dim">—</span>
                        )}
                        {t.lastPayment && (
                          <p className="text-xs text-panel-text-dim mt-0.5">
                            S/ {t.lastPayment.amount.toLocaleString("es-PE")}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {t.activeContract && (
                          <Link
                            href={`/landlord/contracts`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-all no-underline"
                          >
                            <FileValidationIcon size={13} />
                            Ver contrato
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}
