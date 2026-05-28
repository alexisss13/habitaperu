'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe02Icon, Cancel01Icon, Tick02Icon } from 'hugeicons-react'
import { localeMap } from '@/lib/i18n'

interface Language {
  code: string
  name: string
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
      { code: 'es-PE', name: 'Español', nativeName: 'Español', region: 'Perú', countryCode: 'pe' },
      { code: 'es-MX', name: 'Español', nativeName: 'Español', region: 'México', countryCode: 'mx' },
      { code: 'es-ES', name: 'Español', nativeName: 'Español', region: 'España', countryCode: 'es' },
      { code: 'en-US', name: 'English', nativeName: 'English', region: 'United States', countryCode: 'us' },
      { code: 'en-GB', name: 'English', nativeName: 'English', region: 'United Kingdom', countryCode: 'gb' },
    ]
  },
  {
    title: 'Elige un idioma y una región',
    languages: [
      { code: 'es-AR', name: 'Español', nativeName: 'Español', region: 'Argentina', countryCode: 'ar' },
      { code: 'es-CL', name: 'Español', nativeName: 'Español', region: 'Chile', countryCode: 'cl' },
      { code: 'es-CO', name: 'Español', nativeName: 'Español', region: 'Colombia', countryCode: 'co' },
      { code: 'pt-BR', name: 'Português', nativeName: 'Português', region: 'Brasil', countryCode: 'br' },
      { code: 'en-CA', name: 'English', nativeName: 'English', region: 'Canada', countryCode: 'ca' },
      { code: 'en-AU', name: 'English', nativeName: 'English', region: 'Australia', countryCode: 'au' },
      { code: 'fr-FR', name: 'Français', nativeName: 'Français', region: 'France', countryCode: 'fr' },
      { code: 'de-DE', name: 'Deutsch', nativeName: 'Deutsch', region: 'Deutschland', countryCode: 'de' },
      { code: 'it-IT', name: 'Italiano', nativeName: 'Italiano', region: 'Italia', countryCode: 'it' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', region: '日本', countryCode: 'jp' },
      { code: 'ko-KR', name: 'Korean', nativeName: '한국어', region: '대한민국', countryCode: 'kr' },
      { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', region: '中国', countryCode: 'cn' },
    ]
  }
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
    const savedLanguage = localStorage.getItem('habitaperu_language')
    if (savedLanguage) setSelectedLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
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
    const pathnameWithoutLocale = pathname.replace(/^\/(es|en|pt|fr|de|it|ja|ko|zh)/, '') || '/'
    const newPath = locale === 'es' ? pathnameWithoutLocale : `/${locale}${pathnameWithoutLocale}`
    router.push(newPath)
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="size-10 rounded-full flex items-center justify-center bg-transparent border-none text-[#151c26] cursor-pointer transition-colors hover:bg-gray-100"
        aria-label="Cambiar idioma"
      >
        <Globe02Icon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease]">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-[780px] max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <Cancel01Icon size={16} className="text-[#151c26]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 px-6 border-b border-gray-200">
              {(['language', 'currency'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 bg-transparent border-none text-[0.95rem] font-semibold cursor-pointer transition-colors relative ${activeTab === tab ? 'text-[#151c26]' : 'text-gray-500'}`}
                >
                  {tab === 'language' ? 'Idioma y región' : 'Moneda'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#151c26]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'language' ? (
                <>
                  {LANGUAGE_GROUPS.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-8">
                      <h3 className="text-sm font-semibold text-[#151c26] mb-4">{group.title}</h3>
                      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {group.languages.map((language) => {
                          const isSelected = selectedLanguage === language.code
                          return (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageSelect(language.code)}
                              className={`px-4 py-3 rounded-lg text-left cursor-pointer transition-all flex items-center justify-between gap-3 border
                                ${isSelected
                                  ? 'bg-gray-100 border-accent'
                                  : 'bg-transparent border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                              <div className="flex items-center gap-2.5 flex-1">
                                <img
                                  src={`https://flagcdn.com/20x15/${language.countryCode}.png`}
                                  srcSet={`https://flagcdn.com/40x30/${language.countryCode}.png 2x, https://flagcdn.com/60x45/${language.countryCode}.png 3x`}
                                  width="20"
                                  height="15"
                                  alt={language.region || language.nativeName}
                                  className="rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0 object-cover"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-[#151c26] mb-0.5">{language.nativeName}</div>
                                  {language.region && (
                                    <div className="text-xs text-gray-500">{language.region}</div>
                                  )}
                                </div>
                              </div>
                              {isSelected && <Tick02Icon size={16} className="text-accent shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  <p className="text-[0.95rem]">Funcionalidad de moneda próximamente</p>
                  <p className="text-sm mt-2">Por ahora, todos los precios se muestran en Soles (S/)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
