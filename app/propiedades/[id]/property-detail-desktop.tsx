'use client'

import Link from "next/link"
import {
  Location01Icon, FavouriteIcon, Home01Icon, CheckmarkCircle02Icon,
  StarIcon, WhatsappIcon, SecurityCheckIcon, ArrowRight01Icon,
  Share08Icon, Maximize01Icon, Calendar03Icon, MoneyBag02Icon,
  Clock05Icon, MessageMultiple02Icon
} from "hugeicons-react"
import type { PropertyDetail } from './property-detail-view'

const typeLabel = (t: string) => t === 'HABITACION' ? 'Habitación' : t === 'DEPARTAMENTO' ? 'Departamento' : 'Casa'

export function PropertyDetailDesktop({ property: p }: { property: PropertyDetail }) {
  const avgRating = p.avgRating

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent-secondary">Inicio</Link>
          <ArrowRight01Icon size={14} />
          <Link href="/propiedades" className="hover:text-accent-secondary">Propiedades</Link>
          <ArrowRight01Icon size={14} />
          <span className="text-gray-900 font-medium truncate max-w-xs">{p.title}</span>
        </nav>

        {/* Title + Actions */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2 leading-tight">{p.title}</h1>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <StarIcon size={16} />
                <span className="font-semibold">{avgRating > 0 ? avgRating.toFixed(1) : 'Nuevo'}</span>
                {p.reviews.length > 0 && <span className="text-gray-500">({p.reviews.length} reseñas)</span>}
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1 text-gray-500">
                <Location01Icon size={16} />
                <span className="underline cursor-pointer">{p.district}, Lima</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <Share08Icon size={16} /> Compartir
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <FavouriteIcon size={16} /> Guardar
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-12 rounded-xl overflow-hidden h-[400px] relative">
          <div className="col-span-2 row-span-2">
            <img
              src={p.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          </div>
          {p.images.slice(1, 5).map((img, i) => (
            <div key={i} className="overflow-hidden">
              <img src={img} alt={`Foto ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <button className="absolute bottom-4 right-4 bg-white px-4 py-2.5 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-shadow">
            <Maximize01Icon size={16} /> Mostrar todas las fotos
          </button>
        </div>

        {/* Content + Sidebar */}
        <div className="grid grid-cols-[2fr_1fr] gap-12">
          {/* Main */}
          <div>
            {/* Host */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {typeLabel(p.type)} alquilada por {p.owner.firstName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <span>{p.rooms} {p.rooms === 1 ? 'habitación' : 'habitaciones'}</span>
                    <span>·</span>
                    <span>{p.bathrooms} {p.bathrooms === 1 ? 'baño' : 'baños'}</span>
                    {p.area && <><span>·</span><span>{p.area}m²</span></>}
                  </div>
                </div>
                <div className="size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' }}>
                  {p.owner.firstName[0]}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="py-8 border-b border-gray-200 flex flex-col gap-6">
              {[
                { Icon: Home01Icon, title: 'Propiedad completa', desc: 'Tendrás acceso a toda la propiedad para ti.' },
                { Icon: SecurityCheckIcon, title: 'Propiedad verificada', desc: 'Esta propiedad ha sido verificada por Habita Perú.' },
                { Icon: Calendar03Icon, title: 'Alquiler mensual', desc: `Contrato mínimo de ${p.minDuration} ${p.minDuration === 1 ? 'mes' : 'meses'}.` },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon size={24} className="text-gray-700 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Acerca de este lugar</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>

            {/* Amenities */}
            {p.amenities.length > 0 && (
              <div className="py-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Lo que ofrece este lugar</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                  {p.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckmarkCircle02Icon size={24} className="text-green shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {p.reviews.length > 0 && (
              <div className="pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <StarIcon size={24} />
                  <h2 className="text-xl font-semibold">
                    {avgRating.toFixed(1)} · {p.reviews.length} {p.reviews.length === 1 ? 'reseña' : 'reseñas'}
                  </h2>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                  {p.reviews.map(r => (
                    <div key={r.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
                          {r.author.firstName[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{r.author.firstName} {r.author.lastName}</div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => <StarIcon key={i} size={12} />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sticky top-24 h-fit">
            <div className="border border-gray-200 rounded-xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-semibold">S/ {p.price.toLocaleString('es-PE')}</span>
                  <span className="text-gray-500">/ mes</span>
                </div>
                {p.reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <StarIcon size={14} />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500">({p.reviews.length} reseñas)</span>
                  </div>
                )}
              </div>

              <form className="flex flex-col gap-4 mb-4">
                {[
                  { label: 'Tu nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez' },
                  { label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+51 999 999 999' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (opcional)</label>
                  <textarea rows={3} placeholder="Hola, me interesa la propiedad..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-accent-secondary resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-3 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
                  <MessageMultiple02Icon size={20} /> Enviar consulta
                </button>
                <button type="button"
                  className="w-full py-3 bg-green text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  <WhatsappIcon size={20} /> Contactar por WhatsApp
                </button>
              </form>

              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MoneyBag02Icon size={18} />
                  <span>Depósito: {p.deposit} {p.deposit === 1 ? 'mes' : 'meses'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock05Icon size={18} />
                  <span>Mínimo {p.minDuration} {p.minDuration === 1 ? 'mes' : 'meses'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green font-medium">
                  <SecurityCheckIcon size={18} />
                  <span>Propiedad verificada</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' }}>
                    {p.owner.firstName[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{p.owner.firstName} {p.owner.lastName}</div>
                    <div className="text-sm text-gray-500">Arrendador</div>
                  </div>
                </div>
                {p.owner.verified && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SecurityCheckIcon size={16} className="text-green" />
                    <span>Identidad verificada</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
