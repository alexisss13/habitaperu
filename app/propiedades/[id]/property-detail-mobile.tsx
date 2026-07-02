'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Location01Icon, FavouriteIcon, CheckmarkCircle02Icon,
  StarIcon, WhatsappIcon, SecurityCheckIcon, ArrowLeft01Icon,
  Calendar03Icon, MoneyBag02Icon, Cancel01Icon,
  LockPasswordIcon, Building03Icon
} from "hugeicons-react"
import type { PropertyDetail } from './property-detail-view'
import { useAuthModal } from "@/components/auth/auth-modal-provider"
import { PropertyChatWidget } from "@/components/chat/property-chat-widget"

const typeLabel = (t: string) =>
  t === 'HABITACION' ? 'Habitación' : t === 'DEPARTAMENTO' ? 'Departamento' : 'Casa'

export function PropertyDetailMobile({ property: p }: { property: PropertyDetail }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const { requireAuth } = useAuthModal()
  const params = useParams()
  const locale = (params?.locale as string) || 'es'
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFavorite(ids.includes(p.id))
    } catch {}
  }, [p.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(() => {
      try {
        const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
        const next = ids.includes(p.id) ? ids.filter(id => id !== p.id) : [...ids, p.id]
        localStorage.setItem('habitaperu_favorites', JSON.stringify(next))
        setIsFavorite(next.includes(p.id))
      } catch {}
    })
  }

  const handleGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    setImgIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const images = p.images.length > 0
    ? p.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80']

  return (
    <div className="min-h-screen bg-white pt-14 pb-28">

      {/* Contact bottom sheet */}
      {contactOpen && (
        <div className="fixed inset-0 z-[500] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setContactOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 z-10">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#151c26] text-base">Consultar propiedad</h3>
              <button
                onClick={() => setContactOpen(false)}
                className="size-8 rounded-full flex items-center justify-center bg-gray-100 border-none cursor-pointer"
              >
                <Cancel01Icon size={16} className="text-gray-500" />
              </button>
            </div>

            {!p.isAuthenticated ? (
              <div className="py-4 text-center">
                <LockPasswordIcon size={36} className="text-slate-400 mx-auto mb-3" />
                <p className="font-bold !text-[#151c26] text-sm mb-1">Inicia sesión para contactar</p>
                <p className="text-xs text-gray-400 mb-4">Necesitas una cuenta para ver el contacto del arrendador.</p>
                <Link
                  href={`/${locale}/login?callbackUrl=${encodeURIComponent(pathname)}`}
                  onClick={() => setContactOpen(false)}
                  className="block w-full py-3 !text-white rounded-xl font-bold text-sm text-center no-underline"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                >
                  Iniciar sesión
                </Link>
              </div>
            ) : p.isOwner ? (
              <div className="py-4 text-center">
                <Building03Icon size={36} className="text-slate-400 mx-auto mb-3" />
                <p className="text-xs text-gray-500">Esta es tu propiedad.</p>
              </div>
            ) : session?.user?.id ? (
              <div>
                <PropertyChatWidget propertyId={p.id} currentUserId={session.user.id} compact />
                {p.owner.phone && p.ownerPhoneVisible && (
                  <a
                    href={`https://wa.me/51${p.owner.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${p.owner.firstName}, vi tu anuncio "${p.title}" en Habita Perú. ¿Sigue disponible?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400 no-underline"
                  >
                    <WhatsappIcon size={13} />
                    ¿Prefieres WhatsApp? Escríbele directo
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
        <div
          onScroll={handleGalleryScroll}
          className="flex h-full overflow-x-auto scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' as never }}
        >
          {images.map((img, i) => (
            <div key={i} className="flex-none w-full h-full" style={{ scrollSnapAlign: 'start' }}>
              <img
                src={img}
                alt={`${p.title} - foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Back button */}
        <Link
          href="/propiedades"
          className="absolute top-3 left-3 size-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm no-underline"
        >
          <ArrowLeft01Icon size={18} className="text-[#151c26]" />
        </Link>

        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 size-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm border-none cursor-pointer"
        >
          <FavouriteIcon
            size={18}
            className={isFavorite ? "text-red-500" : "text-gray-500"}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {imgIndex + 1}/{images.length}
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/90 text-[#151c26] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {typeLabel(p.type)}
          </span>
          {p.status === "DISPONIBLE" && (
            <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Disponible
            </span>
          )}
          {p.status === "OCUPADA" && (
            <span className="bg-indigo-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Ocupada
            </span>
          )}
          {p.status === "MANTENIMIENTO" && (
            <span className="bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Mantenimiento
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/propiedades" className="hover:text-accent no-underline text-gray-400">
            Propiedades
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate">{p.district}</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-extrabold text-[#151c26] leading-snug mb-2">{p.title}</h1>

        {/* Location + rating */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Location01Icon size={12} />
            <span>{p.district}</span>
          </div>
          {p.avgRating > 0 ? (
            <div className="flex items-center gap-1 text-xs">
              <StarIcon size={11} className="text-yellow-400" />
              <span className="font-bold text-[#151c26]">{p.avgRating.toFixed(1)}</span>
              <span className="text-gray-400">
                ({p.reviews.length} {p.reviews.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full">
              Nueva publicación
            </span>
          )}
        </div>

        {/* Price + stats card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-extrabold text-accent leading-none">
              S/ {p.price.toLocaleString('es-PE')}
              <span className="text-sm font-normal text-gray-400"> /mes</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
              <span>{p.rooms} hab.</span>
              <span>·</span>
              <span>{p.bathrooms} baños</span>
              {p.area && <><span>·</span><span>{p.area} m²</span></>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-gray-500 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Calendar03Icon size={12} className="text-accent" />
              <span>Mín. {p.minDuration} {p.minDuration === 1 ? 'mes' : 'meses'}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <MoneyBag02Icon size={12} className="text-accent" />
              <span>Dep. {p.deposit} {p.deposit === 1 ? 'mes' : 'meses'}</span>
            </div>
          </div>
        </div>

        {/* Verified */}
        <div className="flex items-center gap-2 bg-green/10 rounded-xl px-4 py-2.5 mb-5">
          <SecurityCheckIcon size={15} className="text-green shrink-0" />
          <span className="text-xs font-semibold text-green">
            Propiedad verificada por Habita Perú
          </span>
        </div>

        {/* Description */}
        <section className="mb-5 pb-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#151c26] mb-2.5">Descripción</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{p.description}</p>
        </section>

        {/* Amenities */}
        {p.amenities.length > 0 && (
          <section className="mb-5 pb-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#151c26] mb-3">Lo que incluye</h2>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
              {p.amenities.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckmarkCircle02Icon size={14} className="text-green shrink-0 mt-0.5" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Owner */}
        <section className="mb-5 pb-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#151c26] mb-3">Arrendador</h2>
          <div className="flex items-center gap-3">
            <div
              className="size-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
            >
              {p.owner.firstName?.[0] ?? '?'}
            </div>
            <div>
              <p className="font-bold text-[#151c26] text-sm">
                {p.owner.firstName} {p.owner.lastName}
              </p>
              {p.owner.verified && (
                <div className="flex items-center gap-1 text-xs text-green mt-0.5">
                  <SecurityCheckIcon size={12} />
                  <span>Identidad verificada</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews */}
        {p.reviews.length > 0 && (
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-bold text-[#151c26]">Reseñas</h2>
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {p.reviews.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {p.reviews.slice(0, 3).map(r => (
                <div key={r.id} className="bg-gray-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                    >
                      {r.author.firstName?.[0] ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#151c26]">{r.author.firstName}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <StarIcon key={i} size={10} className="text-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - r.rating }).map((_, i) => (
                          <StarIcon key={`e${i}`} size={10} className="text-gray-200" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400">Precio mensual</p>
          <p className="text-lg font-extrabold text-[#151c26] leading-tight">
            S/ {p.price.toLocaleString('es-PE')}
            <span className="text-xs font-normal text-gray-400"> /mes</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {p.status !== "DISPONIBLE" ? (
            <span className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs whitespace-nowrap">
              No disponible
            </span>
          ) : p.isOwner ? (
            <span className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs whitespace-nowrap">
              Tu propiedad
            </span>
          ) : !p.isAuthenticated ? (
            <Link
              href={`/${locale}/login?callbackUrl=${encodeURIComponent(pathname)}`}
              className="px-4 py-2.5 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 no-underline whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
            >
              <LockPasswordIcon size={14} />
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={() => setContactOpen(true)}
              className="px-4 py-2.5 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border-none cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
            >
              <SecurityCheckIcon size={14} />
              Consultar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
