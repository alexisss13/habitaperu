import { prisma } from "@/lib/db"
import { UserMultiple02Icon, Building03Icon, FileValidationIcon, MoneyBag02Icon, ArrowUp01Icon, ArrowDown01Icon } from "hugeicons-react"
import AdminUserCard from "@/components/admin-user-card"
import AdminPropertyCard from "@/components/admin-property-card"

export default async function AdminDashboard() {
  // Obtener datos reales de la base de datos
  const [
    totalUsers,
    totalProperties,
    activeContracts,
    totalPayments,
    recentUsers,
    recentProperties,
    usersByRole,
    propertiesByStatus
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.contract.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        verified: true
      }
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        district: true,
        price: true,
        status: true,
        createdAt: true,
        owner: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true
    }),
    prisma.property.groupBy({
      by: ['status'],
      _count: true
    })
  ])

  const totalRevenue = totalPayments._sum.amount || 0

  // Calcular estadísticas
  const tenants = usersByRole.find(u => u.role === 'TENANT')?._count || 0
  const landlords = usersByRole.find(u => u.role === 'LANDLORD')?._count || 0
  const disponibles = propertiesByStatus.find(p => p.status === 'DISPONIBLE')?._count || 0
  const ocupadas = propertiesByStatus.find(p => p.status === 'OCUPADA')?._count || 0

  return (
    <div style={{ 
      padding: '40px',
      minHeight: '100vh'
    }}>
      {/* Header Simple y Limpio */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: 'var(--admin-text)',
          marginBottom: '8px'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--admin-text-muted)'
        }}>
          Bienvenido de vuelta, aquí está el resumen de tu plataforma
        </p>
      </div>

      {/* Stats Grid - Diseño Limpio */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        {/* Card 1 */}
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(15,52,87,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserMultiple02Icon size={24} style={{ color: '#0f3457' }} />
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(143,130,114,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUp01Icon size={14} style={{ color: '#8f8272' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#8f8272' }}>12%</span>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '4px' }}>
            {totalUsers}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
            Total Usuarios
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {tenants} inquilinos • {landlords} arrendadores
          </div>
        </div>

        {/* Card 2 */}
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(234,66,39,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building03Icon size={24} style={{ color: '#EA4227' }} />
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(143,130,114,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUp01Icon size={14} style={{ color: '#8f8272' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#8f8272' }}>8%</span>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '4px' }}>
            {totalProperties}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
            Propiedades
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {disponibles} disponibles • {ocupadas} ocupadas
          </div>
        </div>

        {/* Card 3 */}
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(116,133,151,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileValidationIcon size={24} style={{ color: '#748597' }} />
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowDown01Icon size={14} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ef4444' }}>3%</span>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '4px' }}>
            {activeContracts}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
            Contratos Activos
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            Renovaciones este mes
          </div>
        </div>

        {/* Card 4 */}
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(143,130,114,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MoneyBag02Icon size={24} style={{ color: '#8f8272' }} />
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(143,130,114,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUp01Icon size={14} style={{ color: '#8f8272' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#8f8272' }}>15%</span>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '4px' }}>
            S/ {totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
            Ingresos Totales
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            Desde el inicio
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Usuarios Recientes */}
        <div style={{ 
          background: 'var(--admin-card-bg)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--admin-border)'
          }}>
            <h2 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: 'var(--admin-text)'
            }}>
              Usuarios Recientes
            </h2>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--admin-text-muted)',
              fontWeight: '500'
            }}>
              Últimos 5
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentUsers.map((user, index) => (
              <AdminUserCard key={user.id} user={user} index={index} />
            ))}
          </div>
        </div>

        {/* Propiedades Recientes */}
        <div style={{ 
          background: 'var(--admin-card-bg)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--admin-border)'
          }}>
            <h2 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: 'var(--admin-text)'
            }}>
              Propiedades Recientes
            </h2>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--admin-text-muted)',
              fontWeight: '500'
            }}>
              Últimas 5
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentProperties.map((property, index) => (
              <AdminPropertyCard 
                key={property.id} 
                property={{
                  ...property,
                  price: Number(property.price)
                }} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
            Tasa de Ocupación
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              {totalProperties > 0 ? Math.round((ocupadas / totalProperties) * 100) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8f8272', fontWeight: '600' }}>
              +5% vs mes anterior
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
            Ingreso Promedio
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              S/ {totalProperties > 0 ? Math.round(Number(totalRevenue) / totalProperties).toLocaleString() : 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>
              por propiedad
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--admin-card-bg)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
            Nuevos Este Mes
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>
              {recentUsers.length + recentProperties.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8f8272', fontWeight: '600' }}>
              +{recentUsers.length} usuarios, +{recentProperties.length} propiedades
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
