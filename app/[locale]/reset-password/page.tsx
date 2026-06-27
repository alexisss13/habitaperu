'use client'

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ViewIcon, ViewOffIcon } from "hugeicons-react"
import { useTranslations, useLocale } from "@/lib/i18n-context"

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const t = useTranslations('resetPassword')
  const tc = useTranslations('common')
  const locale = useLocale()
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordTooShort = formData.password.length > 0 && formData.password.length < 8
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!token) { setError(t('invalidToken')); return }
    if (formData.password.length < 8) { setError(t('passwordTooShort')); return }
    if (formData.password !== formData.confirmPassword) { setError(t('passwordMismatch')); return }
    setLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('error'))
      }
      setDone(true)
    } catch (err: unknown) {
      setError((err as Error).message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const floatLabel = (field: 'password' | 'confirmPassword') =>
    formData[field] || focusedField === field

  const labelStyle = (field: 'password' | 'confirmPassword') => ({
    top: floatLabel(field) ? '8px' : '50%',
    transform: floatLabel(field) ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: floatLabel(field) ? '0.75rem' : '1rem',
    fontWeight: floatLabel(field) ? '600' : '400',
    color: '#6b7280',
  })

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 pt-[120px] pb-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}
    >
      <div className="absolute top-[-5%] right-[-3%] size-[500px] rounded-full z-0 blur-[60px]"
        style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full z-0 blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)' }} />

      <div className="w-full max-w-[480px] relative z-[1]">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_4px_20px_rgba(15,52,87,0.08)]">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <button
              onClick={() => router.back()}
              className="size-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted cursor-pointer transition-all hover:bg-gray-100 hover:border-accent hover:text-accent text-base font-bold"
              aria-label="Volver"
            >
              ←
            </button>
            <h1 className="text-base font-semibold text-text m-0">{t('title')}</h1>
          </div>

          {done ? (
            <div className="text-center py-2">
              <h2 className="text-xl font-bold text-text mb-3 leading-tight tracking-tight">{t('success')}</h2>
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center justify-center w-full py-3.5 px-6 text-white font-semibold text-base rounded-lg no-underline transition-all hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
              >
                {t('goToLogin')}
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center py-2">
              <p className="text-sm text-red-500 mb-6">{t('invalidToken')}</p>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm text-accent font-semibold no-underline hover:text-brown transition-colors"
              >
                {t('requestNewLink')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-2 leading-tight tracking-tight">{t('welcome')}</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2.5 p-3 px-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent"
                      style={{ padding: '26px 44px 10px 16px' }}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <label htmlFor="password" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('password')}>
                      {t('password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? tc('hidePassword') : tc('showPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer hover:text-accent transition-colors"
                    >
                      {showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
                    </button>
                  </div>
                  {passwordTooShort && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">{t('passwordTooShort')}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent"
                      style={{ padding: '26px 44px 10px 16px' }}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <label htmlFor="confirmPassword" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('confirmPassword')}>
                      {t('confirmPassword')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? tc('hidePassword') : tc('showPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer hover:text-accent transition-colors"
                    >
                      {showConfirmPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">{t('passwordMismatch')}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-white font-semibold text-base rounded-lg transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
                  disabled={loading}
                >
                  {loading ? t('loading') : t('submit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  )
}
