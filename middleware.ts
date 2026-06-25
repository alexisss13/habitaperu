import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ja', 'ko', 'zh']
const defaultLocale = 'es'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar archivos estáticos, rutas de API y archivos con extensión
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Si son rutas de dashboards directos sin locale, usamos el defaultLocale ('es')
  const isAdminOrDashboard = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/landlord') ||
    pathname.startsWith('/tenant')

  if (isAdminOrDashboard) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', defaultLocale)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  // Verificar si el pathname ya tiene un locale
  const matchedLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (matchedLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', matchedLocale)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  // Si no tiene locale, redirigir a la versión con locale por defecto
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
