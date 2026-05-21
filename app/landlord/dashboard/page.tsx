import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home01Icon, Building03Icon, PlusSignCircleIcon, MoneyBag02Icon, UserIcon } from "hugeicons-react"

export default async function LandlordDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#222', marginBottom: '8px' }}>
            Panel de Arrendador
          </h1>
          <p style={{ color: '#717171', fontSize: '1rem' }}>
            Bienvenido, {session.user.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Building03Icon size={24} style={{ color: '#FF385C' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Mis Propiedades</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#222' }}>6</p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <UserIcon size={24} style={{ color: '#FF385C' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Inquilinos Activos</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#222' }}>4</p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <MoneyBag02Icon size={24} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Ingresos Mensuales</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#222' }}>S/ 7,200</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222', marginBottom: '24px' }}>
            Acciones Rápidas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Link href="/publicar" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#fff',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <PlusSignCircleIcon size={20} />
              <span>Publicar Propiedad</span>
            </Link>

            <Link href="/landlord/properties" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: '#f7f7f7', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#222',
              transition: 'all 0.2s'
            }}>
              <Building03Icon size={20} />
              <span style={{ fontWeight: '500' }}>Mis Propiedades</span>
            </Link>

            <Link href="/landlord/tenants" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: '#f7f7f7', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#222',
              transition: 'all 0.2s'
            }}>
              <UserIcon size={20} />
              <span style={{ fontWeight: '500' }}>Mis Inquilinos</span>
            </Link>

            <Link href="/" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: '#f7f7f7', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#222',
              transition: 'all 0.2s'
            }}>
              <Home01Icon size={20} />
              <span style={{ fontWeight: '500' }}>Ir al Inicio</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222', marginBottom: '24px' }}>
            Actividad Reciente
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.875rem', color: '#222', marginBottom: '4px' }}>
                <strong>Nuevo inquilino:</strong> María López alquiló tu propiedad en Miraflores
              </p>
              <p style={{ fontSize: '0.75rem', color: '#717171' }}>Hace 2 horas</p>
            </div>
            <div style={{ padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.875rem', color: '#222', marginBottom: '4px' }}>
                <strong>Pago recibido:</strong> S/ 1,800 de Carlos Ramírez
              </p>
              <p style={{ fontSize: '0.75rem', color: '#717171' }}>Hace 1 día</p>
            </div>
            <div style={{ padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.875rem', color: '#222', marginBottom: '4px' }}>
                <strong>Nueva consulta:</strong> 3 personas interesadas en tu departamento en San Isidro
              </p>
              <p style={{ fontSize: '0.75rem', color: '#717171' }}>Hace 2 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
