'use client'

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { ViewIcon, ViewOffIcon } from "hugeicons-react"

import { checkTwoFactorRequiredAction, checkAccountExistsAction } from "@/app/actions/user-actions"

type Step = 'email' | 'password' | 'signup'

interface AuthFormProps {
  onAuthenticated: () => void
}

// El modal se monta desde cualquier árbol de rutas (con o sin segmento
// [locale], p.ej. /admin, /landlord), así que no puede depender de
// I18nProvider — el texto va fijo en español.
export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'es'

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 2FA state (sub-paso dentro de "password")
  const [require2FA, setRequire2FA] = useState(false)
  const [totpCode, setTotpCode] = useState("")

  const passwordTooShort = confirmPassword.length > 0 && password.length < 8
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const goToEmailStep = () => {
    setStep('email')
    setPassword("")
    setConfirmPassword("")
    setFirstName("")
    setLastName("")
    setRequire2FA(false)
    setTotpCode("")
    setError("")
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) return
    setLoading(true)
    const result = await checkAccountExistsAction(email)
    setLoading(false)
    if (!result.success) { setError(result.error || "Credenciales incorrectas. Verifica tu email y contraseña."); return }
    setStep(result.exists ? 'password' : 'signup')
  }

  const performLogin = async (loginEmail: string = email, loginPassword: string = password) => {
    setError("")
    setLoading(true)
    try {
      if (!require2FA) {
        const checkResult = await checkTwoFactorRequiredAction(loginEmail)
        if (!checkResult.success) {
          setError(checkResult.error || "Credenciales incorrectas. Verifica tu email y contraseña.")
          setLoading(false)
          return
        }
        if (checkResult.twoFactorRequired) {
          setRequire2FA(true)
          setLoading(false)
          return
        }
      }

      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        totpCode: require2FA ? totpCode : "",
        redirect: false,
      })

      if (result?.error) {
        setError(require2FA ? "Código 2FA incorrecto. Por favor, intenta de nuevo." : "Credenciales incorrectas. Verifica tu email y contraseña.")
        setLoading(false)
        return
      }

      setLoading(false)
      onAuthenticated()
    } catch (err) {
      console.error("Login error:", err)
      setError("Error al iniciar sesión. Intenta nuevamente.")
      setLoading(false)
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performLogin()
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setStep('password')
    performLogin(demoEmail, demoPassword)
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, role: "TENANT" }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al crear la cuenta. Intenta nuevamente.")
      }

      // Auto-login: the user just typed this password, no need to ask again.
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) { setStep('password'); return }
      onAuthenticated()
    } catch (err: unknown) {
      setError((err as Error).message || "Error al crear la cuenta. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg text-base outline-none transition-all focus:border-accent"
  const inputPad = { padding: '26px 16px 10px 16px' } as const
  const floatLabel = (field: string, value: string) => value || focusedField === field
  const labelStyle = (field: string, value: string) => ({
    top: floatLabel(field, value) ? '8px' : '50%',
    transform: floatLabel(field, value) ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: floatLabel(field, value) ? '0.75rem' : '1rem',
    fontWeight: floatLabel(field, value) ? '600' : '400',
    color: '#6b7280',
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text mb-2 leading-tight tracking-tight">
          {step === 'email' ? "Te damos la bienvenida a Habita Perú"
            : step === 'signup' ? "Únete a Habita Perú"
            : require2FA ? "Verificación de seguridad" : "Te damos la bienvenida a Habita Perú"}
        </h2>
        {step !== 'email' && (
          <p className="text-sm text-text-muted">
            {require2FA
              ? "Tu cuenta tiene activada la protección 2FA. Ingresa el código de 6 dígitos."
              : <>
                  {email}{" "}
                  <button type="button" onClick={goToEmailStep} className="text-accent font-semibold no-underline hover:text-brown transition-colors bg-transparent border-0 p-0 cursor-pointer">
                    · Cambiar
                  </button>
                </>
            }
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3 px-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {step === 'email' && (
        <>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                id="modal-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                style={inputPad}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                autoFocus
              />
              <label htmlFor="modal-email" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('email', email)}>
                Correo electrónico
              </label>
            </div>
            <p className="text-xs text-text-muted -mt-2">
              Usaremos este correo para iniciar sesión o crear tu cuenta.
            </p>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-white font-semibold text-base rounded-lg transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Continuar"}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-text-muted font-semibold">o</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: `/${locale}` })}
              className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              Continuar con Google
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[0.65rem] text-gray-400 mb-1.5">Credenciales de prueba</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Admin:', email: 'admin@habitaperu.pe' },
                { label: 'Arrendador:', email: 'juan.diaz@email.com' },
                { label: 'Inquilino:', email: 'carlos.ramirez@email.com' },
              ].map(({ label, email: demoEmail }) => (
                <button
                  key={demoEmail}
                  type="button"
                  disabled={loading}
                  title={`${demoEmail} · password123`}
                  onClick={() => handleDemoLogin(demoEmail, 'password123')}
                  className="text-[0.7rem] font-medium text-gray-400 border border-gray-200 rounded-full px-2.5 py-1 cursor-pointer bg-transparent transition-colors hover:text-accent hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 'password' && (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          {!require2FA ? (
            <>
              <div className="relative">
                <input
                  id="modal-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={inputClass}
                  style={{ ...inputPad, paddingRight: '44px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoFocus
                />
                <label htmlFor="modal-password" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('password', password)}>
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer hover:text-accent transition-colors"
                >
                  {showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
                </button>
              </div>

              <div className="flex justify-between -mt-2">
                <button type="button" onClick={goToEmailStep} className="text-xs font-semibold text-text-muted no-underline hover:text-accent transition-colors bg-transparent border-0 p-0 cursor-pointer">
                  ← Usar otra cuenta
                </button>
                <Link href={`/${locale}/forgot-password`} className="text-xs font-semibold text-accent no-underline hover:text-brown transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <input
                  id="modal-totpCode"
                  type="text"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="Escribe el código de 6 dígitos"
                  className="w-full bg-white border border-gray-300 rounded-lg text-lg text-center tracking-[0.5em] font-mono outline-none transition-all focus:border-accent"
                  style={{ padding: '16px' }}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">💡 Código de Simulación 2FA:</p>
                <p className="m-0">Para pruebas rápidas de este prototipo, ingresa el código <strong>123456</strong>.</p>
              </div>
              <button
                type="button"
                onClick={() => { setRequire2FA(false); setTotpCode(""); setError("") }}
                className="text-xs font-semibold text-accent no-underline hover:text-brown transition-colors bg-transparent border-0 p-0 self-start cursor-pointer"
              >
                ← Intentar de nuevo
              </button>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-white font-semibold text-base rounded-lg transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : (require2FA ? "Verificar e iniciar sesión" : "Continuar")}
          </button>
        </form>
      )}

      {step === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
          {([
            { id: 'modal-firstName', value: firstName, set: setFirstName, autoComplete: 'given-name', label: 'Nombre' },
            { id: 'modal-lastName', value: lastName, set: setLastName, autoComplete: 'family-name', label: 'Apellido' },
          ] as const).map(({ id, value, set, autoComplete, label }) => (
            <div key={id} className="relative">
              <input
                id={id}
                type="text"
                autoComplete={autoComplete}
                className={inputClass}
                style={inputPad}
                value={value}
                onChange={(e) => set(e.target.value)}
                onFocus={() => setFocusedField(id)}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor={id} className="absolute left-4 pointer-events-none transition-all" style={labelStyle(id, value)}>
                {label}
              </label>
            </div>
          ))}

          <div>
            <div className="relative">
              <input
                id="modal-signupPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={inputClass}
                style={{ ...inputPad, paddingRight: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('signupPassword')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="modal-signupPassword" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('signupPassword', password)}>
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer hover:text-accent transition-colors"
              >
                {showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
              </button>
            </div>
            {passwordTooShort && <p className="text-xs text-red-500 mt-1.5 ml-1">La contraseña debe tener al menos 8 caracteres</p>}
          </div>

          <div>
            <div className="relative">
              <input
                id="modal-confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={inputClass}
                style={{ ...inputPad, paddingRight: '44px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="modal-confirmPassword" className="absolute left-4 pointer-events-none transition-all" style={labelStyle('confirmPassword', confirmPassword)}>
                Confirmar contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer hover:text-accent transition-colors"
              >
                {showConfirmPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
              </button>
            </div>
            {passwordsMismatch && <p className="text-xs text-red-500 mt-1.5 ml-1">Las contraseñas no coinciden</p>}
          </div>

          <button type="button" onClick={goToEmailStep} className="text-xs font-semibold text-text-muted no-underline hover:text-accent transition-colors bg-transparent border-0 p-0 self-start cursor-pointer">
            ← Usar otro correo
          </button>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-white font-semibold text-base rounded-lg transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)', boxShadow: '0 4px 12px rgba(15,52,87,0.25)' }}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      )}
    </div>
  )
}
