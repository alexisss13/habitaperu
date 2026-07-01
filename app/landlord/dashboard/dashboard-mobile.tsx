'use client'

import Link from 'next/link'
import { Wallet01Icon, Home01Icon, FileValidationIcon, AlertCircleIcon, CheckmarkCircle01Icon } from 'hugeicons-react'
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

export function DashboardMobile({ data }: { data: DashboardData }) {
  const { metrics, payments, kycRequests } = data
  const overdueCount = payments.filter(p => p.status === 'VENCIDO').length
  const pendingCount = payments.filter(p => p.status === 'PENDIENTE').length
  const occupancyRate = metrics.totalProperties > 0
    ? Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)
    : 0

  const hasAlerts = overdueCount > 0 || kycRequests.length > 0 || metrics.expiringContracts > 0

  return (
    <div className="py-6 px-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-admin-text mb-2">Dashboard</h1>
        <p className="text-sm text-admin-text-muted">Gestiona tus propiedades</p>
      </div>

      {/* ── Actionable Alerts ── */}
      {hasAlerts && (
        <div className="mb-5 space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Qué hacer ahora</span>
          {overdueCount > 0 && (
            <Link
              href="/landlord/payments"
              className="flex items-center gap-3 bg-white border border-red/20 rounded-xl px-4 py-3 no-underline"
            >
              <div className="size-10 rounded-lg bg-red/10 flex items-center justify-center shrink-0">
                <AlertCircleIcon size={20} className="text-red" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">{overdueCount} pago(s) vencido(s)</p>
                <p className="text-xs text-text-muted">Envía recordatorios</p>
              </div>
              <span className="text-xs font-bold text-accent">&rarr;</span>
            </Link>
          )}
          {kycRequests.length > 0 && (
            <div className="flex items-center gap-3 bg-white border border-amber-200/60 rounded-xl px-4 py-3">
              <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <span className="text-amber-600 font-bold text-sm">{kycRequests.length}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">KYC pendiente(s)</p>
                <p className="text-xs text-text-muted">Revisa documentos</p>
              </div>
            </div>
          )}
          {metrics.expiringContracts > 0 && (
            <Link
              href="/landlord/contracts"
              className="flex items-center gap-3 bg-white border border-indigo-200/60 rounded-xl px-4 py-3 no-underline"
            >
              <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <FileValidationIcon size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text">{metrics.expiringContracts} contrato(s) por vencer</p>
                <p className="text-xs text-text-muted">Próximos 30 días</p>
              </div>
              <span className="text-xs font-bold text-accent">&rarr;</span>
            </Link>
          )}
        </div>
      )}

      {/* ── Compact Metrics ── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
            <Wallet01Icon size={18} className="text-emerald-600" />
          </div>
          <p className="text-xs font-semibold mb-0.5 text-text-muted">Ingresos</p>
          <p className="text-lg font-bold tracking-tight text-text">
            S/ {(metrics.monthlyIncome / 1000).toFixed(1)}k
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
            <Home01Icon size={18} className="text-accent" />
          </div>
          <p className="text-xs font-semibold mb-0.5 text-text-muted">Ocupación</p>
          <p className="text-lg font-bold tracking-tight text-text">{occupancyRate}%</p>
          <p className="text-[10px] text-text-muted">{metrics.occupiedProperties}/{metrics.totalProperties} props.</p>
        </div>
      </div>

      {/* ── Secondary Metrics ── */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-3 text-center">
          <p className="text-xs font-semibold text-text-muted mb-0.5">Por vencer</p>
          <p className="text-lg font-bold text-text">{metrics.expiringContracts}</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-3 text-center">
          <p className="text-xs font-semibold text-text-muted mb-0.5">Pendientes</p>
          <p className="text-lg font-bold text-text">{pendingCount + overdueCount}</p>
        </div>
      </div>

      {/* ── Payment Traffic Light ── */}
      <div className="mb-5">
        <PaymentTrafficLight payments={payments} />
      </div>

      {/* ── KYC Section ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-tight text-text">Solicitudes KYC</h2>
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
            <div className="text-center py-6">
              <CheckmarkCircle01Icon size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-text-muted">No hay solicitudes pendientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
