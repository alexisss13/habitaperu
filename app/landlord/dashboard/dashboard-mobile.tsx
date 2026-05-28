'use client'

import { Wallet01Icon, Home01Icon, FileValidationIcon, AlertCircleIcon } from 'hugeicons-react'
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
  const overdueCount = payments.filter(p => p.status === 'OVERDUE').length

  return (
    <div className="py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-text">Dashboard</h1>
        <p className="text-sm font-medium text-text-muted">Gestiona tus propiedades</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <Wallet01Icon size={20} className="text-emerald-600" />
          </div>
          <p className="text-xs font-semibold mb-1 text-text-muted">Ingresos</p>
          <p className="text-xl font-bold tracking-tight text-text">
            S/ {(metrics.monthlyIncome / 1000).toFixed(1)}k
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
            <Home01Icon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1 text-text-muted">Ocupadas</p>
          <p className="text-xl font-bold tracking-tight text-text">
            {metrics.occupiedProperties}/{metrics.totalProperties}
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="size-10 rounded-lg bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-3">
            <FileValidationIcon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1 text-text-muted">Por vencer</p>
          <p className="text-xl font-bold tracking-tight text-text">{metrics.expiringContracts}</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="size-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <AlertCircleIcon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1 text-text-muted">Ocupación</p>
          <p className="text-xl font-bold tracking-tight text-text">
            {Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)}%
          </p>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="mb-6 border border-accent-secondary/20 bg-red/10 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircleIcon size={20} className="shrink-0 mt-0.5 text-red" />
            <div className="ml-3">
              <h3 className="text-sm font-bold mb-0.5 text-text">Pagos Vencidos</h3>
              <p className="text-xs font-medium text-text-muted">{overdueCount} pago(s) vencido(s)</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <PaymentTrafficLight payments={payments} />
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
        <h2 className="text-base font-bold tracking-tight mb-4 text-text">Solicitudes KYC</h2>
        <div className="space-y-4">
          {kycRequests.length > 0 ? (
            kycRequests.map((request) => (
              <KycReviewCard key={request.id} request={request} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm font-medium text-text-muted">No hay solicitudes pendientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
