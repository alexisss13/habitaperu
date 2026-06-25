'use client'

import Link from "next/link"
import {
  Home01Icon, Search01Icon, FavouriteIcon, FileValidationIcon,
  Wallet01Icon, CheckmarkCircle02Icon, AlertCircleIcon, Clock05Icon,
  ArrowRight01Icon
} from "hugeicons-react"

interface TenantDashboardData {
  activeProperty: { title: string; price: number } | null
  nextPayment: { dueDate: string; amount: number } | null
  paymentHistory: Array<{
    id: string; month: string; date: string; amount: number; status: string
  }>
  favoritesCount: number
}

interface Props {
  session: { user: { name?: string | null } }
  data: TenantDashboardData
}

const paymentStatusConfig = {
  PAID:        { label: "Pagado",    cls: "text-green bg-green/10",        Icon: CheckmarkCircle02Icon },
  OVERDUE:     { label: "Vencido",   cls: "text-red bg-red/10",            Icon: AlertCircleIcon },
  IN_PROGRESS: { label: "En proceso",cls: "text-indigo-600 bg-indigo-50",   Icon: Clock05Icon },
  PENDING:     { label: "Pendiente", cls: "text-amber-600 bg-amber-50",     Icon: Clock05Icon },
}

export function TenantDashboardDesktop({ session, data }: Props) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long" })

  const firstName = session.user.name?.split(" ")[0] ?? "Inquilino"

  return (
    <div className="px-6 py-7 max-w-5xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#151c26] mb-0.5">
          Hola, {firstName} <span role="img" aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm text-gray-400">
          Este es tu resumen de actividad como inquilino
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Propiedad activa */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-9 rounded-xl bg-accent/8 flex items-center justify-center">
              <Home01Icon size={18} className="text-accent" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Propiedad</p>
          </div>
          {data.activeProperty ? (
            <>
              <p className="font-bold text-[#151c26] text-sm leading-snug line-clamp-2 mb-1">
                {data.activeProperty.title}
              </p>
              <p className="text-xs text-gray-400">
                S/ {data.activeProperty.price.toLocaleString("es-PE")}/mes
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-400 text-sm">Sin contrato activo</p>
              <Link href="/propiedades" className="text-xs text-accent font-semibold no-underline hover:underline mt-1 block">
                Buscar propiedad →
              </Link>
            </>
          )}
        </div>

        {/* Próximo pago */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-9 rounded-xl bg-green/10 flex items-center justify-center">
              <Wallet01Icon size={18} className="text-green" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Próximo pago</p>
          </div>
          {data.nextPayment ? (
            <>
              <p className="text-xl font-extrabold text-[#151c26]">
                S/ {data.nextPayment.amount.toLocaleString("es-PE")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Vence el {formatDate(data.nextPayment.dueDate)}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-green text-sm">Al día ✓</p>
              <p className="text-xs text-gray-400 mt-0.5">Sin pagos pendientes</p>
            </>
          )}
        </div>

        {/* Favoritos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-9 rounded-xl bg-red-50 flex items-center justify-center">
              <FavouriteIcon size={18} className="text-red-400" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Favoritos</p>
          </div>
          <p className="text-xl font-extrabold text-[#151c26]">{data.favoritesCount}</p>
          <Link href="/tenant/favorites" className="text-xs text-accent font-semibold no-underline hover:underline mt-0.5 block">
            Ver guardados →
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-bold text-[#151c26] mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: "/propiedades", Icon: Search01Icon, label: "Buscar propiedades", accent: true },
            { href: "/tenant/contract", Icon: FileValidationIcon, label: "Mi contrato" },
            { href: "/tenant/payments", Icon: Wallet01Icon, label: "Mis pagos" },
            { href: "/tenant/favorites", Icon: FavouriteIcon, label: "Mis favoritos" },
          ].map(({ href, Icon, label, accent }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-all group ${
                accent
                  ? "text-white hover:opacity-90"
                  : "bg-gray-50 text-[#151c26] hover:bg-gray-100"
              }`}
              style={accent ? { background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" } : {}}
            >
              <Icon size={16} className={accent ? "text-white" : "text-accent"} />
              {label}
              <ArrowRight01Icon size={14} className="ml-auto opacity-50 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#151c26]">Historial de pagos</h2>
          <Link href="/tenant/payments" className="text-xs font-semibold text-accent no-underline hover:underline">
            Ver todos →
          </Link>
        </div>

        {data.paymentHistory.length === 0 ? (
          <div className="py-10 text-center bg-gray-50 rounded-xl">
            <CheckmarkCircle02Icon size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-400">Sin historial de pagos aún</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {data.paymentHistory.map((p) => {
              const cfg = paymentStatusConfig[p.status as keyof typeof paymentStatusConfig]
                ?? paymentStatusConfig.PENDING
              const StatusIcon = cfg.Icon
              return (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#151c26]">{p.month}</p>
                    <p className="text-xs text-gray-400">
                      {p.status === "PAID" ? `Pagado el ${p.date}` : `Vence el ${p.date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-[#151c26]">
                      S/ {p.amount.toLocaleString("es-PE")}
                    </p>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                      <StatusIcon size={11} />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
