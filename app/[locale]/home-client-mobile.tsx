'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Property {
  id: string; title: string; type: string; condition: string; district: string
  price: number; images: string[]; favorites: number; rooms: number
  bathrooms: number; area: number; _count: { reviews: number }
}

interface PropertyStats { minPrice: number; availableCount: number }

interface HomeClientMobileProps { properties: Property[]; stats: PropertyStats }

export function HomeClientMobile({ properties, stats }: HomeClientMobileProps) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-accent m-0">Habita Perú</h1>
          <button className="size-10 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer">
            <span className="text-xl">👤</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 px-5 pb-5">
        <div className="text-center mb-8">
          <h2 className="text-[1.75rem] font-extrabold text-[#151c26] mb-3">Vista Móvil</h2>
          <p className="text-base text-gray-500">Diseño optimizado para móvil en desarrollo</p>
        </div>

        <div className="flex flex-col gap-4">
          {properties.slice(0, 3).map((property) => (
            <Link key={property.id} href={`/propiedades/${property.id}`}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] no-underline block"
            >
              <h3 className="text-base font-semibold text-[#151c26] mb-2">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.district} · S/ {property.price}/mes</p>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around py-3 z-[100]">
        {[
          { id: 'home', label: 'Inicio', icon: '🏠' },
          { id: 'search', label: 'Buscar', icon: '🔍' },
          { id: 'favorites', label: 'Favoritos', icon: '❤️' },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer text-xs
              ${activeTab === tab.id ? 'text-accent font-semibold' : 'text-gray-400 font-normal'}`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
