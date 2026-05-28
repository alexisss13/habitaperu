import { HomeView } from './home-view'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      take: 6,
      orderBy: { views: 'desc' },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })
    
    // Convert Decimal to number for client component
    return properties.map((property) => ({
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
      _count: property._count,
    }))
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
        _count: { reviews: 24 },
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
        _count: { reviews: 12 },
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
        _count: { reviews: 7 },
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
        _count: { reviews: 18 },
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
        _count: { reviews: 5 },
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
        _count: { reviews: 9 },
      },
    ]
  }
}

// Lima districts aggregated into "Lima"
const LIMA_DISTRICTS = [
  'Miraflores','San Isidro','Barranco','Santiago de Surco','San Borja','La Molina',
  'Lince','Jesús María','Magdalena del Mar','San Miguel','Pueblo Libre','Surquillo',
  'Chorrillos','Lima','Surco','Rímac','Rimac','Breña','La Victoria','El Agustino',
  'Los Olivos','Comas','Independencia','San Martín de Porres','Callao','Ate',
  'San Juan de Lurigancho','Villa El Salvador','Lurigancho','Carabayllo',
]

const PERU_CITIES = ['Lima','Arequipa','Trujillo','Cusco','Chiclayo','Piura','Huancayo','Tacna']

async function getCityCounts() {
  try {
    const results = await prisma.property.groupBy({
      by: ['district'],
      where: { status: 'DISPONIBLE' },
      _count: { district: true },
    })

    // Aggregate all Lima districts as "Lima"
    const limaCount = results
      .filter(r => LIMA_DISTRICTS.some(d => d.toLowerCase() === r.district.toLowerCase()))
      .reduce((sum, r) => sum + r._count.district, 0)

    // Map other cities
    const cityMap: Record<string, number> = { Lima: limaCount }
    results.forEach(r => {
      const matched = PERU_CITIES.find(
        c => c.toLowerCase() === r.district.toLowerCase() && c !== 'Lima'
      )
      if (matched) cityMap[matched] = (cityMap[matched] ?? 0) + r._count.district
    })

    return PERU_CITIES.map(city => ({ city, count: cityMap[city] ?? 0 }))
  } catch {
    return PERU_CITIES.map(city => ({ city, count: 0 }))
  }
}

async function getPropertyStats() {
  try {
    // Obtener el precio mínimo y el total de propiedades disponibles
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
    // Return default values when DB is not available
    return {
      minPrice: 350,
      availableCount: 24
    }
  }
}

export default async function HomePage() {
  const [properties, stats, cityCounts] = await Promise.all([
    getProperties(),
    getPropertyStats(),
    getCityCounts(),
  ])

  return <HomeView properties={properties} stats={stats} cityCounts={cityCounts} />
}
