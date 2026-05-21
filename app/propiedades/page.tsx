import { prisma } from "@/lib/db"
import { PropertyCard } from "@/components/property-card"

export const dynamic = 'force-dynamic'

export default async function PropiedadesPage() {
  const properties = await prisma.property.findMany({
    where: {
      status: "DISPONIBLE",
    },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          verified: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const propertiesWithRating = properties.map((property) => {
    const avgRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
          property.reviews.length
        : 0

    return {
      ...property,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: property.reviews.length,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-[#FF385C]">Inicio</a>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Propiedades</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Propiedades disponibles
          </h1>
          <p className="text-gray-600">
            Mostrando {properties.length} propiedades verificadas
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button className="text-sm text-[#FF385C] hover:text-[#E31C5F]">
                  Limpiar
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de inmueble
                  </label>
                  <div className="space-y-2">
                    {["Departamento", "Habitación", "Casa"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio mensual (S/)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Todos los distritos</option>
                    <option>Miraflores</option>
                    <option>San Isidro</option>
                    <option>Barranco</option>
                    <option>Surco</option>
                    <option>San Borja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones mínimas
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-[#FF385C] hover:bg-red-50 transition-colors"
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors font-medium">
                  Aplicar filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {properties.length} propiedades encontradas
              </p>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Más recientes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Mejor calificación</option>
              </select>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay propiedades disponibles
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o vuelve más tarde
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesWithRating.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    type={property.type}
                    district={property.district}
                    price={Number(property.price)}
                    rooms={property.rooms}
                    bathrooms={property.bathrooms}
                    area={property.area || undefined}
                    images={property.images as string[]}
                    avgRating={property.avgRating}
                    reviewCount={property.reviewCount}
                    status={property.status}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
