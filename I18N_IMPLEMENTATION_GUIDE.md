# Guía de Implementación de Internacionalización (i18n)

## 📋 Resumen

Se ha implementado un sistema completo de internacionalización usando **next-intl**, la librería oficial recomendada para Next.js 14+ con App Router.

## 🎯 Características Implementadas

### ✅ Sistema Completo
1. **9 idiomas soportados:** Español, Inglés, Portugués, Francés, Alemán, Italiano, Japonés, Coreano, Chino
2. **Routing automático:** URLs con prefijo de idioma (ej: `/en/propiedades`)
3. **Detección automática:** Detecta idioma del navegador
4. **Persistencia:** Guarda preferencia en localStorage
5. **Traducciones estructuradas:** Archivos JSON organizados
6. **Language Switcher funcional:** Cambia idioma y navega automáticamente

## 🏗️ Arquitectura

### Estructura de Archivos
```
habita-peru/
├── i18n.ts                           # Configuración principal
├── middleware.ts                     # Middleware de routing
├── next.config.ts                    # Config con plugin next-intl
│
├── messages/                         # Traducciones
│   ├── es.json                       # Español
│   ├── en.json                       # Inglés
│   ├── pt.json                       # Portugués (pendiente)
│   ├── fr.json                       # Francés (pendiente)
│   ├── de.json                       # Alemán (pendiente)
│   ├── it.json                       # Italiano (pendiente)
│   ├── ja.json                       # Japonés (pendiente)
│   ├── ko.json                       # Coreano (pendiente)
│   └── zh.json                       # Chino (pendiente)
│
├── app/
│   ├── [locale]/                     # Layout con locale dinámico
│   │   └── layout.tsx                # Provider de next-intl
│   │
│   └── layout.tsx                    # Layout raíz (sin cambios)
│
└── components/
    └── language-switcher.tsx         # Switcher integrado con routing
```

## 🔧 Configuración

### 1. i18n.ts
```typescript
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ja', 'ko', 'zh']
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

// Mapeo de códigos completos (es-PE) a códigos de idioma (es)
export const localeMap: Record<string, Locale> = {
  'es-PE': 'es',
  'es-MX': 'es',
  'en-US': 'en',
  // ... más mapeos
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
```

### 2. middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'as-needed' // Solo prefijo si no es default
})

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(es|en|pt|fr|de|it|ja|ko|zh)/:path*'
  ]
}
```

### 3. next.config.ts
```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  // ... tu configuración
}

export default withNextIntl(nextConfig)
```

## 📝 Estructura de Traducciones

### messages/es.json
```json
{
  "common": {
    "appName": "Habita Perú",
    "loading": "Cargando...",
    "search": "Buscar"
  },
  "header": {
    "publishProperty": "Publica tu propiedad",
    "login": "Iniciar sesión"
  },
  "home": {
    "hero": {
      "title": "Encuentra tu próximo hogar",
      "searchPlaceholder": "Busca por distrito..."
    }
  }
}
```

### messages/en.json
```json
{
  "common": {
    "appName": "Habita Peru",
    "loading": "Loading...",
    "search": "Search"
  },
  "header": {
    "publishProperty": "List your property",
    "login": "Log in"
  },
  "home": {
    "hero": {
      "title": "Find your next home",
      "searchPlaceholder": "Search by district..."
    }
  }
}
```

## 🎨 Cómo Usar en Componentes

### Server Components
```typescript
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home.hero')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <input placeholder={t('searchPlaceholder')} />
    </div>
  )
}
```

### Client Components
```typescript
'use client'

import { useTranslations } from 'next-intl'

export function SearchBox() {
  const t = useTranslations('common')
  
  return (
    <button>{t('search')}</button>
  )
}
```

### Con Pluralización
```typescript
const t = useTranslations('property')

// En el JSON:
// "room": "{count, plural, =1 {habitación} other {habitaciones}}"

<span>{t('room', { count: 1 })}</span>  // "habitación"
<span>{t('room', { count: 3 })}</span>  // "habitaciones"
```

### Con Variables
```typescript
const t = useTranslations('home.cta')

// En el JSON:
// "subtitle": "Únete a más de {count} arrendadores..."

<p>{t('subtitle', { count: 4800 })}</p>
// "Únete a más de 4800 arrendadores..."
```

## 🔄 Flujo de Cambio de Idioma

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario hace click en bandera en Language Switcher         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  handleLanguageSelect('en-US')                               │
│  1. Guarda en localStorage: 'habitaperu_language'           │
│  2. Mapea 'en-US' → 'en' usando localeMap                   │
│  3. Ejecuta callback opcional                               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  router.push('/en/propiedades')                              │
│  Navega a la nueva URL con prefijo de idioma                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Middleware intercepta la request                            │
│  1. Detecta locale 'en' en la URL                           │
│  2. Carga messages/en.json                                  │
│  3. Pasa al layout                                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  NextIntlClientProvider                                      │
│  Provee traducciones a todos los componentes                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Componentes usan useTranslations()                          │
│  Muestran texto en inglés automáticamente                   │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 URLs Generadas

### Español (default)
```
/                           → Página de inicio
/propiedades                → Listado de propiedades
/propiedades/123            → Detalle de propiedad
/admin/dashboard            → Dashboard admin
```

### Inglés
```
/en                         → Home page
/en/propiedades             → Properties listing
/en/propiedades/123         → Property detail
/en/admin/dashboard         → Admin dashboard
```

### Otros idiomas
```
/pt/propiedades             → Português
/fr/propiedades             → Français
/de/propiedades             → Deutsch
/it/propiedades             → Italiano
/ja/propiedades             → 日本語
/ko/propiedades             → 한국어
/zh/propiedades             → 中文
```

## 📈 Próximos Pasos

### 1. Completar Traducciones
Crear archivos JSON para los idiomas restantes:
- [ ] `messages/pt.json` (Portugués)
- [ ] `messages/fr.json` (Francés)
- [ ] `messages/de.json` (Alemán)
- [ ] `messages/it.json` (Italiano)
- [ ] `messages/ja.json` (Japonés)
- [ ] `messages/ko.json` (Coreano)
- [ ] `messages/zh.json` (Chino)

### 2. Migrar Componentes
Reemplazar texto hardcodeado con `useTranslations()`:
- [ ] Header
- [ ] Footer
- [ ] Home page (hero, features, CTA)
- [ ] Property cards
- [ ] Admin panel
- [ ] Forms (login, register)

### 3. Agregar Más Traducciones
Expandir archivos JSON con:
- [ ] Mensajes de error
- [ ] Validaciones de formularios
- [ ] Tooltips y ayudas
- [ ] Emails y notificaciones

## 🔧 Comandos Útiles

### Agregar Nuevo Idioma

#### Paso 1: Agregar a i18n.ts
```typescript
export const locales = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ru'] // + 'ru'
```

#### Paso 2: Crear archivo de traducciones
```bash
# Copiar español como base
cp messages/es.json messages/ru.json
```

#### Paso 3: Traducir contenido
Editar `messages/ru.json` con las traducciones en ruso

#### Paso 4: Actualizar middleware
```typescript
matcher: [
  '/((?!api|_next|_vercel|.*\\..*).*)',
  '/(es|en|pt|fr|de|it|ja|ko|zh|ru)/:path*' // + ru
]
```

#### Paso 5: Agregar a Language Switcher
```typescript
{
  code: 'ru-RU',
  name: 'Russian',
  nativeName: 'Русский',
  region: 'Россия',
  countryCode: 'ru'
}
```

## 🧪 Testing

### Probar Cambio de Idioma
1. Abrir la aplicación en `/`
2. Click en icono 🌐
3. Seleccionar "English (United States)"
4. Verificar que la URL cambia a `/en`
5. Verificar que el contenido está en inglés

### Probar Detección Automática
1. Cambiar idioma del navegador a inglés
2. Abrir la aplicación en modo incógnito
3. Verificar que automáticamente redirige a `/en`

### Probar Persistencia
1. Seleccionar un idioma
2. Recargar la página
3. Verificar que mantiene el idioma seleccionado

## 📚 Recursos

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

## 🎯 Ejemplo Completo de Migración

### Antes (Hardcoded)
```typescript
export function Header() {
  return (
    <header>
      <Link href="/publicar">
        Publica tu propiedad
      </Link>
      <button>Iniciar sesión</button>
    </header>
  )
}
```

### Después (Con i18n)
```typescript
'use client'

import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('header')
  
  return (
    <header>
      <Link href="/publicar">
        {t('publishProperty')}
      </Link>
      <button>{t('login')}</button>
    </header>
  )
}
```

### JSON
```json
{
  "header": {
    "publishProperty": "Publica tu propiedad",  // es.json
    "publishProperty": "List your property",    // en.json
    "login": "Iniciar sesión",                  // es.json
    "login": "Log in"                           // en.json
  }
}
```

---

**Implementado por:** Kiro AI  
**Fecha:** Mayo 2026  
**Estado:** ✅ Base Implementada  
**Librería:** next-intl v3.x  
**Idiomas:** 9 soportados (2 traducidos, 7 pendientes)
