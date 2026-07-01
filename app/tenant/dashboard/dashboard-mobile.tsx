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

export function TenantDashboardMobile({ session, data }: Props) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" })

  const firstName = session.user.name?.split(" ")[0] ?? "Inquilino"

  return (
    <div className="px-4 py-5 pb-4">
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-admin-text mb-2">Hola, {firstName}</h1>
        <p className="text-sm text-admin-text-muted">Tu resumen como inquilino</p>
      </div>

      {/* Propiedad activa banner */}
      <div
        className="rounded-2xl p-5 mb-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
      >
        <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-wide">Propiedad activa</p>
        {data.activeProperty ? (
          <>
            <p className="font-bold text-base leading-snug">{data.activeProperty.title}</p>
            <p className="text-sm opacity-80 mt-0.5">
              S/ {data.activeProperty.price.toLocaleString("es-PE")}/mes
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-sm opacity-80">Sin contrato activo</p>
            <Link href="/propiedades" className="text-xs font-bold text-white/90 no-underline mt-1 block underline">
              Buscar propiedad →
            </Link>
          </>
        )}
      </div>

      {/* KPI row: pago + favoritos */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet01Icon size={15} className="text-green" />
            <p className="text-[11px] font-bold text-panel-text-muted uppercase tracking-wide">Próximo pago</p>
          </div>
          {data.nextPayment ? (
            <>
              <p className="font-extrabold text-panel-text text-base">
                S/ {data.nextPayment.amount.toLocaleString("es-PE")}
              </p>
              <p className="text-[11px] text-panel-text-dim">
                {formatDate(data.nextPayment.dueDate)}
              </p>
            </>
          ) : (
            <p className="font-bold text-green text-sm">Al día ✓</p>
          )}
        </div>
        <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <FavouriteIcon size={15} className="text-red-400" />
            <p className="text-[11px] font-bold text-panel-text-muted uppercase tracking-wide">Favoritos</p>
          </div>
          <p className="font-extrabold text-panel-text text-base">{data.favoritesCount}</p>
          <Link href="/tenant/favorites" className="text-[11px] text-accent font-semibold no-underline">Ver →</Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-4 mb-5">
        <h2 className="text-sm font-bold text-panel-text mb-3">Acciones rápidas</h2>
        <div className="flex flex-col gap-2">
          {[
            { href: "/propiedades",       Icon: Search01Icon,      label: "Buscar propiedades" },
            { href: "/tenant/contract",   Icon: FileValidationIcon, label: "Mi contrato" },
            { href: "/tenant/payments",   Icon: Wallet01Icon,       label: "Mis pagos" },
            { href: "/tenant/favorites",  Icon: FavouriteIcon,      label: "Mis favoritos" },
          ].map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 bg-panel-hover-bg hover:bg-panel-hover-bg rounded-xl text-sm font-semibold text-panel-text no-underline transition-colors"
            >
              <Icon size={15} className="text-accent shrink-0" />
              {label}
              <ArrowRight01Icon size={13} className="ml-auto text-panel-text-dim" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-panel-text">Pagos recientes</h2>
          <Link href="/tenant/payments" className="text-xs font-semibold text-accent no-underline">
            Ver todos →
          </Link>
        </div>

        {data.paymentHistory.length === 0 ? (
          <div className="py-8 text-center">
            <CheckmarkCircle02Icon size={32} className="text-panel-text-dim mx-auto mb-2" />
            <p className="text-xs font-semibold text-panel-text-dim">Sin historial de pagos</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-panel-border">
            {data.paymentHistory.slice(0, 5).map((p) => {
              const cfg = paymentStatusConfig[p.status as keyof typeof paymentStatusConfig]
                ?? paymentStatusConfig.PENDING
              const StatusIcon = cfg.Icon
              return (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-panel-text">{p.month}</p>
                    <p className="text-[11px] text-panel-text-dim">
                      {p.status === "PAID" ? `Pagado ${p.date}` : `Vence ${p.date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-panel-text">
                      S/ {p.amount.toLocaleString("es-PE")}
                    </p>
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                      <StatusIcon size={10} />
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
