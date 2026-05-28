'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Location01Icon, StarIcon, FavouriteIcon,
  Building03Icon, BedIcon, Bathtub02Icon
} from "hugeicons-react"

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
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      setIsFavorite(ids.includes(id))
    } catch {}
  }, [id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('habitaperu_favorites') || '[]')
      const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
      localStorage.setItem('habitaperu_favorites', JSON.stringify(next))
      setIsFavorite(next.includes(id))
    } catch {}
  }

  const mainImage = !imgErr && Array.isArray(images) && images.length > 0 ? images[0] : null
  const statusBadge = STATUS_BADGE[status]

  return (
    <Link href={`/propiedades/${id}`} className="no-underline block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-[0_8px_24px_rgba(15,52,87,0.1)] transition-all duration-200">

        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building03Icon size={40} className="text-gray-300" />
            </div>
          )}

          {/* Top-left: type + status badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold bg-white/92 text-[#151c26] px-2 py-0.5 rounded-full shadow-sm">
              {TYPE_LABEL[type] ?? type}
            </span>
            {statusBadge && (
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
        <div className="p-4">
          <h3 className="font-bold text-[#151c26] text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-accent transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <Location01Icon size={11} />
            <span>{district}, Lima</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-3 border-b border-gray-50">
            {area && <span className="flex items-center gap-1">{area} m²</span>}
            <span className="flex items-center gap-1">
              <BedIcon size={12} />
              {rooms} hab.
            </span>
            <span className="flex items-center gap-1">
              <Bathtub02Icon size={12} />
              {bathrooms} baños
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-extrabold text-accent">
                S/ {price.toLocaleString('es-PE')}
              </span>
              <span className="text-xs text-gray-400"> /mes</span>
            </div>
            <span className="text-xs font-bold text-accent border border-accent/30 px-3 py-1.5 rounded-lg group-hover:bg-accent group-hover:text-white transition-all">
              Ver detalle
            </span>
          </div>
        </div>

      </div>
    </Link>
  )
}
