'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useTranslations, useLocale } from "@/lib/i18n-context"

type Role = 'TENANT' | 'LANDLORD'

export function RegisterMobile() {
  const router = useRouter()
  const t = useTranslations('register')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    firstName: "", lastName: "", role: "TENANT" as Role,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) { setError(t('passwordMismatch')); return }
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
    } catch (err: unknown) {
      setError((err as Error).message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const float = (field: string) =>
    formData[field as keyof typeof formData] || focusedField === field

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent [appearance:none]"
  const inputPad = { padding: '24px 14px 10px 14px' } as const

  const labelStyle = (field: string) => ({
    top: float(field) ? '8px' : '50%',
    transform: float(field) ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: float(field) ? '0.6875rem' : '1rem',
    fontWeight: float(field) ? '600' : '400',
    color: '#6b7280',
  })

  const roleBtn = (role: Role) =>
    `p-3 rounded-lg border-2 cursor-pointer transition-all text-center font-semibold text-[0.8125rem] ` +
    (formData.role === role
      ? 'border-accent bg-accent/5 text-accent'
      : 'border-gray-200 bg-white text-text-muted')

  return (
    <div className="min-h-screen bg-white flex flex-col pt-14">
      {/* Sticky header */}
      <div className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="size-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted text-base font-bold cursor-pointer shrink-0"
          aria-label="Volver"
        >
          ←
        </button>
        <h1 className="text-[0.9375rem] font-semibold text-text m-0">{t('title')}</h1>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text mb-2 leading-tight tracking-tight">{t('welcome')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 flex-1">
          {error && (
            <div className="flex items-start gap-2.5 p-3 px-3.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[0.8125rem] leading-snug">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-1">
            <label className="block text-[0.8125rem] font-semibold text-gray-700 mb-2">{t('role')}</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" className={roleBtn('TENANT')} onClick={() => setFormData({ ...formData, role: 'TENANT' })}>
                {t('tenant')}
              </button>
              <button type="button" className={roleBtn('LANDLORD')} onClick={() => setFormData({ ...formData, role: 'LANDLORD' })}>
                {t('landlord')}
              </button>
            </div>
          </div>

          {(['firstName', 'lastName', 'email', 'password', 'confirmPassword'] as const).map((field) => (
            <div key={field} className="relative">
              <input
                id={field}
                type={field.toLowerCase().includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                className={inputClass}
                style={inputPad}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor={field} className="absolute left-3.5 pointer-events-none transition-all" style={labelStyle(field)}>
                {t(field)}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-2 text-white font-semibold text-base rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
            disabled={loading}
          >
            {loading ? t('loading') : t('continue')}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[0.6875rem] text-text-muted font-semibold">{t('or')}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button type="button"
            onClick={() => signIn("google", { callbackUrl: `/${locale}` })}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 bg-white border border-gray-300 rounded-lg text-[0.8125rem] font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
            {t('googleSignup')}
          </button>
          <button type="button"
            onClick={() => signIn("facebook", { callbackUrl: `/${locale}` })}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 bg-white border border-gray-300 rounded-lg text-[0.8125rem] font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            {t('facebookSignup')}
          </button>

          <div className="flex-1 min-h-4" />

          <div className="pt-5 border-t border-gray-100 text-center">
            <p className="text-[0.8125rem] text-text-muted m-0 leading-relaxed">
              {t('hasAccount')}{" "}
              <Link href={`/${locale}/login`} className="text-accent font-semibold no-underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
