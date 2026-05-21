'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { RegisterClientDesktop } from './register-client-desktop'
import { RegisterClientMobile } from './register-client-mobile'

export function RegisterClient() {
  const { isMobile, isLoading } = useDeviceDetection()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
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
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>H</span>
          </div>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>Cargando...</p>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}</style>
      </div>
    )
  }

  if (isMobile) {
    return <RegisterClientMobile />
  }

  return <RegisterClientDesktop />
}
