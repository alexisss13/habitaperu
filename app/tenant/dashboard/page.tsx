import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home01Icon, Search01Icon, FavouriteIcon, FileValidationIcon, CreditCardIcon } from "hugeicons-react"

export default async function TenantDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "TENANT") {
    redirect("/login")
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#222', marginBottom: '8px' }}>
            Mi Panel
          </h1>
          <p style={{ color: '#717171', fontSize: '1rem' }}>
            Bienvenido, {session.user.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Home01Icon size={24} style={{ color: '#FF385C' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Propiedad Actual</h3>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222' }}>Depa en Miraflores</p>
            <p style={{ fontSize: '0.875rem', color: '#717171' }}>S/ 1,800/mes</p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FavouriteIcon size={24} style={{ color: '#FF385C' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Favoritos</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#222' }}>8</p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <CreditCardIcon size={24} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#717171' }}>Próximo Pago</h3>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222' }}>15 de Junio</p>
            <p style={{ fontSize: '0.875rem', color: '#717171' }}>S/ 1,800</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222', marginBottom: '24px' }}>
            Acciones Rápidas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Link href="/propiedades" style={{ 
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
              <Search01Icon size={20} />
              <span>Buscar Propiedades</span>
            </Link>

            <Link href="/tenant/favorites" style={{ 
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
              <FavouriteIcon size={20} />
              <span style={{ fontWeight: '500' }}>Mis Favoritos</span>
            </Link>

            <Link href="/tenant/contract" style={{ 
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
              <FileValidationIcon size={20} />
              <span style={{ fontWeight: '500' }}>Mi Contrato</span>
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

        {/* Payment History */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#222', marginBottom: '24px' }}>
            Historial de Pagos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                  Mayo 2026
                </p>
                <p style={{ fontSize: '0.75rem', color: '#717171' }}>Pagado el 15/05/2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>S/ 1,800</p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  Pagado
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                  Abril 2026
                </p>
                <p style={{ fontSize: '0.75rem', color: '#717171' }}>Pagado el 15/04/2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>S/ 1,800</p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  Pagado
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f7f7f7', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                  Marzo 2026
                </p>
                <p style={{ fontSize: '0.75rem', color: '#717171' }}>Pagado el 15/03/2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>S/ 1,800</p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  Pagado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
