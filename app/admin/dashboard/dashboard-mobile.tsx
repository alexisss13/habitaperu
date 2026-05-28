'use client'

import { UserMultiple02Icon, Building03Icon, FileValidationIcon, MoneyBag02Icon } from "hugeicons-react"
import AdminUserCard from "@/components/admin-user-card"
import AdminPropertyCard from "@/components/admin-property-card"
import type { AdminDashboardData } from './dashboard-view'

export function AdminDashboardMobile({ data }: { data: AdminDashboardData }) {
  const { totalUsers, totalProperties, activeContracts, totalRevenue, tenants, landlords, disponibles, ocupadas, recentUsers, recentProperties } = data
  const occupancyRate = totalProperties > 0 ? Math.round((ocupadas / totalProperties) * 100) : 0

  const statCard = "bg-admin-card-bg p-4 rounded-xl border border-admin-border"

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-admin-text mb-1">Dashboard</h1>
        <p className="text-xs text-admin-text-muted">Resumen de tu plataforma</p>
      </div>

      {/* Stats Grid 2×2 */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        <div className={statCard}>
          <div className="size-10 rounded-[8px] bg-accent/10 flex items-center justify-center mb-3">
            <UserMultiple02Icon size={20} className="text-accent" />
          </div>
          <div className="text-2xl font-bold text-admin-text">{totalUsers}</div>
          <div className="text-xs text-admin-text-muted mt-0.5">Usuarios</div>
          <div className="text-[0.625rem] text-admin-text-muted mt-1">{tenants} inq. • {landlords} arr.</div>
        </div>

        <div className={statCard}>
          <div className="size-10 rounded-[8px] bg-accent-secondary/10 flex items-center justify-center mb-3">
            <Building03Icon size={20} className="text-accent-secondary" />
          </div>
          <div className="text-2xl font-bold text-admin-text">{totalProperties}</div>
          <div className="text-xs text-admin-text-muted mt-0.5">Propiedades</div>
          <div className="text-[0.625rem] text-admin-text-muted mt-1">{disponibles} disp. • {ocupadas} ocup.</div>
        </div>

        <div className={statCard}>
          <div className="size-10 rounded-[8px] bg-[rgba(116,133,151,0.1)] flex items-center justify-center mb-3">
            <FileValidationIcon size={20} className="text-text-muted" />
          </div>
          <div className="text-2xl font-bold text-admin-text">{activeContracts}</div>
          <div className="text-xs text-admin-text-muted mt-0.5">Contratos</div>
          <div className="text-[0.625rem] text-admin-text-muted mt-1">Activos</div>
        </div>

        <div className={statCard}>
          <div className="size-10 rounded-[8px] bg-brown/10 flex items-center justify-center mb-3">
            <MoneyBag02Icon size={20} className="text-brown" />
          </div>
          <div className="text-lg font-bold text-admin-text">S/ {(totalRevenue / 1000).toFixed(0)}k</div>
          <div className="text-xs text-admin-text-muted mt-0.5">Ingresos</div>
          <div className="text-[0.625rem] text-brown mt-1">Ocup. {occupancyRate}%</div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="px-4 mb-4">
        <div className="bg-admin-card-bg rounded-xl border border-admin-border p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-admin-border">
            <h2 className="text-sm font-semibold text-admin-text">Usuarios Recientes</h2>
            <span className="text-xs text-admin-text-muted">Últimos 5</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentUsers.map((user, i) => <AdminUserCard key={user.id} user={user} index={i} />)}
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="px-4">
        <div className="bg-admin-card-bg rounded-xl border border-admin-border p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-admin-border">
            <h2 className="text-sm font-semibold text-admin-text">Propiedades Recientes</h2>
            <span className="text-xs text-admin-text-muted">Últimas 5</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentProperties.map((p, i) => <AdminPropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
