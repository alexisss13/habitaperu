'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Location01Icon, FavouriteIcon, Home01Icon, CheckmarkCircle02Icon,
  StarIcon, WhatsappIcon, SecurityCheckIcon, ArrowRight01Icon,
  Share08Icon, Maximize01Icon, Calendar03Icon, MoneyBag02Icon,
  Clock05Icon, MessageMultiple02Icon, Cancel01Icon, Building03Icon,
  ArrowLeft01Icon, LockPasswordIcon, UserCheck01Icon
} from "hugeicons-react"
import type { PropertyDetail } from './property-detail-view'

const typeLabel = (t: string) =>
  t === 'HABITACION' ? 'Habitación' : t === 'DEPARTAMENTO' ? 'Departamento' : 'Casa'

function GallerySlot({ src, alt }: { src?: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <Building03Icon size={32} className="text-gray-300" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setErr(true)}
    />
  )
}

export function PropertyDetailDesktop({ property: p }: { property: PropertyDetail }) {
  // Favorite state — initialized via useEffect to avoid SSR mismatch
  const [isFavorite, setIsFavorite] = useState(false)
  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      setIsFavorite(ids.includes(p.id))
    } catch {}
  }, [p.id])

  const toggleFavorite = () => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      const next = ids.includes(p.id) ? ids.filter(id => id !== p.id) : [...ids, p.id]
      localStorage.setItem('habitaperu_favorites', JSON.stringify(next))
      setIsFavorite(next.includes(p.id))
    } catch {}
  }

  // Share
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: p.title, url }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      } catch {}
    }
  }
  const [shareCopied, setShareCopied] = useState(false)

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const images = p.images.length > 0 ? p.images : []

  const openLightbox = (i: number) => { setLightboxIndex(i); setLightboxOpen(true) }
  const closeLightbox = () => setLightboxOpen(false)
  const prevImg = () => setLightboxIndex(i => (i - 1 + images.length) % images.length)
  const nextImg = () => setLightboxIndex(i => (i + 1) % images.length)

  // Contact form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<'idle' | 'sent'>('idle')

  const handleConsult = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const text = [
      `Hola ${p.owner.firstName}, vi tu anuncio "${p.title}" en Habita Perú.`,
      name ? `Mi nombre es ${name.trim()}.` : '',
      phone ? `Mi teléfono es ${phone.trim()}.` : '',
      message.trim() || 'Me gustaría obtener más información.',
    ].filter(Boolean).join(' ')
    const ownerPhone = p.owner.phone
      ? `51${p.owner.phone.replace(/\D/g, '')}`
      : null
    if (ownerPhone) {
      window.open(`https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`, '_blank')
    }
    setFormState('sent')
  }

  const avgRating = p.avgRating

  return (
    <div className="min-h-screen bg-white pt-[112px]">

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 size-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-colors"
          >
            <Cancel01Icon size={20} />
          </button>
          <button
            onClick={prevImg}
            className="absolute left-5 size-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-colors"
          >
            <ArrowLeft01Icon size={22} />
          </button>
          <div className="max-w-5xl max-h-[85vh] mx-16 flex items-center justify-center">
            <img
              src={images[lightboxIndex]}
              alt={`${p.title} — foto ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
          <button
            onClick={nextImg}
            className="absolute right-5 size-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-colors"
          >
            <ArrowRight01Icon size={22} />
          </button>
          <div className="absolute bottom-5 text-white/60 text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent transition-colors no-underline text-gray-400">
            Inicio
          </Link>
          <ArrowRight01Icon size={12} className="text-gray-300" />
          <Link href="/propiedades" className="hover:text-accent transition-colors no-underline text-gray-400">
            Propiedades
          </Link>
          <ArrowRight01Icon size={12} className="text-gray-300" />
          <span className="text-[#151c26] font-medium truncate max-w-xs">{p.title}</span>
        </nav>

        {/* Title + Actions */}
        <div className="flex items-start justify-between mb-6 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-accent bg-accent/8 px-2.5 py-1 rounded-full">
                {typeLabel(p.type)}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#151c26] mb-3 leading-tight">{p.title}</h1>
            <div className="flex items-center gap-3 text-sm flex-wrap">
              {avgRating > 0 ? (
                <div className="flex items-center gap-1">
                  <StarIcon size={15} className="text-yellow-400" />
                  <span className="font-bold text-[#151c26]">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-400">
                    ({p.reviews.length} {p.reviews.length === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full">
                  Nueva publicación
                </span>
              )}
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-1 text-gray-500">
                <Location01Icon size={14} />
                <span className="font-medium">{p.district}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            >
              <Share08Icon size={16} />
              {shareCopied ? '¡Enlace copiado!' : 'Compartir'}
            </button>
            <button
              onClick={toggleFavorite}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border-none bg-transparent cursor-pointer"
              style={{ color: isFavorite ? '#ef4444' : '#374151' }}
            >
              <FavouriteIcon size={16} />
              {isFavorite ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-12 rounded-2xl overflow-hidden h-[440px] relative">
          <div
            className="col-span-2 row-span-2 overflow-hidden cursor-pointer"
            onClick={() => images.length > 0 && openLightbox(0)}
          >
            <GallerySlot src={images[0]} alt={p.title} />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="overflow-hidden cursor-pointer"
              onClick={() => images[i] && openLightbox(i)}
            >
              <GallerySlot src={images[i]} alt={`${p.title} — foto ${i + 1}`} />
            </div>
          ))}
          {images.length > 0 && (
            <button
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 bg-white text-[#151c26] px-4 py-2 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] text-sm font-semibold flex items-center gap-2 hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-shadow border-none cursor-pointer"
            >
              <Maximize01Icon size={15} />
              Ver todas las fotos
            </button>
          )}
        </div>

        {/* Content + Sidebar */}
        <div className="grid grid-cols-[1fr_380px] gap-14">

          {/* ── MAIN ── */}
          <div>
            {/* Host row */}
            <div className="pb-8 border-b border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#151c26] mb-1">
                    {typeLabel(p.type)} alquilada por {p.owner.firstName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <span>{p.rooms} {p.rooms === 1 ? 'habitación' : 'habitaciones'}</span>
                    <span className="text-gray-300">·</span>
                    <span>{p.bathrooms} {p.bathrooms === 1 ? 'baño' : 'baños'}</span>
                    {p.area && <><span className="text-gray-300">·</span><span>{p.area} m²</span></>}
                  </div>
                </div>
                <div
                  className="size-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                >
                  {p.owner.firstName[0]}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="py-8 border-b border-gray-100 flex flex-col gap-5">
              {[
                {
                  Icon: Home01Icon,
                  title: 'Propiedad completa',
                  desc: 'Tendrás acceso exclusivo a toda la propiedad.',
                },
                {
                  Icon: SecurityCheckIcon,
                  title: 'Propiedad verificada',
                  desc: 'Verificada y aprobada por el equipo de Habita Perú.',
                },
                {
                  Icon: Calendar03Icon,
                  title: 'Alquiler mensual',
                  desc: `Contrato mínimo de ${p.minDuration} ${p.minDuration === 1 ? 'mes' : 'meses'}.`,
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-accent/8 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-bold text-[#151c26] text-sm mb-0.5">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#151c26] mb-4">Acerca de este lugar</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>

            {/* Amenities */}
            {p.amenities.length > 0 && (
              <div className="py-8 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#151c26] mb-5">Lo que ofrece este lugar</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                  {p.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#151c26]">
                      <CheckmarkCircle02Icon size={20} className="text-green shrink-0" />
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
                  <StarIcon size={22} className="text-yellow-400" />
                  <h2 className="text-xl font-bold text-[#151c26]">
                    {avgRating.toFixed(1)}
                    <span className="text-gray-400 font-normal text-base ml-1.5">
                      · {p.reviews.length} {p.reviews.length === 1 ? 'reseña' : 'reseñas'}
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                  {p.reviews.map(r => (
                    <div key={r.id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="size-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                        >
                          {r.author.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#151c26] text-sm">
                            {r.author.firstName} {r.author.lastName}
                          </p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <StarIcon key={i} size={11} className="text-yellow-400" />
                            ))}
                            {Array.from({ length: 5 - r.rating }).map((_, i) => (
                              <StarIcon key={`e${i}`} size={11} className="text-gray-200" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="sticky top-24 h-fit">
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,52,87,0.12)] border border-gray-100">
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0f3457 0%, #8f8272 100%)' }} />
              <div className="p-6">

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#151c26]">
                      S/ {p.price.toLocaleString('es-PE')}
                    </span>
                    <span className="text-gray-400 text-sm">/ mes</span>
                  </div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <StarIcon size={13} className="text-yellow-400" />
                      <span className="font-bold text-[#151c26]">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-400">({p.reviews.length} reseñas)</span>
                    </div>
                  )}
                </div>

                {/* Info chips */}
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                    <MoneyBag02Icon size={12} className="text-accent" />
                    Depósito: {p.deposit} {p.deposit === 1 ? 'mes' : 'meses'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                    <Clock05Icon size={12} className="text-accent" />
                    Mínimo {p.minDuration} {p.minDuration === 1 ? 'mes' : 'meses'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green bg-green/10 px-2.5 py-1.5 rounded-lg">
                    <SecurityCheckIcon size={12} />
                    Verificada
                  </span>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                {/* Contact form */}
                {/* KYC gate — solo usuarios verificados pueden contactar */}
                {!p.isAuthenticated ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center mb-4">
                    <LockPasswordIcon size={32} className="text-slate-400 mx-auto mb-3" />
                    <p className="font-bold text-[#151c26] text-sm mb-1">
                      Inicia sesión para contactar
                    </p>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Necesitas una cuenta para ver el contacto del arrendador.
                    </p>
                    <Link
                      href="/login"
                      className="block w-full py-2.5 text-white rounded-xl font-bold text-sm text-center no-underline hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                    >
                      Iniciar sesión
                    </Link>
                  </div>
                ) : !p.ownerPhoneVisible ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center mb-4">
                    <UserCheck01Icon size={32} className="text-amber-500 mx-auto mb-3" />
                    <p className="font-bold text-[#151c26] text-sm mb-1">
                      Verifica tu identidad
                    </p>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      Para contactar al arrendador necesitas completar tu verificación KYC. El proceso toma menos de 2 minutos.
                    </p>
                    <Link
                      href="/tenant/kyc"
                      className="block w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm text-center no-underline transition-colors"
                    >
                      Completar verificación KYC
                    </Link>
                  </div>
                ) : formState === 'sent' ? (
                  <div className="py-8 text-center">
                    <CheckmarkCircle02Icon size={40} className="text-green mx-auto mb-3" />
                    <p className="font-bold text-[#151c26] mb-1">¡Consulta enviada!</p>
                    <p className="text-sm text-gray-400 mb-4">
                      El arrendador recibirá tu mensaje por WhatsApp.
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="text-sm text-accent font-semibold bg-transparent border-none cursor-pointer hover:underline"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                ) : (
                  <form className="flex flex-col gap-3 mb-4" onSubmit={handleConsult}>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        Tu nombre completo *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+51 999 999 999"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        Mensaje (opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Hola, me interesa la propiedad..."
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-gray-50 resize-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="w-full py-3 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                    >
                      <MessageMultiple02Icon size={18} />
                      Enviar consulta por WhatsApp
                    </button>
                    {p.owner.phone && (
                      <a
                        href={`https://wa.me/51${p.owner.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${p.owner.firstName}, vi tu anuncio "${p.title}" en Habita Perú. ¿Sigue disponible?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 no-underline cursor-pointer transition-colors"
                      >
                        <WhatsappIcon size={18} />
                        Abrir WhatsApp directo
                      </a>
                    )}
                  </form>
                )}

                <div className="h-px bg-gray-100 mb-4" />

                {/* Owner */}
                <div className="flex items-center gap-3">
                  <div
                    className="size-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                  >
                    {p.owner.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#151c26] text-sm">
                      {p.owner.firstName} {p.owner.lastName}
                    </p>
                    <p className="text-xs text-gray-400">Arrendador</p>
                  </div>
                  {p.owner.verified && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-green">
                      <SecurityCheckIcon size={14} />
                      <span>Verificado</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
