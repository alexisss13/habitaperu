import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  Location01Icon, 
  FavouriteIcon, 
  Home01Icon,
  CheckmarkCircle02Icon,
  StarIcon,
  WhatsappIcon,
  SecurityCheckIcon,
  ArrowRight01Icon,
  Share08Icon,
  Maximize01Icon,
  Calendar03Icon,
  MoneyBag02Icon,
  Clock05Icon,
  MessageMultiple02Icon
} from "hugeicons-react"

export const dynamic = 'force-dynamic'

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let property
  try {
    property = await prisma.property.findUnique({
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
            author: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    property = null
  }

  if (!property) {
    notFound()
  }

  const avgRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
        property.reviews.length
      : 0

  const images = Array.isArray(property.images) 
    ? (property.images as string[]).filter((img): img is string => typeof img === 'string')
    : []
  const amenities = Array.isArray(property.amenities) 
    ? (property.amenities as string[]).filter((a): a is string => typeof a === 'string')
    : []

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Inicio
            </Link>
            <ArrowRight01Icon size={14} />
            <Link href="/propiedades" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Propiedades
            </Link>
            <ArrowRight01Icon size={14} />
            <span style={{ color: '#111827', fontWeight: '500' }}>{property.title}</span>
          </nav>

          {/* Title and Actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1' }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '600', color: '#111827', marginBottom: '8px', lineHeight: '1.2' }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarIcon size={16} />
                  <span style={{ fontWeight: '600' }}>{avgRating > 0 ? avgRating.toFixed(1) : 'Nuevo'}</span>
                  {property.reviews.length > 0 && (
                    <span style={{ color: '#6b7280' }}>({property.reviews.length} reseñas)</span>
                  )}
                </div>
                <span style={{ color: '#d1d5db' }}>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <Location01Icon size={16} />
                  <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{property.district}, Lima</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <Share08Icon size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Compartir</span>
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <FavouriteIcon size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Guardar</span>
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '48px', borderRadius: '12px', overflow: 'hidden', height: '400px', position: 'relative' }}>
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', cursor: 'pointer' }}>
              <img
                src={images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                alt={property.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: 'relative', cursor: 'pointer' }}>
                <img src={img} alt={`Foto ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
            <button style={{ position: 'absolute', bottom: '16px', right: '16px', background: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: '500' }}>
              <Maximize01Icon size={16} />
              Mostrar todas las fotos
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
            {/* Main Content */}
            <div>
              {/* Host Info */}
              <div style={{ paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>
                      {property.type === 'HABITACION' ? 'Habitación' : property.type === 'DEPARTAMENTO' ? 'Departamento' : 'Casa'} alquilada por {property.owner.firstName}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                      <span>{property.rooms} {property.rooms === 1 ? 'habitación' : 'habitaciones'}</span>
                      <span>·</span>
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</span>
                      {property.area && (
                        <>
                          <span>·</span>
                          <span>{property.area}m²</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '1.125rem' }}>
                    {property.owner.firstName[0]}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={{ paddingTop: '32px', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <Home01Icon size={24} style={{ color: '#374151', flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Propiedad completa</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Tendrás acceso a toda la propiedad para ti.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <SecurityCheckIcon size={24} style={{ color: '#374151', flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Propiedad verificada</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Esta propiedad ha sido verificada por Habita Perú.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <Calendar03Icon size={24} style={{ color: '#374151', flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Alquiler mensual</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Contrato mínimo de {property.minDuration} {property.minDuration === 1 ? 'mes' : 'meses'}.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ paddingTop: '32px', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Acerca de este lugar</h2>
                <p style={{ color: '#374151', lineHeight: '1.75', whiteSpace: 'pre-line' }}>{property.description}</p>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div style={{ paddingTop: '32px', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px' }}>Lo que ofrece este lugar</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    {amenities.map((amenity, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151' }}>
                        <CheckmarkCircle02Icon size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {property.reviews.length > 0 && (
                <div style={{ paddingTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <StarIcon size={24} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                      {avgRating.toFixed(1)} · {property.reviews.length} {property.reviews.length === 1 ? 'reseña' : 'reseñas'}
                    </h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {property.reviews.map((review) => (
                      <div key={review.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600' }}>
                            {review.author.firstName[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{review.author.firstName} {review.author.lastName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <StarIcon key={i} size={12} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.5' }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div style={{ position: 'sticky', top: '96px', height: 'fit-content' }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>S/ {Number(property.price).toLocaleString("es-PE")}</span>
                    <span style={{ color: '#6b7280' }}>/ mes</span>
                  </div>
                  {property.reviews.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                      <StarIcon size={14} />
                      <span style={{ fontWeight: '600' }}>{avgRating.toFixed(1)}</span>
                      <span style={{ color: '#6b7280' }}>({property.reviews.length} reseñas)</span>
                    </div>
                  )}
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Tu nombre completo
                    </label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Mensaje (opcional)
                    </label>
                    <textarea
                      rows={3}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'none' }}
                      placeholder="Hola, me interesa la propiedad..."
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '12px 24px', background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }}
                  >
                    <MessageMultiple02Icon size={20} />
                    Enviar consulta
                  </button>
                  <button
                    type="button"
                    style={{ width: '100%', padding: '12px 24px', background: '#10b981', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <WhatsappIcon size={20} />
                    Contactar por WhatsApp
                  </button>
                </form>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <MoneyBag02Icon size={18} />
                    <span>Depósito: {property.deposit} {property.deposit === 1 ? 'mes' : 'meses'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <Clock05Icon size={18} />
                    <span>Mínimo {property.minDuration} {property.minDuration === 1 ? 'mes' : 'meses'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#10b981' }}>
                    <SecurityCheckIcon size={18} />
                    <span style={{ fontWeight: '500' }}>Propiedad verificada</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '1.125rem' }}>
                      {property.owner.firstName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{property.owner.firstName} {property.owner.lastName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Arrendador</div>
                    </div>
                  </div>
                  {property.owner.verified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                      <SecurityCheckIcon size={16} style={{ color: '#10b981' }} />
                      <span>Identidad verificada</span>
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
