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

export function TenantDashboardMobile({ session, data }: Props) {
  // Format dynamic dates
  const formatPaymentDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-bg-2 pt-[64px] pb-8">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Mi Panel</h1>
          <p className="text-text-muted text-sm">Bienvenido, {session.user.name}</p>
        </div>

        {/* Stats Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Propiedad Actual */}
          <div className="bg-white rounded-xl border border-border p-4 col-span-2 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Home01Icon size={20} className="text-accent-secondary" />
              <h3 className="text-xs font-semibold text-text-muted">Propiedad Actual</h3>
            </div>
            {data.activeProperty ? (
              <>
                <p className="text-base font-semibold text-text truncate">{data.activeProperty.title}</p>
                <p className="text-xs text-text-muted mt-0.5">S/ {data.activeProperty.price.toLocaleString('es-PE')}/mes</p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-text-dim">Sin contrato activo</p>
                <p className="text-xs text-text-muted mt-0.5">Busca tu próximo hogar</p>
              </>
            )}
          </div>

          {/* Favoritos */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FavouriteIcon size={18} className="text-accent-secondary" />
              <h3 className="text-xs font-semibold text-text-muted">Favoritos</h3>
            </div>
            <p className="text-2xl font-bold text-text">{data.favoritesCount}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Propiedades guardadas</p>
          </div>

          {/* Próximo Pago */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CreditCardIcon size={18} className="text-green" />
              <h3 className="text-xs font-semibold text-text-muted">Próximo Pago</h3>
            </div>
            {data.nextPayment ? (
              <>
                <p className="text-base font-semibold text-text truncate">{formatPaymentDate(data.nextPayment.dueDate)}</p>
                <p className="text-xs text-text-muted mt-0.5">S/ {data.nextPayment.amount.toLocaleString('es-PE')}</p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-text-dim">Al día</p>
                <p className="text-xs text-text-muted mt-0.5">Sin pagos pendientes</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border p-5 mb-5 shadow-sm">
          <h2 className="text-base font-semibold text-text mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/propiedades"
              className="flex items-center gap-2 p-3 rounded-lg font-semibold text-white text-sm transition-all no-underline"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}
            >
              <Search01Icon size={18} />
              <span>Buscar</span>
            </Link>
            <Link href="/tenant/favorites"
              className="flex items-center gap-2 p-3 bg-bg-2 rounded-lg text-text text-sm font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <FavouriteIcon size={18} />
              <span>Favoritos</span>
            </Link>
            <Link href="/tenant/contract"
              className="flex items-center gap-2 p-3 bg-bg-2 rounded-lg text-text text-sm font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <FileValidationIcon size={18} />
              <span>Contrato</span>
            </Link>
            <Link href="/"
              className="flex items-center gap-2 p-3 bg-bg-2 rounded-lg text-text text-sm font-medium transition-all hover:bg-bg-3 no-underline"
            >
              <Home01Icon size={18} />
              <span>Inicio</span>
            </Link>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-base font-semibold text-text mb-4">Historial de Pagos</h2>
          <div className="flex flex-col gap-3">
            {data.paymentHistory.length > 0 ? (
              data.paymentHistory.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-bg-2 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-text mb-0.5">{p.month}</p>
                    <p className="text-xs text-text-muted">
                      {p.status === 'PAID' ? `Pagado el ${p.date}` : `Vence el ${p.date}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${p.status === 'PAID' ? 'text-green' : p.status === 'OVERDUE' ? 'text-red' : 'text-accent-secondary'}`}>
                      S/ {p.amount.toLocaleString('es-PE')}
                    </p>
                    <span className={`text-[0.625rem] px-2 py-0.5 rounded font-medium inline-block ${
                      p.status === 'PAID' ? 'text-green bg-green/10' : p.status === 'OVERDUE' ? 'text-red bg-red/10' : 'text-accent-secondary bg-accent-secondary/10'
                    }`}>
                      {p.status === 'PAID' ? 'Pagado' : p.status === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-gray-200">
                <CheckmarkCircle01Icon size={36} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-text mb-0.5">Sin historial de pagos</p>
                <p className="text-[10px] font-medium text-text-muted">No se registran pagos activos o anteriores.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
