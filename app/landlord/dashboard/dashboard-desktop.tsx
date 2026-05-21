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

interface DashboardDesktopProps {
  data: DashboardData
}

export function DashboardDesktop({ data }: DashboardDesktopProps) {
  const { metrics, payments, kycRequests } = data

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          Dashboard del Arrendador
        </h1>
        <p className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>
          Gestiona tus propiedades, contratos y pagos desde un solo lugar
        </p>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ingresos del Mes */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Wallet01Icon size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Ingresos del Mes</p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            S/ {metrics.monthlyIncome.toLocaleString()}
          </p>
        </div>

        {/* Propiedades Ocupadas */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Home01Icon size={24} />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Propiedades Ocupadas</p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {metrics.occupiedProperties}/{metrics.totalProperties}
          </p>
        </div>

        {/* Contratos por Vencer */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-secondary-light)', color: 'var(--accent-secondary)' }}>
              <FileValidationIcon size={24} />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Contratos por Vencer</p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {metrics.expiringContracts}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Próximos 30 días</p>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--purple-bg)', color: 'var(--purple)' }}>
              <AlertCircleIcon size={24} />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Tasa de Ocupación</p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)}%
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Traffic Light - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PaymentTrafficLight payments={payments} />
        </div>

        {/* KYC Reviews - Takes 1 column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              Solicitudes KYC Pendientes
            </h2>
            <div className="space-y-4">
              {kycRequests.length > 0 ? (
                kycRequests.map((request) => (
                  <KycReviewCard key={request.id} request={request} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    No hay solicitudes pendientes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {payments.filter(p => p.status === 'OVERDUE').length > 0 && (
        <div className="mt-6 border rounded-xl p-6" style={{ backgroundColor: 'var(--red-bg)', borderColor: 'rgba(234, 66, 39, 0.2)' }}>
          <div className="flex items-start">
            <AlertCircleIcon size={24} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--red)' }} />
            <div className="ml-4">
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
                Pagos Vencidos Detectados
              </h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Tienes {payments.filter(p => p.status === 'OVERDUE').length} pago(s) vencido(s). 
                Considera enviar recordatorios a los inquilinos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
