'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe02Icon, Cancel01Icon, Tick02Icon } from 'hugeicons-react'
import { localeMap } from '@/lib/i18n'

// Definición de idiomas y regiones disponibles
interface Language {
  code: string
  name: string
  nativeName: string
  region?: string
  countryCode: string  // Código de país para la bandera (ISO 3166-1 alpha-2)
}

interface LanguageGroup {
  title: string
  languages: Language[]
}

// Configuración de idiomas - Fácilmente escalable
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

  // Cargar idioma guardado del localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('habitaperu_language')
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem('habitaperu_language', languageCode)
    
    // Obtener el locale (código de idioma sin región)
    const locale = localeMap[languageCode] || 'es'
    
    // Callback opcional para manejar el cambio de idioma
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }

    // Navegar a la nueva ruta con el locale
    // Remover el locale actual del pathname si existe
    const pathnameWithoutLocale = pathname.replace(/^\/(es|en|pt|fr|de|it|ja|ko|zh)/, '') || '/'
    
    // Si el nuevo locale es español (default), no agregar prefijo
    const newPath = locale === 'es' ? pathnameWithoutLocale : `/${locale}${pathnameWithoutLocale}`
    
    router.push(newPath)

    // Cerrar modal después de seleccionar
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const getLanguageDisplay = (code: string) => {
    for (const group of LANGUAGE_GROUPS) {
      const lang = group.languages.find(l => l.code === code)
      if (lang) {
        return lang.region ? `${lang.nativeName} (${lang.region})` : lang.nativeName
      }
    }
    return 'Español (Perú)'
  }

  return (
    <>
      {/* Botón del Globe */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: '#151c26',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        aria-label="Cambiar idioma"
      >
        <Globe02Icon size={20} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {/* Modal Content */}
          <div 
            ref={modalRef}
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 24px 16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Cerrar"
              >
                <Cancel01Icon size={16} style={{ color: '#151c26' }} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '32px',
              padding: '0 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setActiveTab('language')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: activeTab === 'language' ? '#151c26' : '#6b7280',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s'
                }}
              >
                Idioma y región
                {activeTab === 'language' && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#151c26'
                  }} />
                )}
              </button>
              <button
                onClick={() => setActiveTab('currency')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: activeTab === 'currency' ? '#151c26' : '#6b7280',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s'
                }}
              >
                Moneda
                {activeTab === 'currency' && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#151c26'
                  }} />
                )}
              </button>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px'
            }}>
              {activeTab === 'language' ? (
                <>
                  {LANGUAGE_GROUPS.map((group, groupIndex) => (
                    <div key={groupIndex} style={{ marginBottom: '32px' }}>
                      <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#151c26',
                        marginBottom: '16px'
                      }}>
                        {group.title}
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '12px'
                      }}>
                        {group.languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language.code)}
                            style={{
                              padding: '12px 16px',
                              background: selectedLanguage === language.code ? '#f3f4f6' : 'transparent',
                              border: '1px solid',
                              borderColor: selectedLanguage === language.code ? '#0f3457' : '#e5e7eb',
                              borderRadius: '8px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedLanguage !== language.code) {
                                e.currentTarget.style.background = '#f9fafb'
                                e.currentTarget.style.borderColor = '#d1d5db'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedLanguage !== language.code) {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.borderColor = '#e5e7eb'
                              }
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              flex: 1
                            }}>
                              {/* Bandera */}
                              <img
                                src={`https://flagcdn.com/20x15/${language.countryCode}.png`}
                                srcSet={`https://flagcdn.com/40x30/${language.countryCode}.png 2x, https://flagcdn.com/60x45/${language.countryCode}.png 3x`}
                                width="20"
                                height="15"
                                alt={language.region || language.nativeName}
                                style={{
                                  borderRadius: '2px',
                                  flexShrink: 0,
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                  objectFit: 'cover',
                                  minWidth: '20px',
                                  maxWidth: '20px',
                                  minHeight: '15px',
                                  maxHeight: '15px'
                                }}
                              />
                              
                              {/* Texto */}
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  color: '#151c26',
                                  marginBottom: '2px'
                                }}>
                                  {language.nativeName}
                                </div>
                                {language.region && (
                                  <div style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280'
                                  }}>
                                    {language.region}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Check icon */}
                            {selectedLanguage === language.code && (
                              <Tick02Icon size={16} style={{ color: '#0f3457', flexShrink: 0 }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{
                  padding: '40px 0',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <p style={{ fontSize: '0.95rem' }}>
                    Funcionalidad de moneda próximamente
                  </p>
                  <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                    Por ahora, todos los precios se muestran en Soles (S/)
                  </p>
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
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
