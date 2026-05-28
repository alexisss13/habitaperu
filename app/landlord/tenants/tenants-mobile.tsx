'use client'

import { useState } from "react"
import Link from "next/link"
import {
  UserMultiple02Icon, SearchIcon, SecurityCheckIcon,
  FileValidationIcon, CheckmarkCircle02Icon, Clock05Icon, AlertCircleIcon
} from "hugeicons-react"
import type { TenantItem } from "./tenants-view"

const kycBadge = (kyc: TenantItem["kyc"]) => {
  if (!kyc) return { label: "Sin KYC", cls: "bg-gray-100 text-gray-500" }
  const map: Record<string, { label: string; cls: string }> = {
    APROBADO: { label: "KYC ✓", cls: "bg-green/10 text-green" },
    EN_REVISION: { label: "En revisión", cls: "bg-amber-100 text-amber-700" },
    PENDIENTE: { label: "KYC Pendiente", cls: "bg-gray-100 text-gray-500" },
    RECHAZADO: { label: "KYC Rechazado", cls: "bg-red/10 text-red" },
  }
  return map[kyc.status] ?? { label: kyc.status, cls: "bg-gray-100 text-gray-500" }
}

const paymentIcon = (status: string) => {
  if (status === "PAGADO") return <CheckmarkCircle02Icon size={14} className="text-green" />
  if (status === "VENCIDO") return <AlertCircleIcon size={14} className="text-red" />
  return <Clock05Icon size={14} className="text-amber-500" />
}

export function TenantsMobile({ tenants }: { tenants: TenantItem[] }) {
  const [search, setSearch] = useState("")

  const filtered = tenants.filter((t) => {
    const q = search.toLowerCase()
    return (
      !q ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-5">
        <h1 className="text-xl font-bold text-[#151c26] flex items-center gap-2 mb-1">
          <UserMultiple02Icon size={22} className="text-accent" />
          Mis Inquilinos
        </h1>
        <p className="text-sm text-gray-400">{tenants.length} en total</p>

        <div className="relative mt-4">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-accent bg-gray-50"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <UserMultiple02Icon size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No hay inquilinos</p>
            <p className="text-xs mt-1">Aparecerán cuando se activen contratos.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const kyc = kycBadge(t.kyc)
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {/* Top row */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="size-11 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                  >
                    {t.firstName[0]}{t.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#151c26] text-sm truncate">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{t.email}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full ${kyc.cls}`}>
                    {kyc.label}
                  </span>
                </div>

                {/* Property */}
                {t.activeContract ? (
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SecurityCheckIcon size={14} className="text-accent shrink-0" />
                        <span className="text-xs font-semibold text-[#151c26] truncate max-w-[160px]">
                          {t.activeContract.property.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{t.activeContract.property.district}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 pl-5">
                      S/ {t.activeContract.monthlyRent.toLocaleString("es-PE")}/mes
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-3 px-1">{t.contractsCount} contrato(s) anterior(es)</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {t.lastPayment ? (
                    <div className="flex items-center gap-1.5">
                      {paymentIcon(t.lastPayment.status)}
                      <span className="text-xs text-gray-500">
                        S/ {t.lastPayment.amount.toLocaleString("es-PE")}
                      </span>
                    </div>
                  ) : (
                    <span />
                  )}
                  {t.activeContract && (
                    <Link
                      href="/landlord/contracts"
                      className="flex items-center gap-1 text-xs font-semibold text-accent no-underline"
                    >
                      <FileValidationIcon size={13} />
                      Contrato
                    </Link>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
