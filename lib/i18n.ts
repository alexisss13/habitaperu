// Custom i18n implementation without external dependencies

export const locales = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ja', 'ko', 'zh'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'

// Mapeo de códigos completos a códigos de idioma
export const localeMap: Record<string, Locale> = {
  'es-PE': 'es',
  'es-MX': 'es',
  'es-ES': 'es',
  'es-AR': 'es',
  'es-CL': 'es',
  'es-CO': 'es',
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'en-AU': 'en',
  'pt-BR': 'pt',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'zh-CN': 'zh',
}

// Cargar mensajes para un locale específico
export async function getMessages(locale: Locale) {
  try {
    const messages = await import(`@/messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback a español si falla
    const fallback = await import(`@/messages/${defaultLocale}.json`)
    return fallback.default
  }
}

// Validar si un locale es válido
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Obtener locale desde parámetros o usar default
export function getLocaleFromParams(locale?: string): Locale {
  if (locale && isValidLocale(locale)) {
    return locale
  }
  return defaultLocale
}
