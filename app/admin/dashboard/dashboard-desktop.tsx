'use client'

import { UserMultiple02Icon, Building03Icon, FileValidationIcon, MoneyBag02Icon, ArrowUp01Icon } from "hugeicons-react"
import AdminUserCard from "@/components/admin-user-card"
import AdminPropertyCard from "@/components/admin-property-card"
import type { AdminDashboardData } from './dashboard-view'

const statCard = "bg-admin-card-bg p-6 rounded-xl border border-admin-border"
const iconWrap = "size-12 rounded-[10px] flex items-center justify-center"
const badge = "px-2 py-1 rounded-[6px] flex items-center gap-1"

export function AdminDashboardDesktop({ data }: { data: AdminDashboardData }) {
  const { totalUsers, totalProperties, activeContracts, totalRevenue, tenants, landlords, disponibles, ocupadas, recentUsers, recentProperties } = data
  const occupancyRate = totalProperties > 0 ? Math.round((ocupadas / totalProperties) * 100) : 0
  const avgRevenue = totalProperties > 0 ? Math.round(totalRevenue / totalProperties) : 0

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Dashboard</h1>

      {/* Stats Grid 4 columns */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {/* Users */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${iconWrap} bg-accent/10`}>
              <UserMultiple02Icon size={24} className="text-accent" />
            </div>
            <div className={`${badge} bg-accent/10`}>
              <span className="text-xs font-semibold text-accent">{tenants} INQ</span>
            </div>
          </div>
          <div className="text-[2rem] font-bold text-admin-text mb-1">{totalUsers}</div>
          <div className="text-sm text-admin-text-muted mb-3">Total Usuarios</div>
          <div className="text-xs text-admin-text-muted">{tenants} inquilinos • {landlords} arrendadores</div>
        </div>

        {/* Properties */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${iconWrap} bg-accent-secondary/10`}>
              <Building03Icon size={24} className="text-accent-secondary" />
            </div>
            <div className={`${badge} bg-accent-secondary/10`}>
              <span className="text-xs font-semibold text-accent-secondary">{disponibles} LIB</span>
            </div>
          </div>
          <div className="text-[2rem] font-bold text-admin-text mb-1">{totalProperties}</div>
          <div className="text-sm text-admin-text-muted mb-3">Propiedades</div>
          <div className="text-xs text-admin-text-muted">{disponibles} disponibles • {ocupadas} ocupadas</div>
        </div>

        {/* Contracts */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${iconWrap} bg-[rgba(116,133,151,0.1)]`}>
              <FileValidationIcon size={24} className="text-text-muted" />
            </div>
            <div className={`${badge} bg-brown/10`}>
              <span className="text-xs font-semibold text-brown">{tenants + landlords} usuarios</span>
            </div>
          </div>
          <div className="text-[2rem] font-bold text-admin-text mb-1">{activeContracts}</div>
          <div className="text-sm text-admin-text-muted mb-3">Contratos Activos</div>
          <div className="text-xs text-admin-text-muted">{ocupadas} propiedades ocupadas</div>
        </div>

        {/* Revenue */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${iconWrap} bg-brown/10`}>
              <MoneyBag02Icon size={24} className="text-brown" />
            </div>
            <div className={`${badge} bg-brown/10`}>
              <ArrowUp01Icon size={14} className="text-brown" />
              <span className="text-xs font-semibold text-brown">S/{Math.round(totalRevenue / (activeContracts || 1)).toLocaleString()}/cto</span>
            </div>
          </div>
          <div className="text-[2rem] font-bold text-admin-text mb-1">S/ {totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-admin-text-muted mb-3">Ingresos Totales</div>
          <div className="text-xs text-admin-text-muted">Desde el inicio</div>
        </div>
      </div>

      {/* Content Grid 2 columns */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Recent Users */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-admin-border">
            <h2 className="text-base font-semibold text-admin-text">Usuarios Recientes</h2>
            <span className="text-xs text-admin-text-muted font-medium">Últimos 5</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentUsers.map((user, i) => <AdminUserCard key={user.id} user={user} index={i} />)}
          </div>
        </div>

        {/* Recent Properties */}
        <div className={statCard}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-admin-border">
            <h2 className="text-base font-semibold text-admin-text">Propiedades Recientes</h2>
            <span className="text-xs text-admin-text-muted font-medium">Últimas 5</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentProperties.map((p, i) => <AdminPropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </div>

      {/* Quick Stats Row 3 columns */}
      <div className="grid grid-cols-3 gap-5">
        <div className={statCard}>
          <div className="text-sm text-admin-text-muted mb-2">Tasa de Ocupación</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-admin-text">{occupancyRate}%</div>
            <div className="text-xs text-brown font-semibold">+5% vs mes anterior</div>
          </div>
        </div>
        <div className={statCard}>
          <div className="text-sm text-admin-text-muted mb-2">Ingreso Promedio</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-admin-text">S/ {avgRevenue.toLocaleString()}</div>
            <div className="text-xs text-admin-text-muted font-medium">por propiedad</div>
          </div>
        </div>
        <div className={statCard}>
          <div className="text-sm text-admin-text-muted mb-2">Nuevos Este Mes</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-admin-text">{recentUsers.length + recentProperties.length}</div>
            <div className="text-xs text-brown font-semibold">+{recentUsers.length} usuarios, +{recentProperties.length} prop.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
