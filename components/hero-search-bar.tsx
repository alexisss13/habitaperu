'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search01Icon, Location01Icon } from "hugeicons-react"
import { getAllActiveDistrictsAction } from "@/app/actions/location-actions"
import { UNIVERSITIES } from "@/lib/universities"

type Segment = 'where' | 'type' | 'price' | null

export interface HeroSearchFilters {
  district: string
  universityId: string
  query: string
  type: string
  minPrice: string
  maxPrice: string
}

const PROPERTY_TYPES = [
  { value: '', label: 'Cualquier tipo' },
  { value: 'HABITACION', label: 'Habitación' },
  { value: 'DEPARTAMENTO', label: 'Departamento' },
  { value: 'CASA', label: 'Casa' },
]

// Solo dígitos: evita negativos, decimales y cualquier otro caracter en los
// campos de precio (el atributo HTML `min` no bloquea el tecleo).
const sanitizeDigits = (value: string) => value.replace(/[^0-9]/g, '')

interface HeroSearchBarProps {
  locale: string
  compact?: boolean
  initialDistrict?: string
  initialUniversityId?: string
  initialQuery?: string
  initialType?: string
  initialMinPrice?: string
  initialMaxPrice?: string
  /** Si se pasa, se llama en vez de navegar (para filtrar in-place en /propiedades). */
  onSearch?: (filters: HeroSearchFilters) => void
}

export function HeroSearchBar({
  locale,
  compact = false,
  initialDistrict = '',
  initialUniversityId = '',
  initialQuery = '',
  initialType = '',
  initialMinPrice = '',
  initialMaxPrice = '',
  onSearch,
}: HeroSearchBarProps) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Segment>(null)

  const [whereQuery, setWhereQuery] = useState(initialDistrict || initialQuery)
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict)
  const [selectedUniversityId, setSelectedUniversityId] = useState(initialUniversityId)
  const [districts, setDistricts] = useState<string[]>([])
  const [districtsLoading, setDistrictsLoading] = useState(true)

  const [propertyType, setPropertyType] = useState(initialType)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)

  useEffect(() => {
    getAllActiveDistrictsAction()
      .then(setDistricts)
      .catch(() => setDistricts([]))
      .finally(() => setDistrictsLoading(false))
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const q = whereQuery.trim().toLowerCase()
  const filteredDistricts = districts.filter((d) => d.toLowerCase().includes(q)).slice(0, 6)
  const filteredUniversities = UNIVERSITIES.filter(
    (u) => u.name.toLowerCase().includes(q) || u.shortName.toLowerCase().includes(q)
  ).slice(0, 6)

  const typeLabel = PROPERTY_TYPES.find((t) => t.value === propertyType)?.label ?? 'Cualquier tipo'
  const priceLabel = minPrice || maxPrice
    ? `S/ ${minPrice || '0'} - ${maxPrice || '∞'}`
    : 'Rango de precio'

  const pickDistrict = (d: string) => {
    setSelectedDistrict(d)
    setSelectedUniversityId("")
    setWhereQuery(d)
    setOpen('type')
  }

  const pickUniversity = (id: string, shortName: string) => {
    setSelectedUniversityId(id)
    setSelectedDistrict("")
    setWhereQuery(shortName)
    setOpen('type')
  }

  const handleSearch = () => {
    const filters: HeroSearchFilters = {
      district: selectedDistrict,
      universityId: selectedUniversityId,
      query: !selectedDistrict && !selectedUniversityId ? whereQuery.trim() : '',
      type: propertyType,
      minPrice,
      maxPrice,
    }

    if (onSearch) {
      onSearch(filters)
      setOpen(null)
      return
    }

    const params = new URLSearchParams()
    if (filters.district) params.set('district', filters.district)
    if (filters.universityId) params.set('university', filters.universityId)
    if (filters.query) params.set('q', filters.query)
    if (filters.type) params.set('type', filters.type)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    const qs = params.toString()
    router.push(`/${locale}/propiedades${qs ? `?${qs}` : ''}`)
    setOpen(null)
  }

  const py = compact ? 'py-2' : 'py-2.5'
  const segmentClass = (segment: Segment) =>
    `flex-1 min-w-0 text-left px-5 ${py} rounded-full cursor-pointer transition-colors border-0 bg-transparent ${
      open === segment ? 'bg-gray-100' : 'hover:bg-gray-50'
    }`

  return (
    <div
      ref={rootRef}
      className="relative bg-white rounded-[100px] p-1.5 shadow-[0_4px_24px_rgba(15,52,87,0.12)] border border-gray-200 max-w-[680px] flex-1 min-w-[420px]"
    >
      <div className="flex items-stretch">
        {open === 'where' ? (
          <div className={`${segmentClass('where')} cursor-text`}>
            <span className="block text-[0.7rem] font-bold text-[#151c26]">Dónde</span>
            <input
              type="text"
              autoFocus
              value={whereQuery}
              onChange={(e) => { setWhereQuery(e.target.value); setSelectedDistrict(""); setSelectedUniversityId("") }}
              placeholder="Explora distritos"
              className="block w-full bg-transparent border-0 outline-none p-0 text-[0.8rem] text-[#151c26] font-medium placeholder:text-gray-500"
            />
          </div>
        ) : (
          <button type="button" onClick={() => setOpen('where')} className={segmentClass('where')}>
            <span className="block text-[0.7rem] font-bold text-[#151c26]">Dónde</span>
            <span className="block text-[0.8rem] text-gray-500 truncate">{whereQuery || 'Explora distritos'}</span>
          </button>
        )}

        <div className="w-px bg-gray-200 my-2 shrink-0" />

        <button type="button" onClick={() => setOpen(open === 'type' ? null : 'type')} className={segmentClass('type')}>
          <span className="block text-[0.7rem] font-bold text-[#151c26]">Tipo</span>
          <span className="block text-[0.8rem] text-gray-500 truncate">{typeLabel}</span>
        </button>

        <div className="w-px bg-gray-200 my-2 shrink-0" />

        <button type="button" onClick={() => setOpen(open === 'price' ? null : 'price')} className={segmentClass('price')}>
          <span className="block text-[0.7rem] font-bold text-[#151c26]">Precio</span>
          <span className="block text-[0.8rem] text-gray-500 truncate">{priceLabel}</span>
        </button>

        <button
          type="button"
          onClick={handleSearch}
          aria-label="Buscar"
          className="shrink-0 size-11 my-auto mr-1 rounded-full flex items-center justify-center text-white cursor-pointer border-0 transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
        >
          <Search01Icon size={18} />
        </button>
      </div>

      {open === 'where' && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full max-w-[420px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-4 z-[60]">
          <div className="max-h-72 overflow-y-auto">
            {districtsLoading ? (
              <p className="text-xs text-gray-400 px-1 py-2">Cargando distritos…</p>
            ) : filteredDistricts.length === 0 && filteredUniversities.length === 0 ? (
              <p className="text-xs text-gray-400 px-1 py-2">Sin resultados para &ldquo;{whereQuery}&rdquo;.</p>
            ) : (
              <>
                {filteredDistricts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wide px-1 mb-1.5">Distritos</p>
                    {filteredDistricts.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => pickDistrict(d)}
                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left hover:bg-gray-50 cursor-pointer border-0 bg-transparent"
                      >
                        <Location01Icon size={16} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-[#151c26]">{d}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredUniversities.length > 0 && (
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wide px-1 mb-1.5">Universidades</p>
                    {filteredUniversities.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => pickUniversity(u.id, u.shortName)}
                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left hover:bg-gray-50 cursor-pointer border-0 bg-transparent"
                      >
                        <span className="size-8 rounded-full bg-accent/10 text-accent text-[0.6rem] font-bold flex items-center justify-center shrink-0">
                          {u.shortName.slice(0, 4)}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-medium text-[#151c26] truncate">{u.name}</span>
                          <span className="block text-[0.7rem] text-gray-400">{u.city}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {open === 'type' && (
        <div className="absolute top-[calc(100%+10px)] left-[35%] w-[260px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-2 z-[60]">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value || 'any'}
              type="button"
              onClick={() => { setPropertyType(t.value); setOpen('price') }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors border-0 ${
                propertyType === t.value ? 'bg-accent/5 text-accent font-bold' : 'bg-transparent hover:bg-gray-50 text-[#151c26]'
              }`}
            >
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {open === 'price' && (
        <div className="absolute top-[calc(100%+10px)] right-2 w-[300px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,52,87,0.18)] border border-gray-100 p-4 z-[60]">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Rango mensual (S/)</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[0.65rem] text-gray-400 mb-1">Desde</label>
              <input
                type="text"
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(sanitizeDigits(e.target.value))}
                placeholder="0"
                className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-accent focus:outline-none"
              />
            </div>
            <div className="text-gray-300 mt-4">—</div>
            <div className="flex-1">
              <label className="block text-[0.65rem] text-gray-400 mb-1">Hasta</label>
              <input
                type="text"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(sanitizeDigits(e.target.value))}
                placeholder="Sin límite"
                className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="w-full mt-4 h-11 rounded-xl text-white text-sm font-bold cursor-pointer border-0"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
          >
            Buscar
          </button>
        </div>
      )}
    </div>
  )
}
