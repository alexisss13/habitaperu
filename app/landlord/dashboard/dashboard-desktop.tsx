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

export function DashboardDesktop({ data }: { data: DashboardData }) {
  const { metrics, payments, kycRequests } = data
  const overdueCount = payments.filter(p => p.status === 'OVERDUE').length

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-text">Dashboard del Arrendador</h1>
        <p className="text-base font-medium text-text-muted">
          Gestiona tus propiedades, contratos y pagos desde un solo lugar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <Wallet01Icon size={24} className="text-emerald-600" />
          </div>
          <p className="text-sm font-semibold mb-1 text-text-muted">Ingresos del Mes</p>
          <p className="text-3xl font-bold tracking-tight text-text">S/ {metrics.monthlyIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
            <Home01Icon size={24} />
          </div>
          <p className="text-sm font-semibold mb-1 text-text-muted">Propiedades Ocupadas</p>
          <p className="text-3xl font-bold tracking-tight text-text">{metrics.occupiedProperties}/{metrics.totalProperties}</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-4">
            <FileValidationIcon size={24} />
          </div>
          <p className="text-sm font-semibold mb-1 text-text-muted">Contratos por Vencer</p>
          <p className="text-3xl font-bold tracking-tight text-text">{metrics.expiringContracts}</p>
          <p className="text-xs mt-1 text-text-muted">Próximos 30 días</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <AlertCircleIcon size={24} />
          </div>
          <p className="text-sm font-semibold mb-1 text-text-muted">Tasa de Ocupación</p>
          <p className="text-3xl font-bold tracking-tight text-text">
            {Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentTrafficLight payments={payments} />
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-text">Solicitudes KYC Pendientes</h2>
            <div className="space-y-4">
              {kycRequests.length > 0 ? (
                kycRequests.map((request) => (
                  <KycReviewCard key={request.id} request={request} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-text-muted">No hay solicitudes pendientes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="mt-6 border border-accent-secondary/20 bg-red/10 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircleIcon size={24} className="shrink-0 mt-0.5 text-red" />
            <div className="ml-4">
              <h3 className="text-base font-bold mb-1 text-text">Pagos Vencidos Detectados</h3>
              <p className="text-sm font-medium text-text-muted">
                Tienes {overdueCount} pago(s) vencido(s). Considera enviar recordatorios a los inquilinos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
