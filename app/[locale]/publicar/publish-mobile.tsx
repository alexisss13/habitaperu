'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from '@/lib/i18n-context'
import {
  SecurityCheckIcon, FileValidationIcon, DashboardSquare02Icon,
  UserMultiple02Icon, UserAdd02Icon, Home01Icon, CheckmarkCircle01Icon,
  StarIcon, RocketIcon, ArrowRight01Icon
} from 'hugeicons-react'

const features = [
  { Icon: SecurityCheckIcon, color: 'text-red', bg: 'bg-red/10', key: 'kyc' },
  { Icon: FileValidationIcon, color: 'text-green', bg: 'bg-green/10', key: 'contracts' },
  { Icon: DashboardSquare02Icon, color: 'text-[#fb923c]', bg: 'bg-[rgba(251,146,60,0.1)]', key: 'dashboard' },
  { Icon: UserMultiple02Icon, color: 'text-[#a855f7]', bg: 'bg-[rgba(168,85,247,0.1)]', key: 'matching' },
]

const steps = [
  { Icon: UserAdd02Icon, num: 1, key: 'step1' },
  { Icon: Home01Icon, num: 2, key: 'step2' },
  { Icon: CheckmarkCircle01Icon, num: 3, key: 'step3' },
]

const testimonials = [
  { initials: 'JD', key: 'testimonial1' },
  { initials: 'RV', key: 'testimonial2' },
  { initials: 'CM', key: 'testimonial3' },
]

export function PublishMobile() {
  const t = useTranslations('publish')
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-white pt-[64px]">
      {/* Hero */}
      <section className="px-5 pt-8 pb-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg mb-4">
          <SecurityCheckIcon size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('hero.badge')}</span>
        </div>

        <h1 className="text-3xl font-extrabold text-[#151c26] leading-tight mb-3 tracking-tight">
          {t('hero.title')}
          <br />
          <span className="bg-gradient-to-r from-accent to-brown bg-clip-text text-transparent">
            {t('hero.titleAccent')}
          </span>
        </h1>

        <p className="text-base text-gray-500 leading-relaxed mb-6">{t('hero.subtitle')}</p>

        <div className="flex flex-col gap-3 mb-8">
          <Link href={`/${locale}/publicar/onboarding`}
            className="flex items-center justify-center gap-2 py-4 px-6 text-white font-semibold rounded-xl transition-all no-underline"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}>
            <RocketIcon size={18} />
            {t('hero.startButton')}
          </Link>
          <button className="flex items-center justify-center gap-2 py-4 px-6 text-accent font-semibold rounded-xl border-[1.5px] border-gray-200 bg-transparent">
            {t('hero.watchVideo')}
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          {[
            { value: '4,800', key: 'properties' },
            { value: '98%', key: 'contracts' },
            { value: '12,000', key: 'tenants' },
          ].map((s, i) => (
            <div key={s.key} className={`flex-1 text-center ${i > 0 ? 'border-l border-gray-200' : ''}`}>
              <div className="text-xl font-extrabold text-accent">{s.value}</div>
              <div className="text-[0.65rem] text-gray-500 font-medium leading-tight">{t(`hero.stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-10 bg-white">
        <div className="text-center mb-6">
          <span className="text-[0.65rem] font-bold text-accent uppercase tracking-widest">{t('features.badge')}</span>
          <h2 className="text-2xl font-extrabold text-[#151c26] mt-2 leading-tight">{t('features.title')}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {features.map(({ Icon, color, bg, key }) => (
            <div key={key} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100"
              style={{ boxShadow: '0 4px 20px rgba(15,52,87,0.06)' }}>
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={24} className={color} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#151c26] mb-1">{t(`features.${key}.title`)}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{t(`features.${key}.description`)}</p>
              </div>
              <ArrowRight01Icon size={18} className="text-gray-400 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="px-5 py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-8">
          <span className="text-[0.65rem] font-bold text-accent uppercase tracking-widest">{t('howToStart.badge')}</span>
          <h2 className="text-2xl font-extrabold text-[#151c26] mt-2 leading-tight">{t('howToStart.title')}</h2>
        </div>
        <div className="flex flex-col gap-6">
          {steps.map(({ num, key }) => (
            <div key={key} className="flex items-start gap-5">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}>
                  {num}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#151c26] mb-1">{t(`howToStart.${key}.title`)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(`howToStart.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href={`/${locale}/publicar/onboarding`}
            className="flex items-center justify-center gap-2 py-4 px-6 text-white font-semibold rounded-xl no-underline"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}>
            <RocketIcon size={18} />
            {t('howToStart.startButton')}
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-10 bg-white">
        <div className="text-center mb-6">
          <span className="text-[0.65rem] font-bold text-accent uppercase tracking-widest">{t('testimonials.badge')}</span>
          <h2 className="text-2xl font-extrabold text-[#151c26] mt-2">{t('testimonials.title')}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {testimonials.map(({ initials, key }) => (
            <div key={key} className="p-5 bg-white rounded-2xl border border-gray-100"
              style={{ boxShadow: '0 4px 16px rgba(15,52,87,0.06)' }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <StarIcon key={s} size={14} className="text-[#fbbf24]" />)}
              </div>
               <p className="text-sm text-gray-500 leading-relaxed mb-4">{'"'}{t(`testimonials.${key}.text`)}{'"'}</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}>
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#151c26]">{t(`testimonials.${key}.name`)}</div>
                  <div className="text-xs text-gray-400">{t(`testimonials.${key}.properties`)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-12 text-center"
        style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}>
        <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">{t('cta.title')}</h2>
        <p className="text-sm text-white/75 mb-6 leading-relaxed">{t('cta.subtitle')}</p>
        <Link href={`/${locale}/publicar/onboarding`}
          className="inline-flex items-center gap-2 py-4 px-8 bg-white text-accent font-bold rounded-xl no-underline"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <RocketIcon size={20} />
          {t('cta.button')}
        </Link>
      </section>
    </div>
  )
}
