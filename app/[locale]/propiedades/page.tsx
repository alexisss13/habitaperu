import { prisma } from "@/lib/db"
import { PropiedadesView } from '@/app/propiedades/propiedades-view'

export const dynamic = 'force-dynamic'

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{
    district?: string; type?: string; sort?: string; condition?: string; q?: string; amenity?: string
    minPrice?: string; maxPrice?: string; university?: string
  }>
}) {
  const params = await searchParams

  const now = new Date()
  const properties = await prisma.property.findMany({
    where: { status: 'DISPONIBLE', deletedAt: null },
    include: {
      owner: { select: { firstName: true, lastName: true, verified: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: [
      // Featured activas (featuredUntil > now) primero, expired como nulls
      { featuredUntil: { sort: 'desc', nulls: 'last' } },
      { createdAt: 'desc' },
    ],
  })

  // Re-order: expired featuredUntil (in the past) treated as non-featured
  properties.sort((a, b) => {
    const aFeatured = a.featuredUntil && a.featuredUntil > now ? 1 : 0
    const bFeatured = b.featuredUntil && b.featuredUntil > now ? 1 : 0
    if (aFeatured !== bFeatured) return bFeatured - aFeatured
    return b.createdAt.getTime() - a.createdAt.getTime()
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
      featuredUntil: p.featuredUntil?.toISOString() ?? null,
      lat: p.lat ?? null,
      lng: p.lng ?? null,
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
      initialMinPrice={params.minPrice ?? ''}
      initialMaxPrice={params.maxPrice ?? ''}
      initialUniversityId={params.university ?? ''}
    />
  )
}
