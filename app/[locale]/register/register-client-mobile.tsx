'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "@/lib/i18n-context"

export function RegisterClientMobile() {
  const router = useRouter()
  const t = useTranslations('register')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "TENANT" as "TENANT" | "LANDLORD",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('error'))
      }

      router.push(`/${locale}/login?registered=true`)
    } catch (err: any) {
      setError(err.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '72px'
    }}>
      {/* Header móvil - sticky */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #f3f4f6',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button 
          onClick={() => router.back()} 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '0.875rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Volver"
        >
          ✕
        </button>
        <h1 style={{
          fontSize: '0.9375rem',
          fontWeight: '600',
          color: '#151c26',
          margin: 0
        }}>{t('title')}</h1>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Welcome Message */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#151c26',
            marginBottom: '8px',
            lineHeight: '1.3',
            letterSpacing: '-0.01em'
          }}>{t('welcome')}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flex: 1
        }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.8125rem',
              lineHeight: '1.4'
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div style={{ marginBottom: '4px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              {t('role')}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'TENANT' })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${formData.role === 'TENANT' ? '#0f3457' : '#e5e7eb'}`,
                  background: formData.role === 'TENANT' ? 'rgba(15,52,87,0.05)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.8125rem',
                  color: formData.role === 'TENANT' ? '#0f3457' : '#6b7280'
                }}
              >
                {t('tenant')}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'LANDLORD' })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${formData.role === 'LANDLORD' ? '#0f3457' : '#e5e7eb'}`,
                  background: formData.role === 'LANDLORD' ? 'rgba(15,52,87,0.05)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.8125rem',
                  color: formData.role === 'LANDLORD' ? '#0f3457' : '#6b7280'
                }}
              >
                {t('landlord')}
              </button>
            </div>
          </div>

          {/* First Name */}
          <div style={{ position: 'relative' }}>
            <input
              id="firstName"
              type="text"
              style={{
                width: '100%',
                padding: '24px 14px 10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#fff',
                WebkitAppearance: 'none'
              }}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <label 
              htmlFor="firstName"
              style={{
                position: 'absolute',
                left: '14px',
                top: formData.firstName || focusedField === 'firstName' ? '8px' : '50%',
                transform: formData.firstName || focusedField === 'firstName' ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: formData.firstName || focusedField === 'firstName' ? '0.6875rem' : '1rem',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                fontWeight: formData.firstName || focusedField === 'firstName' ? '600' : '400'
              }}
            >
              {t('firstName')}
            </label>
          </div>

          {/* Last Name */}
          <div style={{ position: 'relative' }}>
            <input
              id="lastName"
              type="text"
              style={{
                width: '100%',
                padding: '24px 14px 10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#fff',
                WebkitAppearance: 'none'
              }}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <label 
              htmlFor="lastName"
              style={{
                position: 'absolute',
                left: '14px',
                top: formData.lastName || focusedField === 'lastName' ? '8px' : '50%',
                transform: formData.lastName || focusedField === 'lastName' ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: formData.lastName || focusedField === 'lastName' ? '0.6875rem' : '1rem',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                fontWeight: formData.lastName || focusedField === 'lastName' ? '600' : '400'
              }}
            >
              {t('lastName')}
            </label>
          </div>

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <input
              id="email"
              type="email"
              style={{
                width: '100%',
                padding: '24px 14px 10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#fff',
                WebkitAppearance: 'none'
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <label 
              htmlFor="email"
              style={{
                position: 'absolute',
                left: '14px',
                top: formData.email || focusedField === 'email' ? '8px' : '50%',
                transform: formData.email || focusedField === 'email' ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: formData.email || focusedField === 'email' ? '0.6875rem' : '1rem',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                fontWeight: formData.email || focusedField === 'email' ? '600' : '400'
              }}
            >
              {t('email')}
            </label>
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type="password"
              style={{
                width: '100%',
                padding: '24px 14px 10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#fff',
                WebkitAppearance: 'none'
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <label 
              htmlFor="password"
              style={{
                position: 'absolute',
                left: '14px',
                top: formData.password || focusedField === 'password' ? '8px' : '50%',
                transform: formData.password || focusedField === 'password' ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: formData.password || focusedField === 'password' ? '0.6875rem' : '1rem',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                fontWeight: formData.password || focusedField === 'password' ? '600' : '400'
              }}
            >
              {t('password')}
            </label>
          </div>

          {/* Confirm Password */}
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type="password"
              style={{
                width: '100%',
                padding: '24px 14px 10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#fff',
                WebkitAppearance: 'none'
              }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <label 
              htmlFor="confirmPassword"
              style={{
                position: 'absolute',
                left: '14px',
                top: formData.confirmPassword || focusedField === 'confirmPassword' ? '8px' : '50%',
                transform: formData.confirmPassword || focusedField === 'confirmPassword' ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: formData.confirmPassword || focusedField === 'confirmPassword' ? '0.6875rem' : '1rem',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                fontWeight: formData.confirmPassword || focusedField === 'confirmPassword' ? '600' : '400'
              }}
            >
              {t('confirmPassword')}
            </label>
          </div>

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(15,52,87,0.25)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              marginTop: '8px'
            }}
            disabled={loading}
          >
            {loading ? t('loading') : t('continue')}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '8px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '0.6875rem',
              color: '#6b7280',
              fontWeight: '600'
            }}>{t('or')}</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Social Signup Buttons */}
          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px 20px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
            {t('googleSignup')}
          </button>

          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px 20px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            {t('facebookSignup')}
          </button>

          {/* Spacer */}
          <div style={{ flex: 1, minHeight: '16px' }} />

          {/* Footer */}
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.8125rem',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {t('hasAccount')}{" "}
              <Link href={`/${locale}/login`} style={{
                color: '#0f3457',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                {t('login')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
