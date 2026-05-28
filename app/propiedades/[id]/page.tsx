import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { PropertyDetailView } from './property-detail-view'

export const dynamic = 'force-dynamic'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let property
  try {
    property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, phone: true, verified: true, avatar: true } },
        reviews: {
          include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  } catch {
    property = null
  }

  if (!property) notFound()

  const avgRating = property.reviews.length > 0
    ? property.reviews.reduce((s, r) => s + r.rating, 0) / property.reviews.length
    : 0

  return (
    <PropertyDetailView property={{
      id: property.id,
      title: property.title,
      type: property.type,
      district: property.district,
      price: Number(property.price),
      rooms: property.rooms,
      bathrooms: property.bathrooms,
      area: property.area,
      images: (Array.isArray(property.images) ? property.images : []) as string[],
      amenities: (Array.isArray(property.amenities) ? property.amenities : []) as string[],
      description: property.description,
      deposit: property.deposit,
      minDuration: property.minDuration,
      avgRating: Math.round(avgRating * 10) / 10,
      owner: property.owner,
      reviews: property.reviews,
    }} />
  )
}
