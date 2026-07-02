import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { PropertyDetailView } from '@/app/propiedades/[id]/property-detail-view'
import { auth } from "@/lib/auth"
import { incrementPropertyView } from "@/app/actions/property-actions"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      district: true,
      price: true,
      rooms: true,
      bathrooms: true,
      type: true,
      images: true,
      deletedAt: true,
    },
  })

  if (!property || property.deletedAt) {
    return { title: "Propiedad no encontrada — Habita Perú" }
  }

  const typeLabel: Record<string, string> = {
    HABITACION: "Habitación",
    DEPARTAMENTO: "Departamento",
    CASA: "Casa",
    OFICINA: "Oficina",
    LOCAL: "Local",
  }

  const images = Array.isArray(property.images) ? property.images as string[] : []
  const priceNum = Number(property.price)
  const title = `${property.title} — S/ ${priceNum.toLocaleString("es-PE")}/mes | Habita Perú`
  const description = `${typeLabel[property.type] ?? property.type} en ${property.district}. ${property.rooms} hab · ${property.bathrooms} baños · S/ ${priceNum.toLocaleString("es-PE")}/mes. ${property.description.slice(0, 120)}...`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_PE",
      siteName: "Habita Perú",
      images: images.length > 0
        ? [{ url: images[0], width: 1200, height: 630, alt: property.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length > 0 ? [images[0]] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params

  const [session, property] = await Promise.all([
    auth(),
    prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            verified: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            author: { select: { firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ])

  if (!property || property.deletedAt) notFound()

  // Incrementar vistas (no bloquea el render — fire and forget)
  incrementPropertyView(id).catch(() => {})

  // KYC gate: solo mostrar el teléfono del arrendador si el tenant tiene KYC aprobado
  let ownerPhoneVisible = false
  if (session?.user?.id) {
    const kyc = await prisma.kYCVerification.findUnique({
      where: { userId: session.user.id },
      select: { status: true },
    })
    ownerPhoneVisible = kyc?.status === "APROBADO"
  }

  const avgRating =
    property.reviews.length > 0
      ? property.reviews.reduce((s, r) => s + r.rating, 0) / property.reviews.length
      : 0

  return (
    <PropertyDetailView
      property={{
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
        owner: {
          ...property.owner,
          // Solo pasar el teléfono si el usuario tiene KYC aprobado
          phone: ownerPhoneVisible ? property.owner.phone : null,
        },
        reviews: property.reviews,
        ownerPhoneVisible,
        isAuthenticated: !!session?.user,
        status: property.status,
      }}
    />
  )
}
