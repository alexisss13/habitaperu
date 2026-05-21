"use client"

interface AdminUserCardProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
  index: number
}

export default function AdminUserCard({ user, index }: AdminUserCardProps) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #EA4227, #d63820)' :
                      user.role === 'LANDLORD' ? 'linear-gradient(135deg, #0f3457, #0a2540)' :
                      'linear-gradient(135deg, #8f8272, #7a7260)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '600',
          fontSize: '0.875rem',
          flexShrink: 0
        }}>
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            color: '#151c26',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user.firstName} {user.lastName}
          </p>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#748597',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user.email}
          </p>
        </div>
      </div>
      <span style={{
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: user.role === 'ADMIN' ? 'rgba(234,66,39,0.1)' :
                    user.role === 'LANDLORD' ? 'rgba(15,52,87,0.1)' :
                    'rgba(143,130,114,0.1)',
        color: user.role === 'ADMIN' ? '#EA4227' :
               user.role === 'LANDLORD' ? '#0f3457' :
               '#8f8272',
        flexShrink: 0
      }}>
        {user.role === 'ADMIN' ? 'Admin' : user.role === 'LANDLORD' ? 'Arrendador' : 'Inquilino'}
      </span>
    </div>
  )
}
