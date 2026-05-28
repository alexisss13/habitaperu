'use client'

import { useState } from "react"
import Link from "next/link"
import {
  UserMultiple02Icon, SearchIcon, SecurityCheckIcon,
  FileValidationIcon, CheckmarkCircle02Icon, Cancel01Icon,
  Clock05Icon, AlertCircleIcon
} from "hugeicons-react"
import type { TenantItem } from "./tenants-view"

const kycBadge = (kyc: TenantItem["kyc"]) => {
  if (!kyc) return { label: "Sin KYC", cls: "bg-gray-100 text-gray-500" }
  const map: Record<string, { label: string; cls: string }> = {
    APROBADO: { label: "KYC Aprobado", cls: "bg-green/10 text-green" },
    EN_REVISION: { label: "En revisión", cls: "bg-amber-100 text-amber-700" },
    PENDIENTE: { label: "Pendiente", cls: "bg-gray-100 text-gray-500" },
    RECHAZADO: { label: "Rechazado", cls: "bg-red/10 text-red" },
  }
  return map[kyc.status] ?? { label: kyc.status, cls: "bg-gray-100 text-gray-500" }
}

const paymentBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
    PAGADO: { label: "Al día", cls: "text-green", Icon: CheckmarkCircle02Icon },
    PENDIENTE: { label: "Pendiente", cls: "text-amber-600", Icon: Clock05Icon },
    EN_PROCESO: { label: "En proceso", cls: "text-blue-600", Icon: Clock05Icon },
    VENCIDO: { label: "Vencido", cls: "text-red", Icon: AlertCircleIcon },
  }
  return map[status] ?? { label: status, cls: "text-gray-500", Icon: Clock05Icon }
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
    <div className="min-h-screen bg-slate-50 pt-0">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#151c26] mb-1 flex items-center gap-3">
              <UserMultiple02Icon size={28} className="text-accent" />
              Mis Inquilinos
            </h1>
            <p className="text-sm text-gray-500">{tenants.length} {tenants.length === 1 ? "inquilino" : "inquilinos"} en total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent bg-white"
            />
          </div>
          {(["todos", "activos", "sin_kyc"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                filter === f
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-accent hover:text-accent"
              }`}
            >
              {f === "todos" ? "Todos" : f === "activos" ? "Con contrato activo" : "Sin KYC aprobado"}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <UserMultiple02Icon size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No se encontraron inquilinos</p>
            <p className="text-sm mt-1">Cuando publiques propiedades y se activen contratos, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Inquilino</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">KYC</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Propiedad</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Contrato</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Último pago</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => {
                  const kyc = kycBadge(t.kyc)
                  const payment = t.lastPayment ? paymentBadge(t.lastPayment.status) : null
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                          >
                            {t.firstName[0]}{t.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-[#151c26]">{t.firstName} {t.lastName}</p>
                            <p className="text-xs text-gray-400">{t.email}</p>
                            {t.phone && <p className="text-xs text-gray-400">{t.phone}</p>}
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
                              <span key={label} className={`text-[10px] px-1.5 py-0.5 rounded ${ok ? "bg-green/10 text-green" : "bg-gray-100 text-gray-400"}`}>
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
                            <p className="font-medium text-[#151c26] text-sm">{t.activeContract.property.title}</p>
                            <p className="text-xs text-gray-400">{t.activeContract.property.district}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Sin contrato activo</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {t.activeContract ? (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-green/10 text-green text-xs font-semibold mb-1">Activo</span>
                            <p className="text-xs text-gray-400">
                              S/ {t.activeContract.monthlyRent.toLocaleString("es-PE")}/mes
                            </p>
                            <p className="text-xs text-gray-400">
                              Hasta {new Date(t.activeContract.endDate).toLocaleDateString("es-PE", { month: "short", year: "numeric" })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t.contractsCount} contrato{t.contractsCount !== 1 ? "s" : ""} previo{t.contractsCount !== 1 ? "s" : ""}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {payment ? (
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${payment.cls}`}>
                            <payment.Icon size={14} />
                            <span>{payment.label}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                        {t.lastPayment && (
                          <p className="text-xs text-gray-400 mt-0.5">
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
    </div>
  )
}
