import { prisma } from "@/lib/db"
import { PropiedadesView } from './propiedades-view'

export const dynamic = 'force-dynamic'

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; district?: string; type?: string; sort?: string; condition?: string; amenity?: string }>
}) {
  const params = await searchParams
  const properties = await prisma.property.findMany({
    where: { status: 'DISPONIBLE' },
    include: {
      owner: { select: { firstName: true, lastName: true, verified: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const mapped = properties.map(p => {
    const avgRating = p.reviews.length > 0
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0
    return {
      id: p.id,
      title: p.title,
      type: p.type,
      condition: p.condition,
      district: p.district,
      price: Number(p.price),
      rooms: p.rooms,
      bathrooms: p.bathrooms,
      area: p.area,
      images: (Array.isArray(p.images) ? p.images : []) as string[],
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: p.reviews.length,
      status: p.status,
      amenities: (Array.isArray(p.amenities) ? p.amenities : []) as string[],
    }
  })

  return (
    <PropiedadesView
      properties={mapped}
      initialSearchQuery={params.q ?? ''}
      initialDistrict={params.district ?? ''}
      initialType={params.type ?? ''}
      initialSort={params.sort ?? 'recent'}
      initialCondition={params.condition ?? ''}
      initialAmenity={params.amenity ?? ''}
    />
  )
}
