import { prisma } from "@/lib/db"
import { MoneyBag02Icon, Search01Icon, FilterIcon, Calendar03Icon, CheckmarkCircle02Icon, Clock01Icon, Cancel01Icon } from "hugeicons-react"

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      contract: {
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
              district: true
            }
          }
        }
      }
    }
  })

  const stats = {
    total: payments.length,
    pagado: payments.filter(p => p.status === 'PAGADO').length,
    pendiente: payments.filter(p => p.status === 'PENDIENTE').length,
    totalAmount: payments
      .filter(p => p.status === 'PAGADO')
      .reduce((sum, p) => sum + Number(p.amount), 0),
    thisMonth: payments.filter(p => {
      const paymentMonth = new Date(p.createdAt).getMonth()
      const currentMonth = new Date().getMonth()
      return paymentMonth === currentMonth && p.status === 'PAGADO'
    }).reduce((sum, p) => sum + Number(p.amount), 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGADO': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Pagado', icon: CheckmarkCircle02Icon }
      case 'PENDIENTE': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Pendiente', icon: Clock01Icon }
      default: return { bg: 'rgba(116,133,151,0.1)', color: '#748597', label: status, icon: Clock01Icon }
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'TRANSFERENCIA': return { label: 'Transferencia', color: '#0f3457' }
      case 'TARJETA': return { label: 'Tarjeta', color: '#EA4227' }
      case 'EFECTIVO': return { label: 'Efectivo', color: '#10b981' }
      case 'YAPE': return { label: 'Yape', color: '#6b21a8' }
      case 'PLIN': return { label: 'Plin', color: '#0891b2' }
      default: return { label: method, color: '#748597' }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MoneyBag02Icon size={32} style={{ color: 'var(--admin-accent)' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              Pagos
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
            + Registrar Pago
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          Gestiona todos los pagos de rentas mensuales
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
            TOTAL PAGOS
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
            PAGADOS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {stats.pagado}
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
            PENDIENTES
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
            {stats.pendiente}
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
            TOTAL RECAUDADO
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
            S/ {stats.totalAmount.toLocaleString()}
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

      {/* Payments Table */}
      <div style={{
        background: 'var(--admin-card-bg)',
        borderRadius: '12px',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1fr 1fr 0.8fr 0.8fr 0.5fr',
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
          <div>Fecha</div>
          <div>Monto</div>
          <div>Método</div>
          <div>Estado</div>
          <div></div>
        </div>

        {/* Table Body */}
        {payments.map((payment) => {
          const statusBadge = getStatusBadge(payment.status)
          const methodBadge = getMethodBadge(payment.paymentMethod || 'TRANSFERENCIA')
          const StatusIcon = statusBadge.icon

          return (
            <div
              key={payment.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1fr 1fr 0.8fr 0.8fr 0.5fr',
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
                #{payment.id.slice(0, 6)}
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
                    {payment.contract.tenant.firstName[0]}{payment.contract.tenant.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--admin-text)' }}>
                      {payment.contract.tenant.firstName} {payment.contract.tenant.lastName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Propiedad */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--admin-text)', marginBottom: '2px' }}>
                  {payment.contract.property.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  {payment.contract.property.district}
                </div>
              </div>

              {/* Fecha */}
              <div style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>
                {formatDate(payment.paidDate || payment.dueDate)}
              </div>

              {/* Monto */}
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)' }}>
                S/ {Number(payment.amount).toLocaleString()}
              </div>

              {/* Método */}
              <div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  background: 'var(--admin-hover-bg)',
                  color: methodBadge.color,
                  border: `1px solid ${methodBadge.color}20`
                }}>
                  {methodBadge.label}
                </span>
              </div>

              {/* Estado */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: statusBadge.bg,
                  width: 'fit-content'
                }}>
                  <StatusIcon size={14} style={{ color: statusBadge.color }} />
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: statusBadge.color
                  }}>
                    {statusBadge.label}
                  </span>
                </div>
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
