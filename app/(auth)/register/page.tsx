"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dni: "",
    role: "TENANT" as "TENANT" | "LANDLORD",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden")
        return
      }
      if (formData.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres")
        return
      }
      setStep(2)
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
        throw new Error(data.error || "Error al registrarse")
      }

      // Redirigir al login
      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          {/* Header */}
          <div className="auth-header">
            <button 
              onClick={() => step === 1 ? router.back() : setStep(1)} 
              className="auth-back-btn"
              aria-label={step === 1 ? "Cerrar" : "Volver"}
            >
              {step === 1 ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-arrow-left"></i>
              )}
            </button>
            <h1 className="auth-title">Registrarse</h1>
          </div>

          {/* Progress Indicator */}
          <div className="auth-progress">
            <div className={`auth-progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="auth-progress-circle">1</div>
              <span>Cuenta</span>
            </div>
            <div className="auth-progress-line"></div>
            <div className={`auth-progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="auth-progress-circle">2</div>
              <span>Perfil</span>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="auth-welcome">
            <h2>
              {step === 1 ? "Crea tu cuenta" : "Completa tu perfil"}
            </h2>
            <p>
              {step === 1 
                ? "Únete a la plataforma de arrendamiento más confiable del Perú"
                : "Cuéntanos un poco más sobre ti"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">¿Qué tipo de usuario eres?</label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-card ${formData.role === 'TENANT' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, role: 'TENANT' })}
                    >
                      <i className="fa-solid fa-user"></i>
                      <span>Inquilino</span>
                      <small>Busco un lugar para alquilar</small>
                    </button>
                    <button
                      type="button"
                      className={`role-card ${formData.role === 'LANDLORD' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, role: 'LANDLORD' })}
                    >
                      <i className="fa-solid fa-house-user"></i>
                      <span>Arrendador</span>
                      <small>Tengo propiedades para alquilar</small>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-input"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="form-input"
                      placeholder="Tu nombre"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Apellido
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="form-input"
                      placeholder="Tu apellido"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+51 999 999 999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dni" className="form-label">
                    DNI
                  </label>
                  <input
                    id="dni"
                    type="text"
                    className="form-input"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    required
                    maxLength={8}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn-primary btn-large" 
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Registrando...
                </>
              ) : step === 1 ? (
                "Continuar"
              ) : (
                "Crear cuenta"
              )}
            </button>

            {step === 1 && (
              <>
                <div className="auth-divider">
                  <span>o</span>
                </div>

                {/* Social Login Buttons */}
                <button type="button" className="btn-social">
                  <i className="fa-brands fa-google"></i>
                  Continuar con Google
                </button>

                <button type="button" className="btn-social">
                  <i className="fa-brands fa-facebook"></i>
                  Continuar con Facebook
                </button>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="auth-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
