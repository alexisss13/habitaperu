'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

interface HomeClientMobileProps {
  properties: Property[]
  stats: PropertyStats
}

/**
 * Vista móvil de la página de inicio
 * Diseñada como una app nativa con navegación optimizada para touch
 * 
 * @param {HomeClientMobileProps} props - Propiedades del componente
 */
export function HomeClientMobile({ properties, stats }: HomeClientMobileProps) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: '80px' // Espacio para bottom navigation
    }}>
      {/* Mobile Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#0f3457',
            margin: 0
          }}>
            Habita Perú
          </h1>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid #e5e7eb',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '1.25rem' }}>👤</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{
        paddingTop: '80px',
        padding: '80px 20px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#151c26',
            marginBottom: '12px'
          }}>
            Vista Móvil
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280'
          }}>
            Diseño optimizado para móvil en desarrollo
          </p>
        </div>

        {/* Placeholder para propiedades */}
        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {properties.slice(0, 3).map((property) => (
            <div
              key={property.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#151c26',
                marginBottom: '8px'
              }}>
                {property.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {property.district} · S/ {property.price}/mes
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 100
      }}>
        {[
          { id: 'home', label: 'Inicio', icon: '🏠' },
          { id: 'search', label: 'Buscar', icon: '🔍' },
          { id: 'favorites', label: 'Favoritos', icon: '❤️' },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === tab.id ? '#0f3457' : '#9ca3af',
              fontSize: '0.75rem',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
