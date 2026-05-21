'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { HomeClientDesktop } from './home-client-desktop'
import { HomeClientMobile } from './home-client-mobile'

interface Property {
  id: string
  title: string
  type: string
  condition: string
  district: string
  price: number
  images: string[]
  favorites: number
  rooms: number
  bathrooms: number
  area: number
  _count: {
    reviews: number
  }
}

interface PropertyStats {
  minPrice: number
  availableCount: number
}

interface HomeClientProps {
  properties: Property[]
  stats: PropertyStats
}

/**
 * Router component que detecta el tipo de dispositivo
 * y renderiza la vista apropiada (Desktop o Mobile)
 * 
 * Implementa detección multi-factor para mayor precisión:
 * - User Agent
 * - Ancho de pantalla
 * - Capacidad táctil
 * 
 * @param {HomeClientProps} props - Propiedades del componente
 */
export function HomeClient({ properties, stats }: HomeClientProps) {
  const { isMobile, isLoading } = useDeviceDetection()

  // Loading state mientras se detecta el dispositivo
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          {/* Logo animado */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#fff'
            }}>
              H
            </span>
          </div>
          
          {/* Loading text */}
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Cargando Habita Perú...
          </p>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.9;
            }
          }
        `}</style>
      </div>
    )
  }

  // Renderizar vista móvil
  if (isMobile) {
    return <HomeClientMobile properties={properties} stats={stats} />
  }

  // Renderizar vista desktop (por defecto)
  return <HomeClientDesktop properties={properties} stats={stats} />
}
