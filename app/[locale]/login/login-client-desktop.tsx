'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useTranslations, useLocale } from "@/lib/i18n-context"

export function LoginClientDesktop() {
  const router = useRouter()
  const t = useTranslations('login')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('error'))
        setLoading(false)
        return
      }

      // Obtener la sesión para verificar el rol
      const response = await fetch("/api/auth/session")
      const session = await response.json()

      if (session?.user?.role) {
        // Redirigir según el rol
        switch (session.user.role) {
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "LANDLORD":
            router.push("/landlord/dashboard")
            break
          case "TENANT":
            router.push("/tenant/dashboard")
            break
          default:
            router.push(`/${locale}`)
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 pb-10 pt-[120px]">
      {/* Decorative elements */}
      <div className="absolute -top-[5%] -right-[3%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(15,52,87,0.04)_0%,transparent_70%)] rounded-full blur-[60px] z-0" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(143,130,114,0.06)_0%,transparent_70%)] rounded-full blur-[80px] z-0" />

      <div className="w-full max-w-[568px] relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,52,87,0.08)] border border-gray-100 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <button 
              onClick={() => router.back()} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 text-base cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-[#0f3457] hover:text-[#0f3457]"
              aria-label="Volver"
            >
              ✕
            </button>
            <h1 className="text-base font-semibold text-[#151c26] m-0">{t('title')}</h1>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#151c26] mb-2 leading-[1.3] tracking-[-0.01em]">{t('welcome')}</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <input
                id="email"
                type="email"
                className="w-full pt-[26px] pb-[10px] px-4 border border-gray-300 rounded-lg text-base outline-none transition-all duration-200 bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label 
                htmlFor="email"
                className={`absolute left-4 pointer-events-none transition-all duration-200 ${
                  formData.email || focusedField === 'email'
                    ? 'top-[8px] translate-y-0 text-xs font-semibold text-gray-500'
                    : 'top-1/2 -translate-y-1/2 text-base font-normal text-gray-500'
                }`}
              >
                {t('email')}
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full pt-[26px] pb-[10px] px-4 border border-gray-300 rounded-lg text-base outline-none transition-all duration-200 bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label 
                htmlFor="password"
                className={`absolute left-4 pointer-events-none transition-all duration-200 ${
                  formData.password || focusedField === 'password'
                    ? 'top-[8px] translate-y-0 text-xs font-semibold text-gray-500'
                    : 'top-1/2 -translate-y-1/2 text-base font-normal text-gray-500'
                }`}
              >
                {t('password')}
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 px-6 bg-gradient-to-br from-[#0f3457] to-[#0a2540] text-white rounded-lg font-semibold text-base disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,52,87,0.25)] transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_6px_16px_rgba(15,52,87,0.35)]"
              disabled={loading}
            >
              {loading ? t('loading') : t('continue')}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-500 font-semibold">{t('or')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Login Buttons */}
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#0f3457]">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              {t('googleLogin')}
            </button>

            <button type="button" className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#0f3457]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {t('facebookLogin')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 m-0">
              {t('noAccount')}{" "}
              <Link href={`/${locale}/register`} className="text-[#0f3457] font-semibold no-underline transition-colors duration-200 hover:text-[#8f8272]">
                {t('signUp')}
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[linear-gradient(135deg,rgba(15,52,87,0.04)_0%,rgba(143,130,114,0.06)_100%)] border border-[rgba(15,52,87,0.1)] rounded-lg">
            <p className="text-xs font-semibold text-[#0f3457] mb-3 flex items-center gap-1.5">
              ℹ️ {t('demoCredentials.title')}
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 text-[0.7rem]">
              <div>
                <strong className="block mb-1 text-[#0f3457]">{t('demoCredentials.admin')}</strong>
                <span className="block text-gray-500">admin@habitaperu.pe</span>
                <span className="block text-gray-500">password123</span>
              </div>
              <div>
                <strong className="block mb-1 text-[#0f3457]">{t('demoCredentials.landlord')}</strong>
                <span className="block text-gray-500">juan.diaz@email.com</span>
                <span className="block text-gray-500">password123</span>
              </div>
              <div>
                <strong className="block mb-1 text-[#0f3457]">{t('demoCredentials.tenant')}</strong>
                <span className="block text-gray-500">carlos.ramirez@email.com</span>
                <span className="block text-gray-500">password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
