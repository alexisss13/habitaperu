'use client'

import Link from "next/link"
import { Home01Icon, Search01Icon, FavouriteIcon, FileValidationIcon, CreditCardIcon, CheckmarkCircle01Icon } from "hugeicons-react"

interface TenantDashboardData {
  activeProperty: {
    title: string
    price: number
  } | null
  nextPayment: {
    dueDate: string
    amount: number
  } | null
  paymentHistory: Array<{
    id: string
    month: string
    date: string
    amount: number
    status: string
  }>
  favoritesCount: number
}

interface Props {
  session: { user: { name?: string | null } }
  data: TenantDashboardData
}

export function TenantDashboardDesktop({ session, data }: Props) {
  // Format dynamic dates
  const formatPaymentDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })
  }

  return (
    <div className="min-h-screen bg-bg-2 pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">Mi Panel</h1>
          <p className="text-text-muted text-base">Bienvenido, {session.user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-10">
          {/* Propiedad Actual */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Home01Icon size={24} className="text-accent-secondary" />
              <h3 className="text-sm font-semibold text-text-muted">Propiedad Actual</h3>
            </div>
            {data.activeProperty ? (
              <>
                <p className="text-xl font-semibold text-text truncate">{data.activeProperty.title}</p>
                <p className="text-sm text-text-muted mt-1">S/ {data.activeProperty.price.toLocaleString('es-PE')}/mes</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-text-dim">Sin contrato activo</p>
                <p className="text-sm text-text-muted mt-1">Busca tu próximo hogar</p>
              </>
            )}
          </div>

          {/* Favoritos */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <FavouriteIcon size={24} className="text-accent-secondary" />
              <h3 className="text-sm font-semibold text-text-muted">Favoritos</h3>
            </div>
            <p className="text-3xl font-bold text-text">{data.favoritesCount}</p>
            <p className="text-sm text-text-muted mt-1">Propiedades guardadas</p>
          </div>

          {/* Próximo Pago */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <CreditCardIcon size={24} className="text-green" />
              <h3 className="text-sm font-semibold text-text-muted">Próximo Pago</h3>
            </div>
            {data.nextPayment ? (
              <>
                <p className="text-xl font-semibold text-text">{formatPaymentDate(data.nextPayment.dueDate)}</p>
                <p className="text-sm text-text-muted mt-1">S/ {data.nextPayment.amount.toLocaleString('es-PE')}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-text-dim">Al día</p>
                <p className="text-sm text-text-muted mt-1">No tienes pagos pendientes</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-text mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <Link href="/propiedades"
              className="flex items-center gap-3 p-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 no-underline"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}
            >
              <Search01Icon size={20} />
              <span>Buscar Propiedades</span>
            </Link>
            <Link href="/tenant/favorites"
              className="flex items-center gap-3 p-4 bg-bg-2 rounded-lg text-text font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <FavouriteIcon size={20} />
              <span>Mis Favoritos</span>
            </Link>
            <Link href="/tenant/contract"
              className="flex items-center gap-3 p-4 bg-bg-2 rounded-lg text-text font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <FileValidationIcon size={20} />
              <span>Mi Contrato</span>
            </Link>
            <Link href="/"
              className="flex items-center gap-3 p-4 bg-bg-2 rounded-lg text-text font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <Home01Icon size={20} />
              <span>Ir al Inicio</span>
            </Link>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-text mb-6">Historial de Pagos</h2>
          <div className="flex flex-col gap-4">
            {data.paymentHistory.length > 0 ? (
              data.paymentHistory.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-bg-2 rounded-lg hover:bg-bg-3 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text mb-1">{p.month}</p>
                    <p className="text-xs text-text-muted">
                      {p.status === 'PAID' ? `Pagado el ${p.date}` : `Vence el ${p.date}`}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className={`text-base font-semibold ${p.status === 'PAID' ? 'text-green' : p.status === 'OVERDUE' ? 'text-red' : 'text-accent-secondary'}`}>
                        S/ {p.amount.toLocaleString('es-PE')}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        p.status === 'PAID' ? 'text-green bg-green/10' : p.status === 'OVERDUE' ? 'text-red bg-red/10' : 'text-accent-secondary bg-accent-secondary/10'
                      }`}>
                        {p.status === 'PAID' ? 'Pagado' : p.status === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-gray-200">
                <CheckmarkCircle01Icon size={48} className="text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-text mb-1">Sin historial de pagos</p>
                <p className="text-xs font-medium text-text-muted">No se registran pagos activos o anteriores.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
