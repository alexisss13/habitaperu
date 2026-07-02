'use client'

import { useEffect, useRef, useState } from "react"
import { UserMultiple02Icon, Search01Icon, FilterIcon, Mail01Icon, SmartPhone02Icon, CheckmarkCircle02Icon, Cancel01Icon, IdentityCardIcon } from "hugeicons-react"
import { usePagination } from '@/hooks/use-pagination'
import { AdminPagination } from '@/components/ui/pagination'
import type { AdminUser, UsersData } from './users-view'

const ROLE_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'TENANT', label: 'Inquilino' },
  { value: 'LANDLORD', label: 'Arrendador' },
  { value: 'ADMIN', label: 'Administrador' },
] as const

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
    case 'ADMIN': return 'Administrador'
    case 'LANDLORD': return 'Arrendador'
    case 'TENANT': return 'Inquilino'
    default: return role
  }
}

export function UsersDesktop({ data }: { data: UsersData }) {
  const { users, stats } = data
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const matchRole = !roleFilter || u.role === roleFilter
    return matchSearch && matchRole
  })

  const pagination = usePagination(filtered, 10, [roleFilter])
  const activeRoleLabel = ROLE_FILTERS.find(r => r.value === roleFilter)?.label ?? 'Todos'

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold text-admin-text mb-6">Usuarios</h1>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'TOTAL', value: stats.total, color: 'text-admin-text' },
          { label: 'INQUILINOS', value: stats.tenants, color: 'text-accent' },
          { label: 'ARRENDADORES', value: stats.landlords, color: 'text-accent-secondary' },
          { label: 'ADMINS', value: stats.admins, color: 'text-red' },
          { label: 'VERIFICADOS', value: stats.verified, color: 'text-green' },
        ].map(s => (
          <div key={s.label} className="bg-admin-card-bg p-5 rounded-xl border border-admin-border">
            <div className="text-xs font-bold text-admin-text-muted mb-2">{s.label}</div>
            <div className={`text-[2rem] font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-admin-card-bg px-6 py-4 rounded-xl border border-admin-border mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search01Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email..."
            className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm text-admin-text bg-admin-bg outline-none focus:border-admin-accent"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-admin-border rounded-lg text-sm font-medium text-admin-text hover:bg-admin-bg transition-colors"
          >
            <FilterIcon size={16} />
            {roleFilter ? `Rol: ${activeRoleLabel}` : 'Filtros'}
          </button>
          {filterOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-admin-card-bg border border-admin-border rounded-xl shadow-lg min-w-[180px] py-1.5 z-20">
              {ROLE_FILTERS.map(r => (
                <button
                  key={r.value}
                  onClick={() => { setRoleFilter(r.value); setFilterOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm cursor-pointer border-none bg-transparent hover:bg-admin-bg transition-colors ${
                    roleFilter === r.value ? 'font-bold text-admin-accent' : 'text-admin-text'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-admin-card-bg rounded-xl border border-admin-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <UserMultiple02Icon size={48} className="text-admin-text-muted mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-admin-text mb-2">No se encontraron usuarios</h3>
            <p className="text-sm text-admin-text-muted max-w-sm">
              No hay usuarios que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[rgba(116,133,151,0.05)] border-b border-admin-border text-xs font-bold text-admin-text-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Usuario</th>
                    <th className="px-6 py-4 font-bold">Contacto</th>
                    <th className="px-6 py-4 font-bold">Rol</th>
                    <th className="px-6 py-4 font-bold">Actividad</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {pagination.paginatedItems.map(user => (
                    <tr
                      key={user.id}
                      onClick={() => setViewingUser(user)}
                      className="hover:bg-[rgba(116,133,151,0.05)] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                            style={{ background: 'linear-gradient(135deg, #EA4227, #d63820)' }}>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-admin-text mb-0.5">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-admin-text-muted">ID: {user.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Mail01Icon size={14} className="text-admin-text-muted" />
                          <span className="text-[0.8rem] text-admin-text">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5">
                            <SmartPhone02Icon size={14} className="text-admin-text-muted" />
                            <span className="text-[0.8rem] text-admin-text-muted">{user.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeClass(user.role)}`}>
                          {roleLabel(user.role)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-admin-text">
                        {user.role === 'LANDLORD' && `${user._count.propertiesOwned} propiedades`}
                        {user.role === 'TENANT' && `${user._count.contractsAsTenant} contratos`}
                        {user.role === 'ADMIN' && '-'}
                      </td>

                      <td className="px-6 py-5">
                        {user.verified ? (
                          <div className="flex items-center gap-1.5">
                            <CheckmarkCircle02Icon size={16} className="text-green" />
                            <span className="text-xs font-semibold text-green">Verificado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Cancel01Icon size={16} className="text-[#f59e0b]" />
                            <span className="text-xs font-semibold text-[#f59e0b]">Pendiente</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="px-3 py-1.5 border border-admin-border rounded-md text-xs text-admin-text font-medium hover:bg-admin-bg transition-colors cursor-pointer"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-admin-card-bg rounded-b-xl border-t border-admin-border">
              <AdminPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
                itemLabel="usuarios"
              />
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      {viewingUser && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          onClick={() => setViewingUser(null)}
        >
          <div
            className="bg-admin-card-bg rounded-2xl border border-admin-border shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="size-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                style={{ background: 'linear-gradient(135deg, #EA4227, #d63820)' }}
              >
                {viewingUser.firstName?.[0]}{viewingUser.lastName?.[0]}
              </div>
              <div>
                <div className="text-base font-bold text-admin-text">{viewingUser.firstName} {viewingUser.lastName}</div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadgeClass(viewingUser.role)}`}>
                  {roleLabel(viewingUser.role)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail01Icon size={16} className="text-admin-text-muted shrink-0" />
                <span className="text-admin-text">{viewingUser.email}</span>
              </div>
              {viewingUser.phone && (
                <div className="flex items-center gap-2.5">
                  <SmartPhone02Icon size={16} className="text-admin-text-muted shrink-0" />
                  <span className="text-admin-text">{viewingUser.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <IdentityCardIcon size={16} className="text-admin-text-muted shrink-0" />
                <span className="text-admin-text-muted">ID: {viewingUser.id}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {viewingUser.verified ? (
                  <CheckmarkCircle02Icon size={16} className="text-green shrink-0" />
                ) : (
                  <Cancel01Icon size={16} className="text-[#f59e0b] shrink-0" />
                )}
                <span className={viewingUser.verified ? 'text-green font-semibold' : 'text-[#f59e0b] font-semibold'}>
                  {viewingUser.verified ? 'Verificado' : 'Pendiente de verificación'}
                </span>
              </div>
              <div className="h-px bg-admin-border my-1" />
              <div className="flex items-center justify-between">
                <span className="text-admin-text-muted">Miembro desde</span>
                <span className="font-semibold text-admin-text">
                  {new Date(viewingUser.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {viewingUser.role === 'LANDLORD' && (
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Propiedades publicadas</span>
                  <span className="font-semibold text-admin-text">{viewingUser._count.propertiesOwned}</span>
                </div>
              )}
              {viewingUser.role === 'TENANT' && (
                <div className="flex items-center justify-between">
                  <span className="text-admin-text-muted">Contratos como inquilino</span>
                  <span className="font-semibold text-admin-text">{viewingUser._count.contractsAsTenant}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewingUser(null)}
              className="mt-6 w-full py-2.5 border border-admin-border rounded-lg text-sm font-semibold text-admin-text hover:bg-admin-bg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
