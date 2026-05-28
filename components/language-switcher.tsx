'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe02Icon, Cancel01Icon, Tick02Icon } from 'hugeicons-react'
import { localeMap } from '@/lib/i18n'

interface Language {
  code: string
  nativeName: string
  region?: string
  countryCode: string
}

interface LanguageGroup {
  title: string
  languages: Language[]
}

const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    title: 'Idiomas y regiones sugeridos',
    languages: [
      { code: 'es-PE', nativeName: 'Español', region: 'Perú',           countryCode: 'pe' },
      { code: 'es-MX', nativeName: 'Español', region: 'México',         countryCode: 'mx' },
      { code: 'es-ES', nativeName: 'Español', region: 'España',         countryCode: 'es' },
      { code: 'en-US', nativeName: 'English', region: 'United States',  countryCode: 'us' },
      { code: 'en-GB', nativeName: 'English', region: 'United Kingdom', countryCode: 'gb' },
    ],
  },
  {
    title: 'Más idiomas y regiones',
    languages: [
      { code: 'es-AR', nativeName: 'Español',    region: 'Argentina',   countryCode: 'ar' },
      { code: 'es-CL', nativeName: 'Español',    region: 'Chile',       countryCode: 'cl' },
      { code: 'es-CO', nativeName: 'Español',    region: 'Colombia',    countryCode: 'co' },
      { code: 'pt-BR', nativeName: 'Português',  region: 'Brasil',      countryCode: 'br' },
      { code: 'en-CA', nativeName: 'English',    region: 'Canada',      countryCode: 'ca' },
      { code: 'en-AU', nativeName: 'English',    region: 'Australia',   countryCode: 'au' },
      { code: 'fr-FR', nativeName: 'Français',   region: 'France',      countryCode: 'fr' },
      { code: 'de-DE', nativeName: 'Deutsch',    region: 'Deutschland', countryCode: 'de' },
      { code: 'it-IT', nativeName: 'Italiano',   region: 'Italia',      countryCode: 'it' },
      { code: 'ja-JP', nativeName: '日本語',      region: '日本',        countryCode: 'jp' },
      { code: 'ko-KR', nativeName: '한국어',      region: '대한민국',    countryCode: 'kr' },
      { code: 'zh-CN', nativeName: '简体中文',    region: '中国',        countryCode: 'cn' },
    ],
  },
]

interface LanguageSwitcherProps {
  onLanguageChange?: (languageCode: string) => void
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('es-PE')
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language')
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('habitaperu_language')
    if (saved) setSelectedLanguage(saved)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem('habitaperu_language', languageCode)
    const locale = localeMap[languageCode] || 'es'
    if (onLanguageChange) onLanguageChange(languageCode)

    const pathnameWithoutLocale =
      pathname.replace(/^\/(es|en|pt|fr|de|it|ja|ko|zh)/, '') || '/'
    const newPath = `/${locale}${pathnameWithoutLocale}`
    router.push(newPath)
    setTimeout(() => setIsOpen(false), 200)
  }

  const selectedLang =
    LANGUAGE_GROUPS.flatMap(g => g.languages).find(l => l.code === selectedLanguage)

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-transparent border-none text-[#151c26] cursor-pointer transition-colors hover:bg-gray-100"
        aria-label="Cambiar idioma"
      >
        {selectedLang && (
          <img
            src={`https://flagcdn.com/w40/${selectedLang.countryCode}.png`}
            alt={selectedLang.region ?? selectedLang.nativeName}
            className="w-5 h-[15px] rounded-[2px] object-cover shrink-0"
            style={{ minWidth: '20px' }}
          />
        )}
        <Globe02Icon size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-[740px] max-h-[88vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            style={{ animation: 'langSlideUp 0.25s ease' }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-0 flex items-center justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <Cancel01Icon size={16} className="text-[#151c26]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-6 border-b border-gray-200 mt-2">
              {(['language', 'currency'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 bg-transparent border-none text-[0.9rem] font-semibold cursor-pointer transition-colors relative ${
                    activeTab === tab ? 'text-[#151c26]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'language' ? 'Idioma y región' : 'Moneda'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#151c26] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeTab === 'language' ? (
                LANGUAGE_GROUPS.map((group, gi) => (
                  <div key={gi} className={gi > 0 ? 'mt-7' : ''}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      {group.title}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.languages.map((lang) => {
                        const isSelected = selectedLanguage === lang.code
                        return (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-accent/5 border-accent'
                                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          >
                            {/* Flag — fixed size via CSS class, not HTML attribute */}
                            <img
                              src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                              alt={lang.region ?? lang.nativeName}
                              className="w-[30px] h-[22px] rounded-[3px] object-cover shrink-0"
                              style={{ minWidth: '30px' }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#151c26] leading-none mb-0.5 truncate">
                                {lang.nativeName}
                              </p>
                              {lang.region && (
                                <p className="text-xs text-gray-400 truncate">{lang.region}</p>
                              )}
                            </div>
                            {isSelected && (
                              <Tick02Icon size={14} className="text-accent shrink-0" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Próximamente
                  </p>
                  <p className="text-xs">
                    Todos los precios se muestran en Soles Peruanos (S/)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes langSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
