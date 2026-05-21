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
    id: string
    amount: number
    dueDate: string
    status: string
    tenant: {
      name: string
      email: string
    }
    property: {
      title: string
      district: string
    }
  }>
  kycRequests: Array<{
    id: string
    name: string
    email: string
    kycScore: number
    kycStatus: string
  }>
}

interface DashboardMobileProps {
  data: DashboardData
}

export function DashboardMobile({ data }: DashboardMobileProps) {
  const { metrics, payments, kycRequests } = data

  return (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          Dashboard
        </h1>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Gestiona tus propiedades
        </p>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Ingresos del Mes */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <Wallet01Icon size={20} className="text-emerald-600" />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Ingresos</p>
          <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            S/ {(metrics.monthlyIncome / 1000).toFixed(1)}k
          </p>
        </div>

        {/* Propiedades Ocupadas */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Home01Icon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Ocupadas</p>
          <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {metrics.occupiedProperties}/{metrics.totalProperties}
          </p>
        </div>

        {/* Contratos por Vencer */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-secondary-light)', color: 'var(--accent-secondary)' }}>
            <FileValidationIcon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Por vencer</p>
          <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {metrics.expiringContracts}
          </p>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--purple-bg)', color: 'var(--purple)' }}>
            <AlertCircleIcon size={20} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Ocupación</p>
          <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)}%
          </p>
        </div>
      </div>

      {/* Alerts */}
      {payments.filter(p => p.status === 'OVERDUE').length > 0 && (
        <div className="mb-6 border rounded-xl p-4" style={{ backgroundColor: 'var(--red-bg)', borderColor: 'rgba(234, 66, 39, 0.2)' }}>
          <div className="flex items-start">
            <AlertCircleIcon size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--red)' }} />
            <div className="ml-3">
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>
                Pagos Vencidos
              </h3>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {payments.filter(p => p.status === 'OVERDUE').length} pago(s) vencido(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Traffic Light */}
      <div className="mb-6">
        <PaymentTrafficLight payments={payments} />
      </div>

      {/* KYC Reviews */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
        <h2 className="text-base font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
          Solicitudes KYC
        </h2>
        <div className="space-y-4">
          {kycRequests.length > 0 ? (
            kycRequests.map((request) => (
              <KycReviewCard key={request.id} request={request} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                No hay solicitudes pendientes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
