'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ViewIcon, ViewOffIcon } from "hugeicons-react"
import { useTranslations, useLocale } from "@/lib/i18n-context"

type Role = 'TENANT' | 'LANDLORD'

export function RegisterDesktop() {
  const router = useRouter()
  const t = useTranslations('register')
  const tc = useTranslations('common')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    firstName: "", lastName: "", role: "TENANT" as Role,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordTooShort = formData.password.length > 0 && formData.password.length < 8
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password.length < 8) { setError(t('passwordTooShort')); return }
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

      // Auto-login: the user just typed this password, no need to ask again.
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        router.push(`/${locale}/login?registered=true`)
        return
      }
      router.push(formData.role === 'LANDLORD' ? '/landlord/dashboard' : `/${locale}`)
    } catch (err: unknown) {
      setError((err as Error).message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const float = (field: string) =>
    formData[field as keyof typeof formData] || focusedField === field

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent"
  const inputPad = { padding: '26px 16px 10px 16px' } as const

  const labelStyle = (field: string) => ({
    top: float(field) ? '8px' : '50%',
    transform: float(field) ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: float(field) ? '0.75rem' : '1rem',
    fontWeight: float(field) ? '600' : '400',
    color: '#6b7280',
  })

  const roleBtn = (role: Role) =>
    `p-3 rounded-lg border-2 cursor-pointer transition-all text-center font-semibold text-sm ` +
    (formData.role === role
      ? 'border-accent bg-accent/5 text-accent'
      : 'border-gray-200 bg-white text-text-muted hover:border-gray-300 hover:bg-gray-50')

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 pt-[120px] pb-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-5%] right-[-3%] size-[500px] rounded-full z-0 blur-[60px]"
        style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full z-0 blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(143,130,114,0.06) 0%, transparent 70%)' }} />

      <div className="w-full max-w-[568px] relative z-[1]">
        <div
          className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_4px_20px_rgba(15,52,87,0.08)]"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <button
              onClick={() => router.back()}
              className="size-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted text-base font-bold cursor-pointer transition-all hover:bg-gray-100 hover:border-accent hover:text-accent"
              aria-label="Volver"
            >
              ←
            </button>
            <h1 className="text-base font-semibold text-text m-0">{t('title')}</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text mb-2 leading-tight tracking-tight">{t('welcome')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2.5 p-3 px-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('role')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={roleBtn('TENANT')} onClick={() => setFormData({ ...formData, role: 'TENANT' })}>
                  {t('tenant')}
                </button>
                <button type="button" className={roleBtn('LANDLORD')} onClick={() => setFormData({ ...formData, role: 'LANDLORD' })}>
                  {t('landlord')}
                </button>
              </div>
            </div>

            {(['firstName', 'lastName', 'email'] as const).map((field) => (
              <div key={field} className="relative">
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  autoComplete={field === 'email' ? 'email' : field === 'firstName' ? 'given-name' : 'family-name'}
                  className={inputClass}
                  style={inputPad}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <label htmlFor={field} className="absolute left-4 pointer-events-none transition-all" style={labelStyle(field)}>
                  {t(field)}
                </label>
              </div>
            ))}

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={inputClass}
                  style={{ ...inputPad, paddingRight: '44px' }}
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

            {/* Confirm password */}
            <div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={inputClass}
                  style={{ ...inputPad, paddingRight: '44px' }}
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
              {loading ? t('loading') : t('continue')}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-text-muted font-semibold">{t('or')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button type="button"
              onClick={() => signIn("google", { callbackUrl: `/${locale}` })}
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-accent"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              {t('googleSignup')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-text-muted m-0">
              {t('hasAccount')}{" "}
              <Link href={`/${locale}/login`} className="text-accent font-semibold no-underline transition-colors hover:text-brown">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
