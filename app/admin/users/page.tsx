import { prisma } from "@/lib/db"
import { UserMultiple02Icon, Search01Icon, FilterIcon, Mail01Icon, SmartPhone02Icon, CheckmarkCircle02Icon, Cancel01Icon } from "hugeicons-react"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          propertiesOwned: true,
          contractsAsTenant: true
        }
      }
    }
  })

  const stats = {
    total: users.length,
    tenants: users.filter(u => u.role === 'TENANT').length,
    landlords: users.filter(u => u.role === 'LANDLORD').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    verified: users.filter(u => u.verified).length
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' }
      case 'LANDLORD': return { bg: 'rgba(234,66,39,0.1)', color: '#EA4227' }
      case 'TENANT': return { bg: 'rgba(15,52,87,0.1)', color: '#0f3457' }
      default: return { bg: 'rgba(116,133,151,0.1)', color: '#748597' }
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'LANDLORD': return 'Arrendador'
      case 'TENANT': return 'Inquilino'
      default: return role
    }
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserMultiple02Icon size={32} style={{ color: 'var(--admin-accent)' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              Usuarios
            </h1>
          </div>
          <button style={{
            padding: '12px 24px',
            background: 'var(--admin-accent-gradient)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(15,52,87,0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Nuevo Usuario
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          Gestiona todos los usuarios de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
            TOTAL
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-text)' }}>
            {stats.total}
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
            INQUILINOS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f3457' }}>
            {stats.tenants}
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
            ARRENDADORES
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#EA4227' }}>
            {stats.landlords}
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
            ADMINS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
            {stats.admins}
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
            VERIFICADOS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {stats.verified}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--admin-card-bg)',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '1px solid var(--admin-border)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search01Icon size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--admin-text-muted)'
          }} />
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: 'var(--admin-text)',
              background: 'var(--admin-bg)',
              outline: 'none'
            }}
          />
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'var(--admin-hover-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text)',
          cursor: 'pointer'
        }}>
          <FilterIcon size={16} />
          Filtros
        </button>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'var(--admin-card-bg)',
        borderRadius: '12px',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
          padding: '16px 24px',
          background: 'var(--admin-hover-bg)',
          borderBottom: '1px solid var(--admin-border)',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--admin-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>Usuario</div>
          <div>Contacto</div>
          <div>Rol</div>
          <div>Propiedades</div>
          <div>Estado</div>
          <div></div>
        </div>

        {/* Table Body */}
        {users.map((user) => {
          const roleBadge = getRoleBadgeColor(user.role)
          return (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
                padding: '20px 24px',
                borderBottom: '1px solid var(--admin-border)',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Usuario */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EA4227, #d63820)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '2px' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    ID: {user.id.slice(0, 8)}
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Mail01Icon size={14} style={{ color: 'var(--admin-text-muted)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>{user.email}</span>
                </div>
                {user.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SmartPhone02Icon size={14} style={{ color: 'var(--admin-text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Rol */}
              <div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: roleBadge.bg,
                  color: roleBadge.color
                }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* Propiedades/Contratos */}
              <div style={{ fontSize: '0.875rem', color: 'var(--admin-text)' }}>
                {user.role === 'LANDLORD' && `${user._count.propertiesOwned} propiedades`}
                {user.role === 'TENANT' && `${user._count.contractsAsTenant} contratos`}
                {user.role === 'ADMIN' && '-'}
              </div>

              {/* Estado */}
              <div>
                {user.verified ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckmarkCircle02Icon size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Verificado</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cancel01Icon size={16} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>Pendiente</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--admin-text)',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Ver
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
