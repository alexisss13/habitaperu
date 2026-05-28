'use client'

import { useEffect, useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from '@/lib/i18n-context'
import {
  Search01Icon, FavouriteIcon, StarIcon, ArrowRightDoubleIcon,
  SecurityCheckIcon, FileValidationIcon, CreditCardIcon, CustomerSupportIcon,
  PlusSignCircleIcon, BedIcon, Building03Icon, Home01Icon,
  BookOpen01Icon, Sofa01Icon, Wifi01Icon, CheckmarkCircle01Icon, ParkingAreaSquareIcon
} from 'hugeicons-react'

interface Property {
  id: string; title: string; type: string; condition: string; district: string
  price: number; images: string[]; favorites: number; rooms: number
  bathrooms: number; area: number; _count: { reviews: number }
}

interface PropertyStats { minPrice: number; availableCount: number }
interface CityCount { city: string; count: number }

interface HomeClientProps { properties: Property[]; stats: PropertyStats; cityCounts: CityCount[] }

const filterBtn = (active: boolean) =>
  `px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border-none
  ${active ? 'bg-accent text-white' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#151c26]'}`

function PropertyCardGrid({ properties, favorites, toggleFavorite, t, badge }: {
  properties: Property[]; favorites: Set<string>; toggleFavorite: (id: string) => void
  t: (key: string) => string; badge?: { bg: string; label: string }
}) {
  return (
    <div className="property-grid grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {properties.map((property) => (
        <Link key={property.id} href={`/propiedades/${property.id}`} className="property-card-simple fade-in">
          <div className="property-img-simple">
            <Image src={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'} alt={property.title} width={600} height={400} loading="lazy" />
            <button
              className={`btn-fav-simple ${favorites.has(property.id) ? 'active' : ''}`}
              aria-label="Guardar"
              onClick={(e) => { e.preventDefault(); toggleFavorite(property.id) }}
            >
              <FavouriteIcon size={18} />
            </button>
            {badge && (
              <div className={`absolute top-3 left-3 px-3 py-1.5 ${badge.bg} text-white text-xs font-semibold rounded-lg`}>
                {badge.label}
              </div>
            )}
          </div>
          <div className="property-info-simple">
            <div className="property-header-simple">
              <h4 className="property-title-simple">{property.title}</h4>
              <div className="property-rating-simple">
                <StarIcon size={11} className="text-gray-900" /><span>4.8</span>
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
  )
}

export function HomeClientDesktop({ properties, stats, cityCounts }: HomeClientProps) {
  const t = useTranslations('home')
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'es'
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleProperties, setVisibleProperties] = useState(properties)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      router.push(`/${locale}/propiedades?q=${encodeURIComponent(q)}`)
    } else {
      router.push(`/${locale}/propiedades`)
    }
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleQuickFilter = (value: string) => {
    const routes: Record<string, string> = {
      HABITACION:   `/${locale}/propiedades?type=HABITACION`,
      DEPARTAMENTO: `/${locale}/propiedades?type=DEPARTAMENTO`,
      wifi:         `/${locale}/propiedades`,
      AMOBLADO:     `/${locale}/propiedades?condition=AMOBLADO`,
    }
    router.push(routes[value] ?? `/${locale}/propiedades`)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') }),
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
      const typeRoutes: Record<string, string> = {
        habitacion:   `/${locale}/propiedades?type=HABITACION`,
        departamento: `/${locale}/propiedades?type=DEPARTAMENTO`,
        casa:         `/${locale}/propiedades?type=CASA`,
        amoblado:     `/${locale}/propiedades?condition=AMOBLADO`,
      }
      router.push(typeRoutes[filter] ?? `/${locale}/propiedades`)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="pt-[112px] pb-20 min-h-[85vh] flex items-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}
      >
        <div className="absolute top-[-5%] right-[-3%] size-[500px] rounded-full z-0 blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full z-0 blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-10 w-full relative z-[1]">
          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-100 border border-gray-200 rounded-lg mb-5">
                <span className="text-xs font-semibold text-gray-500 tracking-wide">{t('hero.badge')}</span>
              </div>

              <h1
                className="font-extrabold text-[#151c26] leading-[1.15] mb-5 tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
              >
                {t('hero.title')}
              </h1>

              <p className="text-lg text-gray-500 leading-[1.8] mb-10 max-w-[540px]">{t('hero.subtitle')}</p>

              {/* Search Box */}
              <div className="bg-white rounded-2xl p-2 shadow-[0_4px_24px_rgba(15,52,87,0.12)] mb-6 border border-gray-200 max-w-[680px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-transparent transition-all hover:bg-white hover:border-gray-200">
                    <Search01Icon size={20} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      placeholder={t('hero.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="flex-1 border-none outline-none text-[0.95rem] text-[#151c26] bg-transparent font-normal"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="py-3.5 px-7 text-white border-none rounded-xl text-[0.95rem] font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(15,52,87,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
                  >
                    {t('hero.searchButton')}
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[0.8rem] text-gray-400 font-medium">{t('hero.filters')}:</span>
                {[
                  { value: 'HABITACION', labelKey: 'filters.room', Icon: BedIcon },
                  { value: 'DEPARTAMENTO', labelKey: 'filters.apartment', Icon: Building03Icon },
                  { value: 'wifi', labelKey: 'filters.wifi', Icon: Wifi01Icon },
                  { value: 'AMOBLADO', labelKey: 'filters.furnished', Icon: Sofa01Icon }
                ].map((filter, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickFilter(filter.value)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] font-medium text-gray-500 cursor-pointer transition-all hover:bg-accent hover:text-white hover:border-accent"
                  >
                    <filter.Icon size={14} />
                    {t(filter.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[600px] flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full z-0"
                style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.04) 0%, rgba(143,130,114,0.06) 100%)' }} />

              {/* Price card */}
              <div className="absolute top-[10%] right-[10%] px-6 py-4 bg-white rounded-xl shadow-[0_8px_24px_rgba(15,52,87,0.12)] z-[2] border border-gray-50">
                <div className="text-xs text-gray-400 mb-1 font-medium">{t('hero.from')}</div>
                <div className="text-2xl font-extrabold text-accent">
                  S/ {stats.minPrice.toLocaleString()}
                  <span className="text-sm font-semibold text-gray-500">{t('hero.perMonth')}</span>
                </div>
              </div>

              {/* Available count */}
              <div className="absolute bottom-[15%] left-[5%] px-5 py-3 bg-accent rounded-[10px] shadow-[0_8px_24px_rgba(15,52,87,0.25)] z-[2]">
                <div className="text-sm text-white font-semibold flex items-center gap-2">
                  <div className="size-2 rounded-full bg-brown" />
                  {stats.availableCount} {stats.availableCount === 1 ? t('hero.propertyAvailable') : t('hero.propertiesAvailable')}
                </div>
              </div>

              <div className="relative z-[1] w-full max-w-[650px]">
                <Image
                  src="/imagehero.webp"
                  alt="Habitación moderna"
                  width={650}
                  height={550}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(15,52,87,0.15)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="mb-10">
            <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#151c26] mb-3">{t('featured.title')}</h2>
            <p className="text-base text-gray-500 max-w-[600px]">{t('featured.subtitle')}</p>
          </div>

          <div className="flex gap-2.5 mb-8 flex-wrap border-b border-gray-100 pb-4">
            {[
              { key: 'all', label: t('featured.filterAll') },
              { key: 'habitacion', label: t('featured.filterRooms') },
              { key: 'departamento', label: t('featured.filterApartments') },
              { key: 'casa', label: t('featured.filterHouses') },
              { key: 'amoblado', label: t('featured.filterFurnished') },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => handleFilter(key)} className={filterBtn(activeFilter === key)}>
                {label}
              </button>
            ))}
          </div>

          <PropertyCardGrid properties={visibleProperties} favorites={favorites} toggleFavorite={toggleFavorite} t={t} />

          <div className="text-center mt-12">
            <Link href="/propiedades"
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-transparent border-[1.5px] border-accent rounded-xl text-[0.9rem] font-semibold text-accent no-underline transition-all hover:bg-accent hover:text-white"
            >
              <ArrowRightDoubleIcon size={20} /> {t('featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-[100px] relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)' }}
      >
        <div className="absolute top-[10%] right-[-5%] size-[400px] rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.1) 0%, transparent 70%)' }} />

        <div className="max-w-[1200px] mx-auto px-10 relative z-[1]">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2 rounded-full border border-brown/20 mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)' }}>
              <span className="text-xs font-bold text-accent tracking-[0.1em] uppercase">Proceso Simple</span>
            </div>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-[#151c26] mb-4 tracking-tight">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-500 max-w-[600px] mx-auto leading-[1.7]">
              Encuentra tu hogar ideal en 3 simples pasos
            </p>
          </div>

          <div className="grid gap-10 relative" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <div className="absolute top-20 left-[25%] right-[25%] h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)' }} />

            {[
              {
                num: '1', title: 'Busca y filtra',
                desc: 'Explora miles de propiedades verificadas. Usa filtros para encontrar exactamente lo que necesitas.',
                numBg: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', numShadow: 'rgba(15,52,87,0.3)',
                iconBg: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                iconBorder: 'rgba(15,52,87,0.1)', icon: <Search01Icon size={40} className="text-accent" />
              },
              {
                num: '2', title: 'Agenda una visita',
                desc: 'Contacta directamente con el arrendador y agenda una visita para conocer la propiedad.',
                numBg: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)', numShadow: 'rgba(143,130,114,0.35)',
                iconBg: 'linear-gradient(135deg, rgba(143,130,114,0.15) 0%, rgba(143,130,114,0.08) 100%)',
                iconBorder: 'rgba(143,130,114,0.2)', icon: <span className="text-[2.5rem]">📅</span>
              },
              {
                num: '3', title: 'Firma y múdate',
                desc: 'Firma tu contrato digital de forma segura y comienza a disfrutar de tu nuevo hogar.',
                numBg: 'linear-gradient(135deg, #d5d0bd 0%, #b8b3a0 100%)', numShadow: 'rgba(213,208,189,0.35)',
                iconBg: 'linear-gradient(135deg, rgba(213,208,189,0.2) 0%, rgba(213,208,189,0.1) 100%)',
                iconBorder: 'rgba(213,208,189,0.3)', icon: <span className="text-[2.5rem]">✍️</span>
              }
            ].map((step, i) => (
              <div key={i}
                className="relative text-center px-6 py-10 bg-white rounded-3xl shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 size-14 rounded-full flex items-center justify-center text-white text-2xl font-extrabold border-4 border-white shadow-[0_8px_24px_var(--shadow)]"
                  style={{ background: step.numBg, boxShadow: `0 8px 24px ${step.numShadow}` }}>
                  {step.num}
                </div>
                <div className="size-24 rounded-3xl flex items-center justify-center mt-8 mb-6 mx-auto border-2"
                  style={{ background: step.iconBg, borderColor: step.iconBorder }}>
                  {step.icon}
                </div>
                <h3 className="text-[1.375rem] font-bold text-[#151c26] mb-3">{step.title}</h3>
                <p className="text-[0.95rem] text-gray-500 leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-[100px] bg-white relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-5%] size-[500px] rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-[1200px] mx-auto px-10 relative z-[1]">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2 rounded-full border border-brown/20 mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(143,130,114,0.12) 0%, rgba(15,52,87,0.08) 100%)' }}>
              <span className="text-xs font-bold text-brown tracking-[0.1em] uppercase">Ventajas</span>
            </div>
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-[#151c26] mb-4 tracking-tight">
              ¿Por qué elegir Habita Perú?
            </h2>
            <p className="text-lg text-gray-500 max-w-[700px] mx-auto leading-[1.7]">
              Ofrecemos la mejor experiencia en alquiler de propiedades con seguridad y confianza
            </p>
          </div>

          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              {
                Icon: SecurityCheckIcon, iconColor: '#008A05', accentColor: 'rgba(0,138,5',
                title: 'Propiedades Verificadas',
                desc: 'Todas las propiedades pasan por un proceso de verificación riguroso para garantizar tu seguridad.',
                hoverBorder: '#008A05', hoverShadow: '0 20px 40px rgba(0,138,5,0.15)'
              },
              {
                Icon: FileValidationIcon, iconColor: '#8f8272', accentColor: 'rgba(143,130,114',
                title: 'Contratos Seguros',
                desc: 'Contratos digitales con validez legal adaptados a la normativa peruana vigente.',
                hoverBorder: '#8f8272', hoverShadow: '0 20px 40px rgba(143,130,114,0.2)'
              },
              {
                Icon: CreditCardIcon, iconColor: '#8f8272', accentColor: 'rgba(213,208,189',
                title: 'Pagos Protegidos',
                desc: 'Sistema de pagos seguro con protección para inquilinos y arrendadores.',
                hoverBorder: '#d5d0bd', hoverShadow: '0 20px 40px rgba(213,208,189,0.25)'
              },
              {
                Icon: CustomerSupportIcon, iconColor: '#0f3457', accentColor: 'rgba(15,52,87',
                title: 'Soporte 24/7',
                desc: 'Equipo de soporte disponible para ayudarte en cualquier momento que lo necesites.',
                hoverBorder: '#0f3457', hoverShadow: '0 20px 40px rgba(15,52,87,0.15)'
              }
            ].map(({ Icon, iconColor, accentColor, title, desc }, i) => (
              <div key={i}
                className="rounded-3xl p-10 border-2 border-gray-100 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-2 group"
                style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)' }}
              >
                <div className="absolute -top-5 -right-5 size-[100px] rounded-full"
                  style={{ background: `radial-gradient(circle, ${accentColor},0.1) 0%, transparent 70%)` }} />
                <div className="size-[72px] rounded-[20px] flex items-center justify-center mb-6 border-2"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor},0.1) 0%, ${accentColor},0.05) 100%)`,
                    borderColor: `${accentColor},0.15)`
                  }}>
                  <Icon size={32} style={{ color: iconColor }} />
                </div>
                <h3 className="text-xl font-bold text-[#151c26] mb-3">{title}</h3>
                <p className="text-[0.95rem] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BY LOCATION */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)' }}>
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#151c26] mb-2">{t('exploreLocation.title')}</h2>
              <p className="text-base text-gray-500">{t('exploreLocation.subtitle')}</p>
            </div>
            <Link href="/propiedades?filter=location"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-accent no-underline transition-all hover:gap-2.5"
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>

          {/* Region pills — quick links to filter by city */}
          <div className="flex flex-wrap gap-3 mb-8">
            {cityCounts.map((loc) => (
              <Link
                key={loc.city}
                href={`/propiedades?district=${encodeURIComponent(loc.city)}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold no-underline transition-all group ${
                  loc.count > 0
                    ? 'border-gray-200 text-[#151c26] hover:border-accent hover:text-accent hover:bg-accent/5'
                    : 'border-gray-100 text-gray-300 cursor-default pointer-events-none'
                }`}
              >
                <span
                  className="size-2 rounded-full"
                  style={{
                    background: loc.count > 0
                      ? 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)'
                      : '#e5e7eb',
                  }}
                />
                {loc.city}
                {loc.count > 0 && (
                  <span className="text-xs text-gray-400 font-normal ml-0.5">
                    ({loc.count})
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA banner */}
          <div
            className="rounded-2xl px-8 py-6 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
          >
            <div>
              <p className="text-white font-extrabold text-lg mb-1">
                Encuentra tu próximo hogar en el Perú
              </p>
              <p className="text-white/70 text-sm">
                {cityCounts.reduce((s, c) => s + c.count, 0)} propiedades disponibles en todo el país
              </p>
            </div>
            <Link
              href="/propiedades"
              className="bg-white text-accent font-bold text-sm px-5 py-2.5 rounded-xl no-underline hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Ver todas →
            </Link>
          </div>
        </div>
      </section>

      {/* STUDENT PROPERTIES */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#151c26] mb-2">{t('studentProperties.title')}</h2>
              <p className="text-base text-gray-500">{t('studentProperties.subtitle')}</p>
            </div>
            <Link href="/propiedades?filter=students"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-accent no-underline transition-all hover:gap-2.5"
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>
          <PropertyCardGrid
            properties={visibleProperties.slice(0, 4)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            t={t}
            badge={{ bg: 'bg-[#008A05]', label: 'Cerca de universidades' }}
          />
        </div>
      </section>

      {/* FULL APARTMENTS */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)' }}>
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#151c26] mb-2">{t('fullApartments.title')}</h2>
              <p className="text-base text-gray-500">{t('fullApartments.subtitle')}</p>
            </div>
            <Link href="/propiedades?type=departamento"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-accent no-underline transition-all hover:gap-2.5"
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>
          <PropertyCardGrid
            properties={properties.filter(p => p.type === 'DEPARTAMENTO').slice(0, 4)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            t={t}
          />
        </div>
      </section>

      {/* BUDGET ROOMS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#151c26] mb-2">{t('budgetRooms.title')}</h2>
              <p className="text-base text-gray-500">{t('budgetRooms.subtitle')}</p>
            </div>
            <Link href="/propiedades?sort=price-asc"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-accent no-underline transition-all hover:gap-2.5"
            >
              Ver todo <ArrowRightDoubleIcon size={18} />
            </Link>
          </div>
          <PropertyCardGrid
            properties={[...properties].sort((a, b) => a.price - b.price).slice(0, 4)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            t={t}
            badge={{ bg: 'bg-brown', label: 'Mejor precio' }}
          />
        </div>
      </section>

      {/* CTA FOR LANDLORDS */}
      <section
        className="py-[100px] relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 50%, #061829 100%)' }}
      >
        <div className="absolute top-[-20%] right-[-10%] size-[600px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.2) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] size-[500px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(213,208,189,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] left-[10%] size-[60px] rounded-full border-[3px] border-brown/40 opacity-60" />
        <div className="absolute bottom-[25%] right-[15%] size-20 rounded-2xl bg-cream/15 rotate-[25deg] opacity-50" />

        <div className="max-w-[1100px] mx-auto px-10 relative z-[1]">
          <div className="bg-white/5 backdrop-blur-[20px] rounded-[32px] p-16 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-between gap-12 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brown/20 border border-brown/40 rounded-full mb-5">
                <div className="size-2 rounded-full bg-brown animate-pulse" />
                <span className="text-xs font-bold text-cream tracking-[0.05em] uppercase">Para Arrendadores</span>
              </div>
              <h2
                className="font-extrabold text-white mb-4 leading-[1.2] tracking-tight"
                style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)' }}
              >
                ¿Tienes una propiedad para alquilar?
              </h2>
              <p className="text-lg text-white/85 leading-[1.7] mb-6">
                Únete a más de{' '}
                <span className="font-bold text-cream">4,800 arrendadores</span>{' '}
                que ya gestionan sus propiedades con Habita Perú.
              </p>
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <div className="text-[2rem] font-extrabold text-white leading-none mb-1.5">98%</div>
                  <div className="text-[0.85rem] text-white/70">Satisfacción</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <div className="text-[2rem] font-extrabold text-white leading-none mb-1.5">15 días</div>
                  <div className="text-[0.85rem] text-white/70">Promedio de alquiler</div>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link href="/publicar"
                className="inline-flex items-center gap-3 py-[18px] px-10 text-white text-base font-bold rounded-2xl no-underline transition-all border-2 border-cream/20 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(143,130,114,0.5)]"
                style={{ background: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)', boxShadow: '0 8px 32px rgba(143,130,114,0.4)' }}
              >
                <PlusSignCircleIcon size={24} />
                Publicar mi propiedad
              </Link>
              <p className="text-[0.8rem] text-white/60 mt-3 text-center">
                ✓ Sin comisiones ocultas · ✓ Publicación gratuita
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
