'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n-context'
import { 
  Search01Icon,
  FavouriteIcon,
  StarIcon,
  ArrowRightDoubleIcon,
  SecurityCheckIcon,
  FileValidationIcon,
  CreditCardIcon,
  CustomerSupportIcon,
  PlusSignCircleIcon,
  BedIcon,
  Building03Icon,
  Home01Icon,
  BookOpen01Icon,
  Sofa01Icon,
  Wifi01Icon,
  CheckmarkCircle01Icon,
  ParkingAreaSquareIcon
} from 'hugeicons-react'

interface Property {
  id: string
  title: string
  type: string
  condition: string
  district: string
  price: number
  images: string[]
  favorites: number
  rooms: number
  bathrooms: number
  area: number
  _count: {
    reviews: number
  }
}

interface PropertyStats {
  minPrice: number
  availableCount: number
}

interface HomeClientProps {
  properties: Property[]
  stats: PropertyStats
}

export function HomeClientDesktop({ properties, stats }: HomeClientProps) {
  const t = useTranslations('home')
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleProperties, setVisibleProperties] = useState(properties)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Fade in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleFilter = (filter: string) => {
    setActiveFilter(filter)
    if (filter === 'all') {
      setVisibleProperties(properties)
    } else {
      const filtered = properties.filter((p) => {
        if (filter === 'habitacion') return p.type === 'HABITACION'
        if (filter === 'departamento') return p.type === 'DEPARTAMENTO'
        if (filter === 'casa') return p.type === 'CASA'
        if (filter === 'amoblado') return p.condition === 'AMOBLADO'
        return true
      })
      setVisibleProperties(filtered)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const getPropertyTypeLabel = (type: string) => {
    if (type === 'HABITACION') return 'Habitación'
    if (type === 'DEPARTAMENTO') return 'Departamento'
    if (type === 'CASA') return 'Casa'
    return type
  }

  return (
    <div>
      {/* HERO SECTION - Clean & Intuitive UI */}
      <section style={{
        paddingTop: '102px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          right: '-3%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              {/* Simple badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  letterSpacing: '0.03em'
                }}>
                  {t('hero.badge')}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: '800',
                color: '#151c26',
                lineHeight: '1.15',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                {t('hero.title')}
              </h1>
              
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                lineHeight: '1.8',
                marginBottom: '40px',
                maxWidth: '540px'
              }}>
                {t('hero.subtitle')}
              </p>

              {/* Search Box - Simplified & Intuitive */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '8px',
                boxShadow: '0 4px 24px rgba(15,52,87,0.12)',
                marginBottom: '24px',
                border: '1px solid #e5e7eb',
                maxWidth: '680px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fff'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                  >
                    <Search01Icon size={20} style={{ color: '#6b7280', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder={t('hero.searchPlaceholder')}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.95rem',
                        color: '#151c26',
                        background: 'transparent',
                        fontWeight: '400'
                      }}
                    />
                  </div>
                  
                  <button style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,52,87,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    {t('hero.searchButton')}
                  </button>
                </div>
              </div>

              {/* Quick Filters - Simplified */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}>
                  {t('hero.filters')}:
                </span>
                {[
                  { value: 'habitacion', labelKey: 'filters.room', Icon: BedIcon },
                  { value: 'departamento', labelKey: 'filters.apartment', Icon: Building03Icon },
                  { value: 'wifi', labelKey: 'filters.wifi', Icon: Wifi01Icon },
                  { value: 'amoblado', labelKey: 'filters.furnished', Icon: Sofa01Icon }
                ].map((filter, index) => (
                  <button
                    key={index}
                    style={{
                      padding: '8px 14px',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0f3457'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = '#0f3457'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff'
                      e.currentTarget.style.color = '#6b7280'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                  >
                    <filter.Icon size={14} />
                    {t(filter.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Image - Clean & Simple */}
            <div style={{
              position: 'relative',
              height: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Simple background shape */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '520px',
                height: '520px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.04) 0%, rgba(143,130,114,0.06) 100%)',
                borderRadius: '50%',
                zIndex: 0
              }} />

              {/* Price card - simplified */}
              <div style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                padding: '16px 24px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(15,52,87,0.12)',
                zIndex: 2,
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                  {t('hero.from')}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f3457' }}>
                  S/ {stats.minPrice.toLocaleString()}<span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>{t('hero.perMonth')}</span>
                </div>
              </div>

              {/* Properties available card - simplified */}
              <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '5%',
                padding: '12px 20px',
                background: '#0f3457',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(15,52,87,0.25)',
                zIndex: 2
              }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#fff', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: '#8f8272', 
                    borderRadius: '50%' 
                  }} />
                  {stats.availableCount} {stats.availableCount === 1 ? t('hero.propertyAvailable') : t('hero.propertiesAvailable')}
                </div>
              </div>

              {/* Main Image */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '650px'
              }}>
                <Image
                  src="/imagehero.webp"
                  alt="Habitación moderna"
                  width={650}
                  height={550}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 40px rgba(15,52,87,0.15))'
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES - Clean UI */}
      <section style={{
        padding: '80px 0',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          {/* Section Header */}
          <div style={{
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '700',
              color: '#151c26',
              marginBottom: '12px'
            }}>
              {t('featured.title')}
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              maxWidth: '600px'
            }}>
              {t('featured.subtitle')}
            </p>
          </div>

          {/* Filters - Simplified */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '16px'
          }}>
            <button
              onClick={() => handleFilter('all')}
              style={{
                padding: '8px 20px',
                background: activeFilter === 'all' ? '#0f3457' : 'transparent',
                color: activeFilter === 'all' ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== 'all') {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#151c26'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== 'all') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {t('featured.filterAll')}
            </button>
            <button
              onClick={() => handleFilter('habitacion')}
              style={{
                padding: '8px 20px',
                background: activeFilter === 'habitacion' ? '#0f3457' : 'transparent',
                color: activeFilter === 'habitacion' ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== 'habitacion') {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#151c26'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== 'habitacion') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {t('featured.filterRooms')}
            </button>
            <button
              onClick={() => handleFilter('departamento')}
              style={{
                padding: '8px 20px',
                background: activeFilter === 'departamento' ? '#0f3457' : 'transparent',
                color: activeFilter === 'departamento' ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== 'departamento') {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#151c26'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== 'departamento') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {t('featured.filterApartments')}
            </button>
            <button
              onClick={() => handleFilter('casa')}
              style={{
                padding: '8px 20px',
                background: activeFilter === 'casa' ? '#0f3457' : 'transparent',
                color: activeFilter === 'casa' ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== 'casa') {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#151c26'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== 'casa') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {t('featured.filterHouses')}
            </button>
            <button
              onClick={() => handleFilter('amoblado')}
              style={{
                padding: '8px 20px',
                background: activeFilter === 'amoblado' ? '#0f3457' : 'transparent',
                color: activeFilter === 'amoblado' ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== 'amoblado') {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#151c26'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== 'amoblado') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {t('featured.filterFurnished')}
            </button>
          </div>

          <div className="property-grid" id="propertyGrid">
            {visibleProperties.map((property) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className="property-card-simple fade-in"
              >
                <div className="property-img-simple">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    width={600}
                    height={400}
                    loading="lazy"
                  />
                  <button
                    className={`btn-fav-simple ${favorites.has(property.id) ? 'active' : ''}`}
                    aria-label="Guardar"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                  >
                    <FavouriteIcon 
                      size={18}
                    />
                  </button>
                </div>
                <div className="property-info-simple">
                  <div className="property-header-simple">
                    <h4 className="property-title-simple">{property.title}</h4>
                    <div className="property-rating-simple">
                      <StarIcon size={11} className="text-gray-900" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="property-location-simple">{property.district}, Lima</p>
                  <p className="property-specs-simple">
                    {property.rooms} {property.rooms === 1 ? t('property.room') : t('property.rooms')} · {property.bathrooms} {property.bathrooms === 1 ? t('property.bathroom') : t('property.bathrooms')}
                  </p>
                  <p className="property-price-simple">
                    <strong>S/ {property.price.toLocaleString()}</strong> {t('property.perMonth')}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/propiedades" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'transparent',
              border: '1.5px solid #0f3457',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#0f3457',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0f3457'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#0f3457'
            }}
            >
              <ArrowRightDoubleIcon size={20} /> {t('featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Premium Design */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)',
              border: '1px solid rgba(143,130,114,0.2)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#0f3457',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Proceso Simple
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: '#151c26',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              ¿Cómo funciona?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Encuentra tu hogar ideal en 3 simples pasos
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            position: 'relative'
          }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '25%',
              right: '25%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)',
              zIndex: 0
            }} />

            {/* Step 1 */}
            <div style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(15,52,87,0.3)',
                border: '4px solid #fff'
              }}>
                1
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(15,52,87,0.1)'
              }}>
                <Search01Icon size={40} style={{ color: '#0f3457' }} />
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Busca y filtra
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Explora miles de propiedades verificadas. Usa filtros para encontrar exactamente lo que necesitas.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(143,130,114,0.35)',
                border: '4px solid #fff'
              }}>
                2
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(143,130,114,0.15) 0%, rgba(143,130,114,0.08) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(143,130,114,0.2)',
                fontSize: '2.5rem'
              }}>
                📅
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Agenda una visita
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Contacta directamente con el arrendador y agenda una visita para conocer la propiedad.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d5d0bd 0%, #b8b3a0 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(213,208,189,0.35)',
                border: '4px solid #fff'
              }}>
                3
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(213,208,189,0.2) 0%, rgba(213,208,189,0.1) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(213,208,189,0.3)',
                fontSize: '2.5rem'
              }}>
                ✍️
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Firma y múdate
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Firma tu contrato digital de forma segura y comienza a disfrutar de tu nuevo hogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Premium Design */}
      <section style={{
        padding: '100px 0',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,52,87,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(143,130,114,0.12) 0%, rgba(15,52,87,0.08) 100%)',
              border: '1px solid rgba(143,130,114,0.2)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#8f8272',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Ventajas
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: '#151c26',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              ¿Por qué elegir Habita Perú?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Ofrecemos la mejor experiencia en alquiler de propiedades con seguridad y confianza
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '2px solid #f3f4f6',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.borderColor = '#008A05'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,138,5,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#f3f4f6'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(0,138,5,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, rgba(0,138,5,0.1) 0%, rgba(0,138,5,0.05) 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '2px solid rgba(0,138,5,0.15)'
              }}>
                <SecurityCheckIcon size={32} style={{ color: '#008A05' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Propiedades Verificadas
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Todas las propiedades pasan por un proceso de verificación riguroso para garantizar tu seguridad.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '2px solid #f3f4f6',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.borderColor = '#8f8272'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(143,130,114,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#f3f4f6'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(143,130,114,0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, rgba(143,130,114,0.15) 0%, rgba(143,130,114,0.08) 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '2px solid rgba(143,130,114,0.2)'
              }}>
                <FileValidationIcon size={32} style={{ color: '#8f8272' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Contratos Seguros
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Contratos digitales con validez legal adaptados a la normativa peruana vigente.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '2px solid #f3f4f6',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.borderColor = '#d5d0bd'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(213,208,189,0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#f3f4f6'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(213,208,189,0.2) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, rgba(213,208,189,0.2) 0%, rgba(213,208,189,0.1) 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '2px solid rgba(213,208,189,0.3)'
              }}>
                <CreditCardIcon size={32} style={{ color: '#8f8272' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Pagos Protegidos
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Sistema de pagos seguro con protección para inquilinos y arrendadores.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '2px solid #f3f4f6',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.borderColor = '#0f3457'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#f3f4f6'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(15,52,87,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '2px solid rgba(15,52,87,0.15)'
              }}>
                <CustomerSupportIcon size={32} style={{ color: '#0f3457' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                Soporte 24/7
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                Equipo de soporte disponible para ayudarte en cualquier momento que lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE BY LOCATION - New Section */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '8px'
              }}>
                {t('exploreLocation.title')}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                {t('exploreLocation.subtitle')}
              </p>
            </div>
            <Link href="/propiedades?filter=location" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#0f3457',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = '10px'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = '6px'
            }}
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {[
              { district: 'San Isidro', count: 45, image: '/placeholder.jpg' },
              { district: 'Miraflores', count: 67, image: '/placeholder.jpg' },
              { district: 'Barranco', count: 38, image: '/placeholder.jpg' },
              { district: 'Surco', count: 52, image: '/placeholder.jpg' }
            ].map((location, index) => (
              <Link
                key={index}
                href={`/propiedades?district=${location.district}`}
                style={{
                  position: 'relative',
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,52,87,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                  zIndex: 1
                }} />
                <Image
                  src={location.image}
                  alt={location.district}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  zIndex: 2,
                  color: '#fff'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '4px'
                  }}>
                    {location.district}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    opacity: 0.9
                  }}>
                    {location.count} propiedades
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT PROPERTIES - New Section */}
      <section style={{
        padding: '80px 0',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '8px'
              }}>
                {t('studentProperties.title')}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                {t('studentProperties.subtitle')}
              </p>
            </div>
            <Link href="/propiedades?filter=students" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#0f3457',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = '10px'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = '6px'
            }}
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>

          <div className="property-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {visibleProperties.slice(0, 4).map((property) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className="property-card-simple fade-in"
              >
                <div className="property-img-simple">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    width={600}
                    height={400}
                    loading="lazy"
                  />
                  <button
                    className={`btn-fav-simple ${favorites.has(property.id) ? 'active' : ''}`}
                    aria-label="Guardar"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                  >
                    <FavouriteIcon size={18} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    background: '#008A05',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}>
                    Cerca de universidades
                  </div>
                </div>
                <div className="property-info-simple">
                  <div className="property-header-simple">
                    <h4 className="property-title-simple">{property.title}</h4>
                    <div className="property-rating-simple">
                      <StarIcon size={11} className="text-gray-900" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="property-location-simple">{property.district}, Lima</p>
                  <p className="property-specs-simple">
                    {property.rooms} {property.rooms === 1 ? t('property.room') : t('property.rooms')} · {property.bathrooms} {property.bathrooms === 1 ? t('property.bathroom') : t('property.bathrooms')}
                  </p>
                  <p className="property-price-simple">
                    <strong>S/ {property.price.toLocaleString()}</strong> {t('property.perMonth')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FULL APARTMENTS - New Section */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '8px'
              }}>
                {t('fullApartments.title')}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                {t('fullApartments.subtitle')}
              </p>
            </div>
            <Link href="/propiedades?type=departamento" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#0f3457',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = '10px'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = '6px'
            }}
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>

          <div className="property-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {properties.filter(p => p.type === 'DEPARTAMENTO').slice(0, 4).map((property) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className="property-card-simple fade-in"
              >
                <div className="property-img-simple">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    width={600}
                    height={400}
                    loading="lazy"
                  />
                  <button
                    className={`btn-fav-simple ${favorites.has(property.id) ? 'active' : ''}`}
                    aria-label="Guardar"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                  >
                    <FavouriteIcon size={18} />
                  </button>
                </div>
                <div className="property-info-simple">
                  <div className="property-header-simple">
                    <h4 className="property-title-simple">{property.title}</h4>
                    <div className="property-rating-simple">
                      <StarIcon size={11} className="text-gray-900" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="property-location-simple">{property.district}, Lima</p>
                  <p className="property-specs-simple">
                    {property.rooms} {property.rooms === 1 ? t('property.room') : t('property.rooms')} · {property.bathrooms} {property.bathrooms === 1 ? t('property.bathroom') : t('property.bathrooms')}
                  </p>
                  <p className="property-price-simple">
                    <strong>S/ {property.price.toLocaleString()}</strong> {t('property.perMonth')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BUDGET ROOMS - New Section */}
      <section style={{
        padding: '80px 0',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '8px'
              }}>
                {t('budgetRooms.title')}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                {t('budgetRooms.subtitle')}
              </p>
            </div>
            <Link href="/propiedades?sort=price-asc" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#0f3457',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = '10px'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = '6px'
            }}
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>

          <div className="property-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[...properties].sort((a, b) => a.price - b.price).slice(0, 4).map((property) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className="property-card-simple fade-in"
              >
                <div className="property-img-simple">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    width={600}
                    height={400}
                    loading="lazy"
                  />
                  <button
                    className={`btn-fav-simple ${favorites.has(property.id) ? 'active' : ''}`}
                    aria-label="Guardar"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                  >
                    <FavouriteIcon size={18} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    background: '#8f8272',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}>
                    Mejor precio
                  </div>
                </div>
                <div className="property-info-simple">
                  <div className="property-header-simple">
                    <h4 className="property-title-simple">{property.title}</h4>
                    <div className="property-rating-simple">
                      <StarIcon size={11} className="text-gray-900" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="property-location-simple">{property.district}, Lima</p>
                  <p className="property-specs-simple">
                    {property.rooms} {property.rooms === 1 ? t('property.room') : t('property.rooms')} · {property.bathrooms} {property.bathrooms === 1 ? t('property.bathroom') : t('property.bathrooms')}
                  </p>
                  <p className="property-price-simple">
                    <strong>S/ {property.price.toLocaleString()}</strong> {t('property.perMonth')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOR LANDLORDS - Premium Design */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 50%, #061829 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(213,208,189,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />

        {/* Geometric shapes */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60px',
          height: '60px',
          border: '3px solid rgba(143,130,114,0.4)',
          borderRadius: '50%',
          opacity: 0.6
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(213,208,189,0.15)',
          borderRadius: '16px',
          transform: 'rotate(25deg)',
          opacity: 0.5
        }} />

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '64px 56px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(143,130,114,0.2)',
                border: '1px solid rgba(143,130,114,0.4)',
                borderRadius: '100px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#8f8272',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#d5d0bd',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Para Arrendadores
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '16px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                ¿Tienes una propiedad para alquilar?
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.7',
                marginBottom: '24px'
              }}>
                Únete a más de <span style={{ fontWeight: '700', color: '#d5d0bd' }}>4,800 arrendadores</span> que ya gestionan sus propiedades con Habita Perú.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                marginTop: '32px'
              }}>
                <div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#fff',
                    lineHeight: '1',
                    marginBottom: '6px'
                  }}>
                    98%
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    Satisfacción
                  </div>
                </div>
                <div style={{
                  width: '1px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.2)'
                }} />
                <div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#fff',
                    lineHeight: '1',
                    marginBottom: '6px'
                  }}>
                    15 días
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    Promedio de alquiler
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <Link href="/publicar" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '700',
                borderRadius: '16px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 8px 32px rgba(143,130,114,0.4)',
                border: '2px solid rgba(213,208,189,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(143,130,114,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(143,130,114,0.4)'
              }}
              >
                <PlusSignCircleIcon size={24} />
                Publicar mi propiedad
              </Link>
              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                ✓ Sin comisiones ocultas · ✓ Publicación gratuita
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
        `}</style>
      </section>
    </div>
  )
}
