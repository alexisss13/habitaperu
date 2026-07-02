import { HomeView } from './home-view'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      take: 12,
      where: { status: 'DISPONIBLE' },
      orderBy: { views: 'desc' },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
    })

    // Convert Decimal to number for client component
    return properties.map((property) => {
      const avgRating = property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
        : 0
      return {
        id: property.id,
        title: property.title,
        type: property.type,
        condition: property.condition,
        district: property.district,
        price: Number(property.price),
        images: Array.isArray(property.images) ? property.images as string[] : [],
        favorites: property.favorites,
        rooms: property.rooms,
        bathrooms: property.bathrooms,
        area: Number(property.area),
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: property.reviews.length,
        amenities: Array.isArray(property.amenities) ? property.amenities as string[] : [],
        tenantProfile: Array.isArray(property.tenantProfile) ? property.tenantProfile as string[] : [],
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    // Return mock data for development when DB is not available
    return [
      {
        id: '1',
        title: 'Depa moderno en Miraflores',
        type: 'DEPARTAMENTO',
        condition: 'AMOBLADO',
        district: 'Miraflores',
        price: 1800,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'],
        favorites: 32,
        rooms: 2,
        bathrooms: 2,
        area: 65,
        avgRating: 4.7,
        reviewCount: 24,
        amenities: ['WiFi', 'Cable TV'],
        tenantProfile: ['profesional', 'pareja'],
      },
      {
        id: '2',
        title: 'Habitación premium con baño privado',
        type: 'HABITACION',
        condition: 'SEMI_AMOBLADO',
        district: 'San Isidro',
        price: 750,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'],
        favorites: 18,
        rooms: 1,
        bathrooms: 1,
        area: 18,
        avgRating: 4.6,
        reviewCount: 12,
        amenities: ['WiFi', 'Agua incluida'],
        tenantProfile: ['profesional'],
      },
      {
        id: '3',
        title: 'Casa familiar en Santiago de Surco',
        type: 'CASA',
        condition: 'SIN_MUEBLES',
        district: 'Surco',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'],
        favorites: 24,
        rooms: 4,
        bathrooms: 3,
        area: 180,
        avgRating: 4.5,
        reviewCount: 7,
        amenities: ['WiFi', 'Jardín', 'Cochera'],
        tenantProfile: ['familia'],
      },
      {
        id: '4',
        title: 'Depa amoblado con vista al mar',
        type: 'DEPARTAMENTO',
        condition: 'AMOBLADO',
        district: 'Barranco',
        price: 2400,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
        favorites: 45,
        rooms: 2,
        bathrooms: 2,
        area: 72,
        avgRating: 4.9,
        reviewCount: 18,
        amenities: ['WiFi', 'Cable TV', 'Seguridad 24h'],
        tenantProfile: ['profesional', 'extranjero'],
      },
      {
        id: '5',
        title: 'Habitación ejecutiva cerca a universidades',
        type: 'HABITACION',
        condition: 'SEMI_AMOBLADO',
        district: 'Jesús María',
        price: 550,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
        favorites: 8,
        rooms: 1,
        bathrooms: 1,
        area: 20,
        avgRating: 4.4,
        reviewCount: 5,
        amenities: ['WiFi', 'Escritorio'],
        tenantProfile: ['estudiante'],
      },
      {
        id: '6',
        title: 'Departamento luminoso en San Borja',
        type: 'DEPARTAMENTO',
        condition: 'SIN_MUEBLES',
        district: 'San Borja',
        price: 1500,
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80'],
        favorites: 12,
        rooms: 2,
        bathrooms: 1,
        area: 58,
        avgRating: 0,
        reviewCount: 0,
        amenities: ['WiFi', 'Ascensor'],
        tenantProfile: ['profesional'],
      },
    ]
  }
}

async function getPropertyStats() {
  try {
    const [minPriceResult, totalCount] = await Promise.all([
      prisma.property.findFirst({
        where: { status: 'DISPONIBLE' },
        orderBy: { price: 'asc' },
        select: { price: true }
      }),
      prisma.property.count({
        where: { status: 'DISPONIBLE' }
      })
    ])

    return {
      minPrice: minPriceResult ? Number(minPriceResult.price) : 350,
      availableCount: totalCount || 0
    }
  } catch (error) {
    console.error('Error fetching property stats:', error)
    return { minPrice: 350, availableCount: 0 }
  }
}

async function getLandlordStats() {
  try {
    const [landlordCount, ratingResult, contractCount] = await Promise.all([
      prisma.user.count({ where: { role: 'LANDLORD' } }),
      prisma.review.aggregate({ _avg: { rating: true } }),
      prisma.contract.count({ where: { status: 'ACTIVE' } }),
    ])
    return {
      landlordCount,
      avgRating: Math.round(((ratingResult._avg.rating ?? 4.8) * 10)) / 10,
      contractCount,
    }
  } catch {
    return { landlordCount: 0, avgRating: 0, contractCount: 0 }
  }
}

export default async function HomePage() {
  const [properties, stats, landlordStats] = await Promise.all([
    getProperties(),
    getPropertyStats(),
    getLandlordStats(),
  ])

  return <HomeView properties={properties} stats={stats} landlordStats={landlordStats} />
}
