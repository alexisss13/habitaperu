'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { LoginClientDesktop } from './login-client-desktop'
import { LoginClientMobile } from './login-client-mobile'

/**
 * Router component que detecta el tipo de dispositivo
 * y renderiza la vista apropiada de Login (Desktop o Mobile)
 */
export function LoginClient() {
  const { isMobile, isLoading } = useDeviceDetection()

  // Loading state mientras se detecta el dispositivo
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)'
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
            Cargando...
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
    return <LoginClientMobile />
  }

  // Renderizar vista desktop (por defecto)
  return <LoginClientDesktop />
}
