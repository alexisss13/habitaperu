'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n-context'
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

export function PublishClient() {
  const t = useTranslations('publish')

  useEffect(() => {
    // Fade in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        paddingTop: '102px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          right: '-3%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <SecurityCheckIcon size={14} style={{ color: '#6b7280' }} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  letterSpacing: '0.03em'
                }}>
                  {t('hero.badge')}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: '800',
                color: '#151c26',
                lineHeight: '1.15',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
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
              
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                lineHeight: '1.8',
                marginBottom: '40px',
                maxWidth: '540px'
              }}>
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '40px',
                flexWrap: 'wrap'
              }}>
                <Link href="/register" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(15,52,87,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,52,87,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,52,87,0.2)'
                }}
                >
                  <RocketIcon size={20} />
                  {t('hero.startButton')}
                </Link>

                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#0f3457',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.borderColor = '#0f3457'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
                >
                  <PlayCircleIcon size={20} />
                  {t('hero.watchVideo')}
                </button>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '32px',
                padding: '24px 0',
                borderTop: '1px solid #e5e7eb',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f3457', marginBottom: '4px' }}>
                    4,800
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    {t('hero.stats.properties')}
                  </div>
                </div>
                <div style={{ width: '1px', background: '#e5e7eb' }} />
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f3457', marginBottom: '4px' }}>
                    98%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    {t('hero.stats.contracts')}
                  </div>
                </div>
                <div style={{ width: '1px', background: '#e5e7eb' }} />
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f3457', marginBottom: '4px' }}>
                    12,000
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    {t('hero.stats.tenants')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div style={{
              position: 'relative',
              height: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '520px',
                height: '520px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.04) 0%, rgba(143,130,114,0.06) 100%)',
                borderRadius: '50%',
                zIndex: 0
              }} />

              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '650px'
              }}>
                <Image
                  src="/imagehero.webp"
                  alt="Dashboard de arrendador"
                  width={650}
                  height={550}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 40px rgba(15,52,87,0.15))'
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{
        padding: '100px 0',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)',
              border: '1px solid rgba(143,130,114,0.2)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#0f3457',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {t('features.badge')}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: '#151c26',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              {t('features.title')}
            </h2>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 - KYC */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <SecurityCheckIcon size={32} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('features.kyc.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {t('features.kyc.description')}
              </p>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f3457',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                {t('features.kyc.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>

            {/* Feature 2 - Contracts */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FileValidationIcon size={32} style={{ color: '#22c55e' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('features.contracts.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {t('features.contracts.description')}
              </p>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f3457',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                {t('features.contracts.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>

            {/* Feature 3 - Dashboard */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(251,146,60,0.1) 0%, rgba(251,146,60,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <DashboardSquare02Icon size={32} style={{ color: '#fb923c' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('features.dashboard.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {t('features.dashboard.description')}
              </p>
              <Link href="/landlord/dashboard" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f3457',
                textDecoration: 'none'
              }}>
                {t('features.dashboard.link')} <ArrowRight01Icon size={16} />
              </Link>
            </div>

            {/* Feature 4 - Matching */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <UserMultiple02Icon size={32} style={{ color: '#a855f7' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('features.matching.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {t('features.matching.description')}
              </p>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f3457',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                {t('features.matching.link')} <ArrowRight01Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO START SECTION */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)',
              border: '1px solid rgba(143,130,114,0.2)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#0f3457',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {t('howToStart.badge')}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: '#151c26',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              {t('howToStart.title')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            position: 'relative'
          }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '25%',
              right: '25%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)',
              zIndex: 0
            }} />

            {/* Step 1 */}
            <div className="fade-in" style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(15,52,87,0.3)',
                border: '4px solid #fff'
              }}>
                1
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(15,52,87,0.1)'
              }}>
                <UserAdd02Icon size={40} style={{ color: '#0f3457' }} />
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('howToStart.step1.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                {t('howToStart.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="fade-in" style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(15,52,87,0.3)',
                border: '4px solid #fff'
              }}>
                2
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(15,52,87,0.1)'
              }}>
                <Home01Icon size={40} style={{ color: '#0f3457' }} />
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('howToStart.step2.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                {t('howToStart.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="fade-in" style={{
              position: 'relative',
              textAlign: 'center',
              padding: '40px 24px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,87,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,87,0.08)'
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(15,52,87,0.3)',
                border: '4px solid #fff'
              }}>
                3
              </div>
              <div style={{
                width: '96px',
                height: '96px',
                background: 'linear-gradient(135deg, rgba(15,52,87,0.1) 0%, rgba(15,52,87,0.05) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '32px auto 24px',
                border: '2px solid rgba(15,52,87,0.1)'
              }}>
                <CheckmarkCircle01Icon size={40} style={{ color: '#0f3457' }} />
              </div>
              <h3 style={{
                fontSize: '1.375rem',
                fontWeight: '700',
                color: '#151c26',
                marginBottom: '12px'
              }}>
                {t('howToStart.step3.title')}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7'
              }}>
                {t('howToStart.step3.description')}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/register" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(15,52,87,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,52,87,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,52,87,0.2)'
            }}
            >
              <RocketIcon size={20} />
              {t('howToStart.startButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{
        padding: '100px 0',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(15,52,87,0.08) 0%, rgba(143,130,114,0.1) 100%)',
              border: '1px solid rgba(143,130,114,0.2)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#0f3457',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {t('testimonials.badge')}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: '#151c26',
              letterSpacing: '-0.02em'
            }}>
              {t('testimonials.title')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {/* Testimonial 1 */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '16px'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                ))}
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                "{t('testimonials.testimonial1.text')}"
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  JD
                </div>
                <div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#151c26',
                    marginBottom: '2px'
                  }}>
                    {t('testimonials.testimonial1.name')}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af'
                  }}>
                    {t('testimonials.testimonial1.properties')}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '16px'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                ))}
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                "{t('testimonials.testimonial2.text')}"
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  RV
                </div>
                <div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#151c26',
                    marginBottom: '2px'
                  }}>
                    {t('testimonials.testimonial2.name')}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af'
                  }}>
                    {t('testimonials.testimonial2.properties')}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="fade-in" style={{
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(15,52,87,0.08)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '16px'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                ))}
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                "{t('testimonials.testimonial3.text')}"
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0f3457 0%, #8f8272 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  CM
                </div>
                <div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#151c26',
                    marginBottom: '2px'
                  }}>
                    {t('testimonials.testimonial3.name')}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af'
                  }}>
                    {t('testimonials.testimonial3.properties')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(143,130,114,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            {t('cta.title')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            {t('cta.subtitle')}
          </p>
          <Link href="/register" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 40px',
            background: '#fff',
            color: '#0f3457',
            borderRadius: '12px',
            fontSize: '1.0625rem',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
          }}
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
