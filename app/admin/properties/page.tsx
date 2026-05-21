import { prisma } from "@/lib/db"
import { Building03Icon, Search01Icon, FilterIcon, Location01Icon, BedIcon, Bathtub02Icon } from "hugeicons-react"
import Image from "next/image"

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  })

  const stats = {
    total: properties.length,
    disponible: properties.filter(p => p.status === 'DISPONIBLE').length,
    ocupada: properties.filter(p => p.status === 'OCUPADA').length,
    mantenimiento: properties.filter(p => p.status === 'MANTENIMIENTO').length,
    avgPrice: properties.length > 0 
      ? Math.round(properties.reduce((sum, p) => sum + Number(p.price), 0) / properties.length)
      : 0
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Disponible' }
      case 'OCUPADA': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Ocupada' }
      case 'MANTENIMIENTO': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Mantenimiento' }
      default: return { bg: 'rgba(116,133,151,0.1)', color: '#748597', label: status }
    }
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building03Icon size={32} style={{ color: 'var(--admin-accent)' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              Propiedades
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
            + Nueva Propiedad
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
          Gestiona todas las propiedades publicadas en la plataforma
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
            DISPONIBLES
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {stats.disponible}
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
            OCUPADAS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
            {stats.ocupada}
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
            MANTENIMIENTO
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
            {stats.mantenimiento}
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
            PRECIO PROMEDIO
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
            S/ {stats.avgPrice}
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
            placeholder="Buscar por título, distrito..."
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

      {/* Properties Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {properties.map((property) => {
          const statusBadge = getStatusBadge(property.status)
          return (
            <div
              key={property.id}
              style={{
                background: 'var(--admin-card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--admin-border)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--admin-shadow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: '200px', background: '#e5e7eb' }}>
                {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
                  <Image
                    src={property.images[0] as string}
                    alt={property.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af'
                  }}>
                    <Building03Icon size={48} />
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: statusBadge.bg,
                  color: statusBadge.color,
                  backdropFilter: 'blur(8px)'
                }}>
                  {statusBadge.label}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--admin-text)',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {property.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  <Location01Icon size={14} style={{ color: 'var(--admin-text-muted)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                    {property.district}, Lima
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--admin-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BedIcon size={16} style={{ color: 'var(--admin-text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>
                      {property.rooms}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bathtub02Icon size={16} style={{ color: 'var(--admin-text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>
                      {property.bathrooms}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-text)' }}>
                    {property.area}m²
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginBottom: '2px' }}>
                      Precio mensual
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--admin-text)' }}>
                      S/ {Number(property.price).toLocaleString()}
                    </div>
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    background: 'var(--admin-hover-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: 'var(--admin-text)',
                    cursor: 'pointer'
                  }}>
                    Ver detalles
                  </button>
                </div>

                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--admin-border)',
                  fontSize: '0.75rem',
                  color: 'var(--admin-text-muted)'
                }}>
                  Propietario: <span style={{ color: 'var(--admin-text)', fontWeight: '500' }}>
                    {property.owner.firstName} {property.owner.lastName}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
