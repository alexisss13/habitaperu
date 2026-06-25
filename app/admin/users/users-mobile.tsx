'use client'

import { UserMultiple02Icon, CheckmarkCircle02Icon, Cancel01Icon } from "hugeicons-react"
import type { UsersData } from './users-view'

const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'bg-red/10 text-red'
    case 'LANDLORD': return 'bg-accent-secondary/10 text-accent-secondary'
    case 'TENANT': return 'bg-accent/10 text-accent'
    default: return 'bg-[rgba(116,133,151,0.1)] text-text-muted'
  }
}

const roleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'Admin'
    case 'LANDLORD': return 'Arrendador'
    case 'TENANT': return 'Inquilino'
    default: return role
  }
}

export function UsersMobile({ data }: { data: UsersData }) {
  const { users, stats } = data

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <UserMultiple02Icon size={24} className="text-admin-accent" />
          <h1 className="text-2xl font-bold text-admin-text">Usuarios</h1>
        </div>
        <p className="text-xs text-admin-text-muted">Gestiona todos los usuarios</p>
      </div>

      {/* Stats — 2 per row */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-admin-text' },
          { label: 'Verificados', value: stats.verified, color: 'text-green' },
          { label: 'Inquilinos', value: stats.tenants, color: 'text-accent' },
          { label: 'Arrendadores', value: stats.landlords, color: 'text-accent-secondary' },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-4 rounded-xl border border-admin-border">
            <div className="text-[0.625rem] font-bold text-admin-text-muted uppercase mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* User Cards */}
      <div className="px-4 flex flex-col gap-3">
        {users.length === 0 ? (
          <div className="bg-admin-card-bg rounded-xl border border-admin-border p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <UserMultiple02Icon size={36} className="text-admin-text-muted mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-admin-text mb-1">No se encontraron usuarios</h3>
            <p className="text-xs text-admin-text-muted max-w-xs">
              No hay usuarios registrados en el sistema.
            </p>
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-admin-card-bg rounded-xl border border-admin-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EA4227, #d63820)' }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-admin-text truncate">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-admin-text-muted truncate">{user.email}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[0.625rem] font-semibold shrink-0 ${roleBadgeClass(user.role)}`}>
                  {roleLabel(user.role)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-admin-text-muted">
                  {user.role === 'LANDLORD' && `${user._count.propertiesOwned} propiedades`}
                  {user.role === 'TENANT' && `${user._count.contractsAsTenant} contratos`}
                  {user.role === 'ADMIN' && 'Administrador'}
                </div>
                <div className="flex items-center gap-1.5">
                  {user.verified ? (
                    <>
                      <CheckmarkCircle02Icon size={14} className="text-green" />
                      <span className="text-[0.625rem] font-semibold text-green">Verificado</span>
                    </>
                  ) : (
                    <>
                      <Cancel01Icon size={14} className="text-[#f59e0b]" />
                      <span className="text-[0.625rem] font-semibold text-[#f59e0b]">Pendiente</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
