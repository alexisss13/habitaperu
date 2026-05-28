'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useTranslations, useLocale } from "@/lib/i18n-context"

import { checkTwoFactorRequiredAction } from "@/app/actions/user-actions"

export function LoginMobile() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'
  const t = useTranslations('login')
  const locale = useLocale()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // 2FA States
  const [require2FA, setRequire2FA] = useState(false)
  const [totpCode, setTotpCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (!require2FA) {
        // Step 1: Check if 2FA is required
        const checkResult = await checkTwoFactorRequiredAction(formData.email, formData.password)
        if (!checkResult.success) {
          setError(checkResult.error || t('error'))
          setLoading(false)
          return
        }

        if (checkResult.twoFactorRequired) {
          setRequire2FA(true)
          setLoading(false)
          return
        }
      }

      // Step 2: Perform Credentials Sign In (with or without 2FA)
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        totpCode: require2FA ? totpCode : "",
        redirect: false,
      })

      if (result?.error) {
        setError(require2FA ? "Código 2FA incorrecto. Por favor, intenta de nuevo." : t('error'))
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/session")
      const session = await response.json()
      if (session?.user?.role) {
        switch (session.user.role) {
          case "ADMIN":    router.push("/admin/dashboard"); break
          case "LANDLORD": router.push("/landlord/dashboard"); break
          case "TENANT":   router.push(`/${locale}`); break
          default:         router.push(`/${locale}`)
        }
      } else {
        router.push(`/${locale}`)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(t('genericError'))
      setLoading(false)
    }
  }

  const floatLabel = (field: string) =>
    formData[field as keyof typeof formData] || focusedField === field

  return (
    <div className="min-h-screen bg-white flex flex-col pt-14">
      {/* Sticky header */}
      <div className="fixed inset-x-0 top-0 z-[100] bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => {
            if (require2FA) {
              setRequire2FA(false)
              setTotpCode("")
              setError("")
            } else {
              router.back()
            }
          }}
          className="size-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-text-muted text-base font-bold cursor-pointer shrink-0"
          aria-label="Volver"
        >
          ←
        </button>
        <h1 className="text-[0.9375rem] font-semibold text-text m-0">
          {require2FA ? "Autenticación 2FA" : t('title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 flex flex-col">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-2 leading-tight tracking-tight">
            {require2FA ? "Verificación de Seguridad" : t('welcome')}
          </h2>
          {require2FA && (
            <p className="text-xs text-text-muted">
              Tu cuenta tiene activada la protección 2FA. Por favor, ingresa el código de 6 dígitos.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {justRegistered && (
            <div className="flex items-start gap-2.5 p-3 px-3.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-[0.8125rem] leading-snug">
              <span className="shrink-0">✓</span>
              <span className="font-semibold">Cuenta creada exitosamente. Inicia sesión para continuar.</span>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2.5 p-3 px-3.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[0.8125rem] leading-snug">
              <span className="shrink-0">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {!require2FA ? (
            <>
              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent [appearance:none]"
                  style={{ padding: '24px 14px 10px 14px' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <label htmlFor="email" className="absolute left-3.5 pointer-events-none transition-all" style={{
                  top: floatLabel('email') ? '8px' : '50%',
                  transform: floatLabel('email') ? 'translateY(0)' : 'translateY(-50%)',
                  fontSize: floatLabel('email') ? '0.6875rem' : '1rem',
                  fontWeight: floatLabel('email') ? '600' : '400',
                  color: '#6b7280',
                }}>
                  {t('email')}
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent [appearance:none]"
                  style={{ padding: '24px 14px 10px 14px' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <label htmlFor="password" className="absolute left-3.5 pointer-events-none transition-all" style={{
                  top: floatLabel('password') ? '8px' : '50%',
                  transform: floatLabel('password') ? 'translateY(0)' : 'translateY(-50%)',
                  fontSize: floatLabel('password') ? '0.6875rem' : '1rem',
                  fontWeight: floatLabel('password') ? '600' : '400',
                  color: '#6b7280',
                }}>
                  {t('password')}
                </label>
              </div>
            </>
          ) : (
            <>
              {/* 2FA input */}
              <div className="relative">
                <input
                  id="totpCode"
                  type="text"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="Código de 6 dígitos"
                  className="w-full bg-white border border-gray-300 rounded-lg text-base text-center tracking-[0.5em] font-mono outline-none transition-all focus:border-accent [appearance:none]"
                  style={{ padding: '16px' }}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[0.7rem] text-amber-800">
                <p className="font-semibold mb-0.5">💡 Código de Simulación 2FA:</p>
                <p className="m-0">Para pruebas rápidas de este prototipo, ingresa el código <strong>123456</strong>.</p>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-2 text-white font-semibold text-base rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)',
              boxShadow: '0 4px 12px rgba(15,52,87,0.25)',
            }}
            disabled={loading}
          >
            {loading ? t('loading') : (require2FA ? "Verificar e Iniciar Sesión" : t('continue'))}
          </button>

          {!require2FA && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[0.6875rem] text-text-muted font-semibold">{t('or')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: `/${locale}` })}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-5 bg-white border border-gray-200 rounded-xl text-[0.8125rem] font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              {t('googleLogin')}
            </button>
            <button
              type="button"
              onClick={() => signIn("facebook", { callbackUrl: `/${locale}` })}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-5 bg-white border border-gray-200 rounded-xl text-[0.8125rem] font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {t('facebookLogin')}
            </button>
          </div>

          <div className="flex-1 min-h-4" />

          {/* Footer */}
          <div className="pt-5 border-t border-gray-100 text-center">
            <p className="text-[0.8125rem] text-text-muted m-0 leading-relaxed">
              {t('noAccount')}{" "}
              <Link href={`/${locale}/register`} className="text-accent font-semibold no-underline">
                {t('signUp')}
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div
            className="mt-4 p-3 border border-accent/10 rounded-lg"
            style={{ background: 'linear-gradient(135deg, rgba(15,52,87,0.04) 0%, rgba(143,130,114,0.06) 100%)' }}
          >
            <p className="text-[0.6875rem] font-semibold text-accent mb-2.5 flex items-center gap-1">
              ℹ️ {t('demoCredentials.title')}
            </p>
            <div className="flex flex-col gap-2.5 text-[0.625rem]">
              <div>
                <strong className="block mb-0.5 text-accent">{t('demoCredentials.admin')}</strong>
                <span className="block text-text-muted">admin@habitaperu.pe</span>
              </div>
              <div>
                <strong className="block mb-0.5 text-accent">{t('demoCredentials.landlord')}</strong>
                <span className="block text-text-muted">juan.diaz@email.com</span>
              </div>
              <div>
                <strong className="block mb-0.5 text-accent">{t('demoCredentials.tenant')}</strong>
                <span className="block text-text-muted">carlos.ramirez@email.com</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
