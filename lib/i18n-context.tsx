'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Locale } from './i18n'

interface I18nContextType {
  locale: Locale
  messages: Record<string, any>
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  locale: Locale
  messages: Record<string, any>
  children: ReactNode
}

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  // Función para obtener traducciones anidadas
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ locale, messages, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations(namespace?: string) {
  const context = useContext(I18nContext)
  
  if (!context) {
    throw new Error('useTranslations must be used within I18nProvider')
  }

  const { t: baseT } = context

  // Si hay namespace, prefijar las claves
  const t = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return baseT(fullKey)
  }

  return t
}

export function useLocale() {
  const context = useContext(I18nContext)
  
  if (!context) {
    throw new Error('useLocale must be used within I18nProvider')
  }

  return context.locale
}
