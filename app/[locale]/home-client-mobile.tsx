'use client'

import { useEffect, useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { useTranslations } from '@/lib/i18n-context'
import {
  Search01Icon, FavouriteIcon, StarIcon, Home01Icon,
  BedIcon, Building03Icon, Sofa01Icon,
  SecurityCheckIcon, FileValidationIcon, CreditCardIcon, CustomerSupportIcon,
  PlusSignCircleIcon, ArrowRight01Icon, UserCircleIcon, Location01Icon,
} from 'hugeicons-react'
import { useAuthModal } from '@/components/auth/auth-modal-provider'

interface Property {
  id: string; title: string; type: string; condition: string; district: string
  price: number; images: string[]; favorites: number; rooms: number
  bathrooms: number; area: number; avgRating: number; reviewCount: number
  amenities: string[]; tenantProfile: string[]
}
interface PropertyStats { minPrice: number; availableCount: number }
interface LandlordStats { landlordCount: number; avgRating: number; contractCount: number }
interface Props {
  properties: Property[]
  stats: PropertyStats
  landlordStats: LandlordStats
}

/* ─── Mini property card (horizontal scroll) ─────────────────── */
function PropCard({
  property, favorited, onFav, badge,
}: {
  property: Property; favorited: boolean; onFav: (id: string) => void; badge?: string
}) {
  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="no-underline flex-shrink-0 w-[200px] rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col"
    >
      <div className="relative h-[120px] bg-gray-100 flex-shrink-0">
        <Image
          src={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
          sizes="200px"
        />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFav(property.id) }}
          className={`absolute top-2 right-2 size-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-all shadow-sm
            ${favorited ? 'bg-red/10 text-red' : 'bg-white/95 text-gray-400'}`}
        >
          <FavouriteIcon size={13} />
        </button>
        {badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-accent/90 text-white px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-[#151c26] line-clamp-2 leading-snug">{property.title}</p>
        <p className="text-[11px] text-gray-400 flex items-center gap-0.5">
          <Location01Icon size={10} className="text-gray-300 shrink-0" />
          {property.district}
        </p>
        <div className="flex items-center gap-1 mt-auto pt-1">
          {property.reviewCount > 0 ? (
            <>
              <StarIcon size={10} className="text-amber-400 shrink-0" />
              <span className="text-[10px] text-gray-400">{property.avgRating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-[10px] text-gray-400 font-semibold">Nuevo</span>
          )}
          <span className="ml-auto text-sm font-bold text-accent">
            S/{property.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Section header ──────────────────────────────────────────── */
function SecHeader({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-3 px-4">
      <div>
        <h2 className="text-base font-bold text-[#151c26] leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{subtitle}</p>}
      </div>
      <Link href={href} className="text-xs font-semibold text-accent no-underline flex items-center gap-0.5 flex-shrink-0 ml-3">
        Ver todo <ArrowRight01Icon size={12} />
      </Link>
    </div>
  )
}

/* ─── Horizontal scroll container ────────────────────────────── */
function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex gap-3 overflow-x-auto px-4 pb-1"
      style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {children}
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
export function HomeClientMobile({ properties, stats, landlordStats }: Props) {
  const t = useTranslations('home')
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'es'
  const pathname = usePathname()
  const [activeFilter, setActiveFilter] = useState('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const { requireAuth } = useAuthModal()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('habitaperu_favorites')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setFavorites(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  const handleSearch = () => {
    const q = searchQuery.trim()
    router.push(q
      ? `/${locale}/propiedades?q=${encodeURIComponent(q)}`
      : `/${locale}/propiedades`)
  }

  const handleFilterNav = (value: string) => {
    const routes: Record<string, string> = {
      habitacion:   `/${locale}/propiedades?type=HABITACION`,
      departamento: `/${locale}/propiedades?type=DEPARTAMENTO`,
      casa:         `/${locale}/propiedades?type=CASA`,
      amoblado:     `/${locale}/propiedades?condition=AMOBLADO`,
    }
    router.push(routes[value] ?? `/${locale}/propiedades`)
  }

  const toggleFavorite = (id: string) => {
    requireAuth(() => {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id); else next.add(id)
        try { localStorage.setItem('habitaperu_favorites', JSON.stringify([...next])) } catch {}
        return next
      })
    })
  }

  const studentMatches = properties.filter((p) => p.tenantProfile?.includes('estudiante'))
  const studentProperties = (studentMatches.length > 0 ? studentMatches : properties).slice(0, 6)

  const filtered = properties.filter((p) => {
    if (activeFilter === 'habitacion') return p.type === 'HABITACION'
    if (activeFilter === 'departamento') return p.type === 'DEPARTAMENTO'
    if (activeFilter === 'casa') return p.type === 'CASA'
    if (activeFilter === 'amoblado') return p.condition === 'AMOBLADO'
    return true
  })

  const TABS = [
    { key: 'all', label: 'Todos' },
    { key: 'habitacion', label: 'Habitaciones' },
    { key: 'departamento', label: 'Departamentos' },
    { key: 'casa', label: 'Casas' },
    { key: 'amoblado', label: 'Amoblado' },
  ]

  const FEATURES = [
    { Icon: SecurityCheckIcon, color: '#008A05', bg: '#e6f4e7', title: 'Propiedades Verificadas', desc: 'Verificación rigurosa en cada propiedad.' },
    { Icon: FileValidationIcon, color: '#6d6558', bg: '#f5f3ef', title: 'Contratos Seguros', desc: 'Contratos digitales con validez legal.' },
    { Icon: CreditCardIcon, color: '#0f3457', bg: '#e8edf2', title: 'Pagos Protegidos', desc: 'Sistema de pagos con protección total.' },
    { Icon: CustomerSupportIcon, color: '#0f3457', bg: '#e8edf2', title: 'Soporte 24/7', desc: 'Disponibles para ayudarte siempre.' },
  ]

  const NAV = [
    { label: 'Inicio', Icon: Home01Icon, href: '/' },
    { label: 'Buscar', Icon: Search01Icon, href: '/propiedades' },
    { label: 'Favoritos', Icon: FavouriteIcon, href: '/tenant/favorites' },
    { label: 'Perfil', Icon: UserCircleIcon, href: '/tenant/profile' },
  ]

  return (
    /* pt-14 = exactly the mobile header height (56px = h-14) */
    <div className="min-h-screen bg-gray-50 pb-20 pt-14">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="bg-white px-4 pt-5 pb-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 mb-4">
          <div className="size-1.5 rounded-full bg-accent" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            {t('hero.badge')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[1.625rem] font-extrabold text-[#151c26] leading-[1.2] tracking-tight mb-2">
          {t('hero.title')}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          {t('hero.subtitle')}
        </p>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors">
            <Search01Icon size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleSearch() }}
              placeholder={t('hero.searchPlaceholder')}
              className="flex-1 border-none outline-none text-sm text-[#151c26] bg-transparent placeholder:text-gray-400 min-w-0"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer flex items-center"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', color: '#ffffff' }}
          >
            Buscar
          </button>
        </div>

        {/* Quick filters row */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {[
            { value: 'habitacion', label: 'Habitaciones', Icon: BedIcon },
            { value: 'departamento', label: 'Departamentos', Icon: Building03Icon },
            { value: 'amoblado', label: 'Amoblado', Icon: Sofa01Icon },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterNav(f.value)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all bg-white text-gray-600 border-gray-200 hover:bg-accent hover:text-white hover:border-accent"
            >
              <f.Icon size={13} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-4 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Desde</p>
            <p className="text-xl font-extrabold text-accent leading-none">
              S/ {stats.minPrice.toLocaleString()}
              <span className="text-xs font-medium text-gray-400 ml-0.5">/mes</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-xs font-semibold text-gray-600">
              {stats.availableCount} disponibles
            </span>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROPERTIES ════════════════════════════════ */}
      <section className="bg-white mt-2 pt-5 pb-4">
        <SecHeader
          title={t('featured.title')}
          subtitle={t('featured.subtitle')}
          href="/propiedades"
        />

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 mb-2" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => tab.key === 'all' ? setActiveFilter('all') : handleFilterNav(tab.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all
                ${activeFilter === tab.key
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-gray-500 border-gray-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <HScroll>
          {(filtered.length > 0 ? filtered : properties).slice(0, 8).map((p) => (
            <PropCard key={p.id} property={p} favorited={favorites.has(p.id)} onFav={toggleFavorite} />
          ))}
          <Link
            href="/propiedades"
            className="no-underline flex-shrink-0 w-[140px] rounded-2xl bg-accent/5 border-2 border-accent/20 flex flex-col items-center justify-center gap-3 p-4"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center">
              <ArrowRight01Icon size={20} className="text-accent" />
            </div>
            <span className="text-xs font-bold text-accent text-center leading-snug">Ver todas las propiedades</span>
          </Link>
        </HScroll>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="bg-gray-50 mt-2 pt-5 pb-5 px-4">
        <div className="text-center mb-4">
          <span className="inline-block text-[10px] font-bold text-accent uppercase tracking-[0.1em] px-3 py-1 bg-accent/8 rounded-full mb-2">
            Proceso Simple
          </span>
          <h2 className="text-[1.125rem] font-extrabold text-[#151c26]">¿Cómo funciona?</h2>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              num: '1', title: 'Busca y filtra',
              desc: 'Explora propiedades verificadas con filtros precisos.',
              grad: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
            },
            {
              num: '2', title: 'Agenda una visita',
              desc: 'Contacta al arrendador y conoce la propiedad.',
              grad: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)',
            },
            {
              num: '3', title: 'Firma y múdate',
              desc: 'Firma tu contrato digital con plena validez legal.',
              grad: 'linear-gradient(135deg, #d5d0bd 0%, #b8b3a0 100%)',
            },
          ].map((step) => (
            <div key={step.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center gap-4">
              <div
                className="size-10 rounded-full flex items-center justify-center text-white text-base font-extrabold flex-shrink-0"
                style={{ background: step.grad }}
              >
                {step.num}
              </div>
              <div>
                <p className="font-bold text-[#151c26] text-sm leading-tight mb-0.5">{step.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY HABITA PERÚ ════════════════════════════════════ */}
      <section className="bg-white mt-2 pt-5 pb-5">
        <div className="text-center mb-4 px-4">
          <span className="inline-block text-[10px] font-bold text-[#8f8272] uppercase tracking-[0.1em] px-3 py-1 rounded-full mb-2"
            style={{ background: 'rgba(143,130,114,0.1)' }}>
            Ventajas
          </span>
          <h2 className="text-[1.125rem] font-extrabold text-[#151c26]">¿Por qué elegirnos?</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4">
          {FEATURES.map(({ Icon, color, bg, title, desc }, i) => (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: bg }}>
              <div className="size-9 rounded-xl flex items-center justify-center bg-white/70">
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-xs font-bold text-[#151c26] leading-tight">{title}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STUDENT PROPERTIES ═════════════════════════════════ */}
      <section className="bg-white mt-2 pt-5 pb-4">
        <SecHeader
          title={t('studentProperties.title')}
          subtitle={t('studentProperties.subtitle')}
          href="/propiedades?filter=students"
        />
        <HScroll>
          {studentProperties.map((p) => (
            <PropCard key={p.id} property={p} favorited={favorites.has(p.id)} onFav={toggleFavorite} badge="Para estudiantes" />
          ))}
        </HScroll>
      </section>

      {/* ══ FULL APARTMENTS ════════════════════════════════════ */}
      <section className="bg-gray-50 mt-2 pt-5 pb-4">
        <SecHeader
          title={t('fullApartments.title')}
          subtitle={t('fullApartments.subtitle')}
          href="/propiedades?type=departamento"
        />
        <HScroll>
          {(properties.filter((p) => p.type === 'DEPARTAMENTO').length > 0
            ? properties.filter((p) => p.type === 'DEPARTAMENTO')
            : properties
          ).slice(0, 6).map((p) => (
            <PropCard key={p.id} property={p} favorited={favorites.has(p.id)} onFav={toggleFavorite} />
          ))}
        </HScroll>
      </section>

      {/* ══ BUDGET ROOMS ═══════════════════════════════════════ */}
      <section className="bg-white mt-2 pt-5 pb-4">
        <SecHeader
          title={t('budgetRooms.title')}
          subtitle={t('budgetRooms.subtitle')}
          href="/propiedades?sort=price-asc"
        />
        <HScroll>
          {[...properties].sort((a, b) => a.price - b.price).slice(0, 6).map((p) => (
            <PropCard key={p.id} property={p} favorited={favorites.has(p.id)} onFav={toggleFavorite} badge="Mejor precio" />
          ))}
        </HScroll>
      </section>

      {/* ══ CTA LANDLORDS ══════════════════════════════════════ */}
      <section className="mx-4 my-5 rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0f3457 0%, #061829 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[50px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.3) 0%, transparent 70%)' }} />
        <div className="relative z-[1] px-5 py-7">
          <div className="inline-flex items-center gap-2 bg-[#8f8272]/25 border border-[#8f8272]/40 rounded-full px-3 py-1 mb-4">
            <div className="size-1.5 rounded-full bg-[#d5d0bd] animate-pulse" />
            <span className="text-[10px] font-bold text-[#d5d0bd] uppercase tracking-wider">Para Arrendadores</span>
          </div>

          <h2 className="text-xl font-extrabold text-white leading-[1.25] mb-2">
            ¿Tienes una propiedad para alquilar?
          </h2>
          <p className="text-sm text-white/75 leading-relaxed mb-5">
            Únete a más de{' '}
            <span className="font-bold text-[#d5d0bd]">{landlordStats.landlordCount.toLocaleString()} arrendadores</span>{' '}
            que gestionan sus propiedades.
          </p>

          <div className="flex items-center gap-5 mb-6">
            <div>
              <p className="text-2xl font-extrabold text-white leading-none">
                {landlordStats.avgRating > 0 ? `${landlordStats.avgRating}/5` : '—'}
              </p>
              <p className="text-[11px] text-white/55 mt-0.5">Calificación</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-2xl font-extrabold text-white leading-none">{landlordStats.contractCount}</p>
              <p className="text-[11px] text-white/55 mt-0.5">Contratos activos</p>
            </div>
          </div>

          <Link
            href="/publicar/onboarding"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold no-underline"
            style={{ background: 'linear-gradient(135deg, #8f8272 0%, #6d6558 100%)' }}
          >
            <PlusSignCircleIcon size={17} />
            Publicar mi propiedad
          </Link>
          <p className="text-[11px] text-white/45 text-center mt-2">
            ✓ Sin comisiones ocultas · ✓ Publicación gratuita
          </p>
        </div>
      </section>

      {/* ══ MOBILE FOOTER ══════════════════════════════════════ */}
      <footer className="bg-white border-t border-gray-100 px-4 py-6 mb-2">
        <div className="mb-3">
          <Image src="/habita-logo-horizontal.svg" alt="Habita Perú" width={140} height={38} />
        </div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          La plataforma líder en alquiler de propiedades en Perú con contratos digitales seguros.
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <p className="font-bold text-[#151c26] text-[11px] uppercase tracking-wide mb-1">Inquilinos</p>
            <Link href="/propiedades" className="text-gray-500 no-underline">Buscar propiedades</Link>
            <Link href="/tenant/favorites" className="text-gray-500 no-underline">Mis favoritos</Link>
            <Link href="/tenant/kyc" className="text-gray-500 no-underline">Verificación KYC</Link>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-bold text-[#151c26] text-[11px] uppercase tracking-wide mb-1">Arrendadores</p>
            <Link href="/publicar/onboarding" className="text-gray-500 no-underline">Publicar propiedad</Link>
            <Link href="/landlord/dashboard" className="text-gray-500 no-underline">Mi panel</Link>
            <Link href="/landlord/contracts" className="text-gray-500 no-underline">Contratos</Link>
          </div>
        </div>
        <p className="text-[11px] text-gray-300 text-center mt-5">
          © {new Date().getFullYear()} Habita Perú
        </p>
      </footer>

      {/* ══ BOTTOM NAV ═════════════════════════════════════════ */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50">
        <div className="grid grid-cols-4 h-16">
          {NAV.map(({ label, Icon, href }) => {
            const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors
                  ${active ? 'text-accent' : 'text-gray-400'}`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
