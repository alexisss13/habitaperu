import { ReactNode } from 'react'
import ConditionalLayout from '@/components/conditional-layout'
import { I18nProvider } from '@/lib/i18n-context'
import { getMessages, getLocaleFromParams, type Locale } from '@/lib/i18n'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParams(localeParam) as Locale
  
  // Cargar mensajes para el locale específico
  const messages = await getMessages(locale)

  return (
    <I18nProvider locale={locale} messages={messages}>
      <ConditionalLayout>
        {children}
      </ConditionalLayout>
    </I18nProvider>
  )
}
