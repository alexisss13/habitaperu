'use client'

import Link from "next/link"
import {
  Location01Icon, FavouriteIcon, CheckmarkCircle02Icon,
  StarIcon, WhatsappIcon, SecurityCheckIcon,
  Calendar03Icon, MoneyBag02Icon, Clock05Icon, MessageMultiple02Icon
} from "hugeicons-react"
import type { PropertyDetail } from './property-detail-view'

const typeLabel = (t: string) => t === 'HABITACION' ? 'Habitación' : t === 'DEPARTAMENTO' ? 'Departamento' : 'Casa'

export function PropertyDetailMobile({ property: p }: { property: PropertyDetail }) {
  const avgRating = p.avgRating

  return (
    <div className="min-h-screen bg-white pt-[64px] pb-24">
      {/* Hero image */}
      <div className="relative w-full h-[250px] bg-gray-100">
        <img
          src={p.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
          alt={p.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="size-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <FavouriteIcon size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Link href="/propiedades" className="hover:text-accent-secondary">Propiedades</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{p.district}</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">{p.title}</h1>

        <div className="flex items-center gap-3 text-sm mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <StarIcon size={14} />
            <span className="font-semibold">{avgRating > 0 ? avgRating.toFixed(1) : 'Nuevo'}</span>
            {p.reviews.length > 0 && <span className="text-gray-500">({p.reviews.length})</span>}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Location01Icon size={14} />
            <span>{p.district}, Lima</span>
          </div>
        </div>

        {/* Price + quick info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-semibold text-gray-900">S/ {p.price.toLocaleString('es-PE')}</span>
            <span className="text-gray-500 text-sm">/ mes</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{p.rooms} hab.</span>
            <span>·</span>
            <span>{p.bathrooms} baños</span>
            {p.area && <><span>·</span><span>{p.area}m²</span></>}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-200">
          {[
            { Icon: Calendar03Icon, text: `Mínimo ${p.minDuration} ${p.minDuration === 1 ? 'mes' : 'meses'}` },
            { Icon: MoneyBag02Icon, text: `Depósito: ${p.deposit} ${p.deposit === 1 ? 'mes' : 'meses'}` },
            { Icon: SecurityCheckIcon, text: 'Propiedad verificada', green: true },
          ].map(({ Icon, text, green }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon size={20} className={green ? 'text-green' : 'text-gray-500'} />
              <span className={`text-sm ${green ? 'text-green font-medium' : 'text-gray-600'}`}>{text}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-5 pb-5 border-b border-gray-200">
          <h2 className="text-base font-semibold mb-3">Descripción</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{p.description}</p>
        </div>

        {/* Amenities */}
        {p.amenities.length > 0 && (
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h2 className="text-base font-semibold mb-3">Comodidades</h2>
            <div className="grid grid-cols-2 gap-2">
              {p.amenities.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckmarkCircle02Icon size={16} className="text-green shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner */}
        <div className="mb-5 pb-5 border-b border-gray-200">
          <h2 className="text-base font-semibold mb-3">Arrendador</h2>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' }}>
              {p.owner.firstName[0]}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{p.owner.firstName} {p.owner.lastName}</div>
              {p.owner.verified && (
                <div className="flex items-center gap-1 text-xs text-green">
                  <SecurityCheckIcon size={14} />
                  <span>Verificado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {p.reviews.length > 0 && (
          <div>
            <h2 className="text-base font-semibold mb-3">
              Reseñas ({p.reviews.length})
            </h2>
            <div className="flex flex-col gap-4">
              {p.reviews.slice(0, 3).map(r => (
                <div key={r.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
                      {r.author.firstName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.author.firstName}</div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => <StarIcon key={i} size={10} />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
        <button className="flex-1 py-3 text-white rounded-xl font-medium flex items-center justify-center gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
          <MessageMultiple02Icon size={18} /> Consultar
        </button>
        <button className="flex-1 py-3 bg-green text-white rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
          <WhatsappIcon size={18} /> WhatsApp
        </button>
      </div>
    </div>
  )
}
