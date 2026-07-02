'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { StarIcon, FavouriteIcon, Building03Icon } from "hugeicons-react"
import { useAuthModal } from "@/components/auth/auth-modal-provider"

interface PropertyCardProps {
  id: string
  title: string
  type: string
  district: string
  price: number
  rooms: number
  bathrooms: number
  area?: number
  images: string[]
  avgRating?: number
  reviewCount?: number
  status: string
  featuredUntil?: string | null
}

const TYPE_LABEL: Record<string, string> = {
  HABITACION:   'Habitación',
  DEPARTAMENTO: 'Departamento',
  CASA:         'Casa',
  OFICINA:      'Oficina',
  LOCAL:        'Local',
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  DISPONIBLE:    { label: 'Disponible',    cls: 'bg-green/10 text-green' },
  OCUPADA:       { label: 'Ocupada',       cls: 'bg-gray-100 text-gray-500' },
  MANTENIMIENTO: { label: 'Mantenimiento', cls: 'bg-yellow-50 text-yellow-700' },
}

export function PropertyCard({
  id,
  title,
  type,
  district,
  price,
  rooms,
  bathrooms,
  area,
  images,
  avgRating = 0,
  reviewCount = 0,
  status,
  featuredUntil,
}: PropertyCardProps) {
  const isCurrentlyFeatured =
    !!featuredUntil && new Date(featuredUntil) > new Date()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const { requireAuth } = useAuthModal()

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFavorite(ids.includes(id))
    } catch {}
  }, [id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(() => {
      try {
        const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
        const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
        localStorage.setItem('habitaperu_favorites', JSON.stringify(next))
        setIsFavorite(next.includes(id))
      } catch {}
    })
  }

  const mainImage = !imgErr && Array.isArray(images) && images.length > 0 ? images[0] : null
  const statusBadge = STATUS_BADGE[status]

  return (
    <Link href={`/propiedades/${id}`} className="no-underline block group">
      <div className=" rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_24px_rgba(15,52,87,0.1)] transition-all duration-200">

        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building03Icon size={40} className="text-gray-300" />
            </div>
          )}

          {/* Top-left: type + status + featured badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            {isCurrentlyFeatured && (
              <span className="text-[11px] font-bold bg-[#8f8272] text-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                ★
              </span>
            )}
            <span className="text-[11px] font-semibold bg-white/92 text-[#151c26] px-2 py-0.5 rounded-full shadow-sm">
              {TYPE_LABEL[type] ?? type}
            </span>
            {statusBadge && status !== 'DISPONIBLE' && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            )}
          </div>

          {/* Top-right: favorite */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2.5 right-2.5 size-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm border-none cursor-pointer transition-colors"
          >
            <FavouriteIcon
              size={15}
              className={isFavorite ? 'text-red-500' : 'text-gray-400'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>

          {/* Rating badge */}
          {avgRating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/55 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <StarIcon size={10} className="text-yellow-400" />
              <span>{avgRating.toFixed(1)}</span>
              {reviewCount > 0 && <span className="text-white/70">({reviewCount})</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="property-info-simple !pt-3 !pb-5">
          <p className="property-title-simple line-clamp-2">{title}</p>

          <p className="property-location-simple">{district}</p>

          <p className="property-specs-simple">
            {area ? `${area} m² · ` : ''}
            {rooms} {rooms === 1 ? 'hab.' : 'hab.'} · {bathrooms} {bathrooms === 1 ? 'baño' : 'baños'}
          </p>

          <p className="property-price-simple">
            <strong>{price > 0 ? `S/ ${price.toLocaleString('es-PE')}` : 'Precio a consultar'}</strong>
            {price > 0 && ' /mes'}
          </p>
        </div>

      </div>
    </Link>
  )
}
