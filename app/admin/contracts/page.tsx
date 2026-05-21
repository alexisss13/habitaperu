import { prisma } from "@/lib/db"
import { FileValidationIcon, Search01Icon, FilterIcon, Calendar03Icon, UserIcon, Building03Icon } from "hugeicons-react"

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      property: {
        select: {
          title: true,
          district: true,
          price: true,
          owner: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })

  const stats = {
    total: contracts.length,
    activo: contracts.filter(c => c.status === 'ACTIVE').length,
    vencido: contracts.filter(c => c.status === 'FINISHED' || c.status === 'BREACHED_CANCELLED').length,
    totalValue: contracts
      .filter(c => c.status === 'ACTIVE')
      .reduce((sum, c) => sum + Number(c.monthlyRent), 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Activo' }
      case 'FINISHED': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Vencido' }
      case 'BREACHED_CANCELLED': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Cancelado' }
      case 'DRAFT': return { bg: 'rgba(116,133,151,0.1)', color: '#748597', label: 'Borrador' }
      case 'PENDING_TENANT': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Pend. Inquilino' }
      case 'PENDING_LANDLORD': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Pend. Arrendador' }
      default: return { bg: 'rgba(116,133,151,0.1)', color: '#748597', label: status }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const calculateDuration = (start: Date, end: Date) => {
    const months = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30))
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileValidationIcon size={32} style={{ color: 'var(--admin-accent)' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              Contratos
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
            + Nuevo Contrato
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          Gestiona todos los contratos de arrendamiento
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
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
            ACTIVOS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {stats.activo}
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
            VENCIDOS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
            {stats.vencido}
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
            VALOR MENSUAL
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
            S/ {stats.totalValue.toLocaleString()}
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
            placeholder="Buscar por inquilino, propiedad..."
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

      {/* Contracts Table */}
      <div style={{
        background: 'var(--admin-card-bg)',
        borderRadius: '12px',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1fr 1fr 0.8fr 0.5fr',
          padding: '16px 24px',
          background: 'var(--admin-hover-bg)',
          borderBottom: '1px solid var(--admin-border)',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--admin-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>ID</div>
          <div>Inquilino</div>
          <div>Propiedad</div>
          <div>Periodo</div>
          <div>Renta Mensual</div>
          <div>Estado</div>
          <div></div>
        </div>

        {/* Table Body */}
        {contracts.map((contract) => {
          const statusBadge = getStatusBadge(contract.status)
          return (
            <div
              key={contract.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1fr 1fr 0.8fr 0.5fr',
                padding: '20px 24px',
                borderBottom: '1px solid var(--admin-border)',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* ID */}
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>
                #{contract.id.slice(0, 6)}
              </div>

              {/* Inquilino */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f3457, #061829)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    {contract.tenant.firstName[0]}{contract.tenant.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)' }}>
                      {contract.tenant.firstName} {contract.tenant.lastName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                      {contract.tenant.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Propiedad */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-text)', marginBottom: '2px' }}>
                  {contract.property.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  {contract.property.district} • {contract.property.owner.firstName} {contract.property.owner.lastName}
                </div>
              </div>

              {/* Periodo */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text)', marginBottom: '4px' }}>
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                  Duración: {calculateDuration(contract.startDate, contract.endDate)}
                </div>
              </div>

              {/* Renta Mensual */}
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)' }}>
                S/ {Number(contract.monthlyRent).toLocaleString()}
              </div>

              {/* Estado */}
              <div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: statusBadge.bg,
                  color: statusBadge.color
                }}>
                  {statusBadge.label}
                </span>
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
