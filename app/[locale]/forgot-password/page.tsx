'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "@/lib/i18n-context"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const t = useTranslations('forgotPassword')
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('error'))
      }
      setSent(true)
    } catch (err: unknown) {
      setError((err as Error).message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const floatLabel = email.length > 0 || focused

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

          {sent ? (
            <div className="text-center py-2">
              <h2 className="text-xl font-bold text-text mb-3 leading-tight tracking-tight">{t('success')}</h2>
              <p className="text-sm text-text-muted mb-8">{t('checkInbox')}</p>
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center justify-center w-full py-3.5 px-6 text-white font-semibold text-base rounded-lg no-underline transition-all hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
              >
                {t('backToLogin')}
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

                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent"
                    style={{ padding: '26px 16px 10px 16px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                  />
                  <label htmlFor="email" className="absolute left-4 pointer-events-none transition-all" style={{
                    top: floatLabel ? '8px' : '50%',
                    transform: floatLabel ? 'translateY(0)' : 'translateY(-50%)',
                    fontSize: floatLabel ? '0.75rem' : '1rem',
                    fontWeight: floatLabel ? '600' : '400',
                    color: '#6b7280',
                  }}>
                    {t('email')}
                  </label>
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

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link href={`/${locale}/login`} className="text-sm text-accent font-semibold no-underline transition-colors hover:text-brown">
                  {t('backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
