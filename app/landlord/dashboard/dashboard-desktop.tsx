'use client'

import { PanelPageHeader } from "@/components/panel-page-header"
import Link from 'next/link'
import { Wallet01Icon, Home01Icon, FileValidationIcon, AlertCircleIcon, Clock01Icon, CheckmarkCircle01Icon, UserMultiple02Icon, Building03Icon, LayoutGridIcon } from 'hugeicons-react'
import { PaymentTrafficLight } from '@/components/landlord/payment-traffic-light'
import { KycReviewCard } from '@/components/landlord/kyc-review-card'

interface DashboardData {
  metrics: {
    monthlyIncome: number
    occupiedProperties: number
    totalProperties: number
    expiringContracts: number
  }
  payments: Array<{
    id: string; amount: number; dueDate: string; status: string
    tenant: { name: string; email: string }
    property: { title: string; district: string }
  }>
  kycRequests: Array<{
    id: string; name: string; email: string; kycScore: number; kycStatus: string
  }>
}

export function DashboardDesktop({ data }: { data: DashboardData }) {
  const { metrics, payments, kycRequests } = data
  const overdueCount = payments.filter(p => p.status === 'VENCIDO').length
  const pendingCount = payments.filter(p => p.status === 'PENDIENTE').length
  const occupancyRate = metrics.totalProperties > 0
    ? Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)
    : 0

  const hasAlerts = overdueCount > 0 || kycRequests.length > 0 || metrics.expiringContracts > 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      <PanelPageHeader
        icon={<LayoutGridIcon size={32} className="text-admin-accent" />}
        title="Dashboard"
        subtitle="Gestiona tus propiedades, contratos y pagos desde un solo lugar"
      />

      {/* ── Actionable Alerts ── */}
      {hasAlerts && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircleIcon size={16} className="text-accent-secondary" />
            <span className="text-xs font-bold text-panel-text-muted uppercase tracking-wider">Qué hacer ahora</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {overdueCount > 0 && (
              <Link
                href="/landlord/payments"
                className="flex items-center gap-4 bg-panel-card-bg border border-red/20 rounded-xl px-5 py-4 transition-all no-underline group"
              >
                <div className="size-11 rounded-xl bg-red/10 flex items-center justify-center shrink-0">
                  <AlertCircleIcon size={22} className="text-red" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-panel-text group-hover:text-accent transition-colors">
                    {overdueCount} pago(s) vencido(s)
                  </p>
                  <p className="text-xs text-panel-text-muted mt-0.5">Envía recordatorios a los inquilinos</p>
                </div>
                <span className="text-xs font-bold text-accent shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  Revisar &rarr;
                </span>
              </Link>
            )}

            {kycRequests.length > 0 && (
              <div className="flex items-center gap-4 bg-panel-card-bg border border-amber-200/60 rounded-xl px-5 py-4">
                <div className="size-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <UserMultiple02Icon size={22} className="text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-panel-text">
                    {kycRequests.length} solicitud(es) KYC pendiente(s)
                  </p>
                  <p className="text-xs text-panel-text-muted mt-0.5">Revisa y aprueba documentos</p>
                </div>
              </div>
            )}

            {metrics.expiringContracts > 0 && (
              <Link
                href="/landlord/contracts"
                className="flex items-center gap-4 bg-panel-card-bg border border-indigo-200/60 rounded-xl px-5 py-4 transition-all no-underline group"
              >
                <div className="size-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <FileValidationIcon size={22} className="text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-panel-text group-hover:text-accent transition-colors">
                    {metrics.expiringContracts} contrato(s) por vencer
                  </p>
                  <p className="text-xs text-panel-text-muted mt-0.5">Próximos 30 días. Renueva o gestiona.</p>
                </div>
                <span className="text-xs font-bold text-accent shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ir &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet01Icon size={20} className="text-emerald-600" />
            </div>
            <div className="text-xs font-semibold text-panel-text-muted">Ingresos del Mes</div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-panel-text">S/ {metrics.monthlyIncome.toLocaleString()}</div>
        </div>

        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Home01Icon size={20} className="text-accent" />
            </div>
            <div className="text-xs font-semibold text-panel-text-muted">Ocupación</div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-panel-text">{metrics.occupiedProperties}/{metrics.totalProperties}</div>
          <div className="text-[11px] text-panel-text-muted mt-1">{occupancyRate}% ocupado</div>
        </div>

        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileValidationIcon size={20} className="text-indigo-600" />
            </div>
            <div className="text-xs font-semibold text-panel-text-muted">Por Vencer</div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-panel-text">{metrics.expiringContracts}</div>
          <div className="text-[11px] text-panel-text-muted mt-1">Contratos próximos 30 días</div>
        </div>

        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Clock01Icon size={20} className="text-purple-600" />
            </div>
            <div className="text-xs font-semibold text-panel-text-muted">Pendientes</div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-panel-text">{pendingCount + overdueCount}</div>
          <div className="text-[11px] text-panel-text-muted mt-1">{pendingCount} pendientes, {overdueCount} vencidos</div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentTrafficLight payments={payments} />
        </div>
        <div className="space-y-6">
          <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-tight text-panel-text">Solicitudes KYC</h2>
              {kycRequests.length > 0 && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{kycRequests.length}</span>
              )}
            </div>
            <div className="space-y-3">
              {kycRequests.length > 0 ? (
                kycRequests.map((request) => (
                  <KycReviewCard key={request.id} request={request} />
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckmarkCircle01Icon size={36} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-panel-text-muted">No hay solicitudes pendientes</p>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/landlord/properties"
            className="flex items-center gap-3 bg-panel-card-bg border border-panel-border rounded-xl p-4 transition-all no-underline group"
          >
            <div className="size-10 rounded-lg bg-panel-hover-bg flex items-center justify-center">
              <Building03Icon size={20} className="text-panel-text-dim" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-panel-text group-hover:text-accent transition-colors">
                {metrics.totalProperties} Propiedades
              </p>
              <p className="text-xs text-panel-text-muted">{metrics.occupiedProperties} ocupadas, {metrics.totalProperties - metrics.occupiedProperties} disponibles</p>
            </div>
            <span className="text-xs font-bold text-accent shrink-0">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
