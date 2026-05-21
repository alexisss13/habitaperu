"use client"

interface AdminPropertyCardProps {
  property: {
    id: string
    title: string
    district: string
    price: number
    status: string
    owner: {
      firstName: string
      lastName: string
    }
  }
  index: number
}

export default function AdminPropertyCard({ property, index }: AdminPropertyCardProps) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #f3f4f6',
        transition: 'all 0.2s',
        cursor: 'pointer',
        background: '#fff'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f9fafb'
        e.currentTarget.style.borderColor = '#e5e7eb'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff'
        e.currentTarget.style.borderColor = '#f3f4f6'
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#151c26',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {property.title}
        </p>
        <p style={{ 
          fontSize: '0.75rem', 
          color: '#748597',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {property.district} • {property.owner.firstName} {property.owner.lastName}
        </p>
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        alignItems: 'flex-end',
        flexShrink: 0,
        marginLeft: '12px'
      }}>
        <p style={{ 
          fontSize: '0.875rem', 
          fontWeight: '700', 
          color: '#151c26'
        }}>
          S/ {property.price.toLocaleString()}
        </p>
        <span style={{
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          background: property.status === 'DISPONIBLE' ? 'rgba(143,130,114,0.1)' :
                      property.status === 'OCUPADA' ? 'rgba(234,66,39,0.1)' :
                      'rgba(239,68,68,0.1)',
          color: property.status === 'DISPONIBLE' ? '#8f8272' :
                 property.status === 'OCUPADA' ? '#EA4227' :
                 '#ef4444'
        }}>
          {property.status}
        </span>
      </div>
    </div>
  )
}
