'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from '@/lib/i18n-context'
import {
  SecurityCheckIcon,
  FileValidationIcon,
  DashboardSquare02Icon,
  UserMultiple02Icon,
  UserAdd02Icon,
  Home01Icon,
  CheckmarkCircle01Icon,
  StarIcon,
  RocketIcon,
  PlayCircleIcon,
  ArrowRight01Icon
} from 'hugeicons-react'

const sectionBadge = (text: string) => (
  <div
    className="inline-block px-5 py-2 rounded-[100px] mb-4 border border-[rgba(143,130,114,0.2)]"
    style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)' }}
  >
    <span className="text-xs font-bold text-accent tracking-[0.1em] uppercase">{text}</span>
  </div>
)

export function PublishClient() {
  const t = useTranslations('publish')
  const locale = useLocale()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') }) },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="pt-[112px] pb-20 min-h-[85vh] flex items-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}
      >
        <div className="absolute top-[-5%] right-[-3%] size-[500px] rounded-full z-0 blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full z-0 blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-10 w-full relative z-[1]">
          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-100 border border-gray-200 rounded-lg mb-5">
                <SecurityCheckIcon size={14} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-500 tracking-wide">{t('hero.badge')}</span>
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-[#151c26] leading-[1.15] mb-5 -tracking-[0.02em]">
                {t('hero.title')}
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {t('hero.titleAccent')}
                </span>
              </h1>

              <p className="text-lg text-gray-500 leading-[1.8] mb-10 max-w-[540px]">
                {t('hero.subtitle')}
              </p>

              <div className="flex gap-4 mb-10 flex-wrap">
                <Link
                  href={`/${locale}/register`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-white rounded-xl text-base font-semibold no-underline transition-all shadow-[0_4px_16px_rgba(15,52,87,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,52,87,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
                >
                  <RocketIcon size={20} />
                  {t('hero.startButton')}
                </Link>
                <button className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent text-accent border border-gray-200 rounded-xl text-base font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:border-accent">
                  <PlayCircleIcon size={20} />
                  {t('hero.watchVideo')}
                </button>
              </div>

              <div className="flex gap-8 pt-6 border-t border-gray-200 flex-wrap">
                <div>
                  <div className="text-[1.75rem] font-extrabold text-accent mb-1">{(4800).toLocaleString(locale)}</div>
                  <div className="text-sm text-gray-500 font-medium">{t('hero.stats.properties')}</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <div className="text-[1.75rem] font-extrabold text-accent mb-1">98%</div>
                  <div className="text-sm text-gray-500 font-medium">{t('hero.stats.contracts')}</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <div className="text-[1.75rem] font-extrabold text-accent mb-1">{(12000).toLocaleString(locale)}</div>
                  <div className="text-sm text-gray-500 font-medium">{t('hero.stats.tenants')}</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[600px] flex items-center justify-center">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full z-0"
                style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.04) 0%, rgba(143,130,114,0.06) 100%)' }}
              />
              <div className="relative z-[1] w-full max-w-[650px]">
                <Image
                  src="/imagehero.webp"
                  alt="Dashboard de arrendador"
                  width={650}
                  height={550}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(15,52,87,0.15)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="text-center mb-16">
            {sectionBadge(t('features.badge'))}
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-[#151c26] mb-4 -tracking-[0.02em]">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            {/* KYC */}
            <div className="fade-in p-8 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]">
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)' }}>
                <SecurityCheckIcon size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#151c26] mb-3">{t('features.kyc.title')}</h3>
              <p className="text-[0.95rem] text-gray-500 leading-[1.7] mb-4">{t('features.kyc.description')}</p>
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent bg-transparent border-none cursor-pointer p-0">
                {t('features.kyc.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>

            {/* Contracts */}
            <div className="fade-in p-8 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]">
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)' }}>
                <FileValidationIcon size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#151c26] mb-3">{t('features.contracts.title')}</h3>
              <p className="text-[0.95rem] text-gray-500 leading-[1.7] mb-4">{t('features.contracts.description')}</p>
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent bg-transparent border-none cursor-pointer p-0">
                {t('features.contracts.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>

            {/* Dashboard */}
            <div className="fade-in p-8 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]">
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.1) 0%, rgba(251,146,60,0.05) 100%)' }}>
                <DashboardSquare02Icon size={32} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-[#151c26] mb-3">{t('features.dashboard.title')}</h3>
              <p className="text-[0.95rem] text-gray-500 leading-[1.7] mb-4">{t('features.dashboard.description')}</p>
              <Link href="/landlord/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent no-underline">
                {t('features.dashboard.link')} <ArrowRight01Icon size={16} />
              </Link>
            </div>

            {/* Matching */}
            <div className="fade-in p-8 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]">
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)' }}>
                <UserMultiple02Icon size={32} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-[#151c26] mb-3">{t('features.matching.title')}</h3>
              <p className="text-[0.95rem] text-gray-500 leading-[1.7] mb-4">{t('features.matching.description')}</p>
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent bg-transparent border-none cursor-pointer p-0">
                {t('features.matching.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO START SECTION */}
      <section
        className="py-[100px] relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)' }}
      >
        <div
          className="absolute top-[10%] right-[-5%] size-[400px] rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.1) 0%, transparent 70%)' }}
        />

        <div className="max-w-[1200px] mx-auto px-10 relative z-[1]">
          <div className="text-center mb-16">
            {sectionBadge(t('howToStart.badge'))}
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-[#151c26] mb-4 -tracking-[0.02em]">
              {t('howToStart.title')}
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 relative">
            <div
              className="absolute top-20 left-1/4 right-1/4 h-0.5 z-0"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)' }}
            />

            {[
              { num: 1, Icon: UserAdd02Icon, titleKey: 'howToStart.step1.title', descKey: 'howToStart.step1.description' },
              { num: 2, Icon: Home01Icon, titleKey: 'howToStart.step2.title', descKey: 'howToStart.step2.description' },
              { num: 3, Icon: CheckmarkCircle01Icon, titleKey: 'howToStart.step3.title', descKey: 'howToStart.step3.description' },
            ].map(({ num, Icon, titleKey, descKey }) => (
              <div
                key={num}
                className="fade-in relative text-center p-10 px-6 bg-white rounded-3xl shadow-[0_4px_20px_rgba(15,52,87,0.08)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]"
              >
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 size-14 text-white rounded-full flex items-center justify-center text-2xl font-extrabold shadow-[0_8px_24px_rgba(15,52,87,0.3)] border-4 border-white z-[1]"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
                >
                  {num}
                </div>
                <div
                  className="size-24 rounded-3xl flex items-center justify-center mx-auto mt-8 mb-6 border-2 border-accent/10"
                  style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)' }}
                >
                  <Icon size={40} className="text-accent" />
                </div>
                <h3 className="text-[1.375rem] font-bold text-[#151c26] mb-3">{t(titleKey)}</h3>
                <p className="text-[0.95rem] text-gray-500 leading-[1.7]">{t(descKey)}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-white rounded-xl text-base font-semibold no-underline transition-all shadow-[0_4px_16px_rgba(15,52,87,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,52,87,0.3)]"
              style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
            >
              <RocketIcon size={20} />
              {t('howToStart.startButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="text-center mb-16">
            {sectionBadge(t('testimonials.badge'))}
            <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-[#151c26] -tracking-[0.02em]">
              {t('testimonials.title')}
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
            {[
              { initials: 'JD', nameKey: 'testimonials.testimonial1.name', textKey: 'testimonials.testimonial1.text', metaKey: 'testimonials.testimonial1.properties' },
              { initials: 'RV', nameKey: 'testimonials.testimonial2.name', textKey: 'testimonials.testimonial2.text', metaKey: 'testimonials.testimonial2.properties' },
              { initials: 'CM', nameKey: 'testimonials.testimonial3.name', textKey: 'testimonials.testimonial3.text', metaKey: 'testimonials.testimonial3.properties' },
            ].map(({ initials, nameKey, textKey, metaKey }) => (
              <div key={initials} className="fade-in p-8 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,52,87,0.08)] border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[0.95rem] text-gray-500 leading-[1.7] mb-5">
                  {'"'}{t(textKey)}{'"'}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)' }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="text-[0.95rem] font-semibold text-[#151c26] mb-0.5">{t(nameKey)}</div>
                    <div className="text-[0.8rem] text-gray-400">{t(metaKey)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}
      >
        <div
          className="absolute top-[-20%] right-[-10%] size-[500px] rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.2) 0%, transparent 70%)' }}
        />
        <div className="max-w-[1000px] mx-auto px-10 text-center relative z-[1]">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 -tracking-[0.02em]">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-white/80 max-w-[700px] mx-auto mb-10">
            {t('cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2.5 px-10 py-[18px] bg-white text-accent rounded-xl text-[1.0625rem] font-bold no-underline transition-all shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
          >
            <RocketIcon size={22} />
            {t('cta.button')}
          </Link>
        </div>
      </section>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
