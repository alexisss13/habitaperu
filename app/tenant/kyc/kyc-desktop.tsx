"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  SecurityCheckIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
} from "hugeicons-react"
import { submitKYCVerification } from "@/app/actions/kyc-actions"
import { uploadImageAction } from "@/app/actions/upload-actions"
import { getFaceDescriptor, loadImageFromUrl, computeFaceMatch } from "@/lib/face-verification"
import { CameraCapture } from "@/components/kyc/camera-capture"
import type { KYCVerificationData } from "./kyc-view"

interface Props {
  verification: KYCVerificationData | null
  isMockPayment: boolean
}

interface FaceMatchResult {
  distance: number
  matchPercent: number
  isMatch: boolean
}

export function TenantKYCDesktop({ verification, isMockPayment }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Foto del DNI
  const [dniPreview, setDniPreview] = useState<string | null>(null)
  const [dniUploadedUrl, setDniUploadedUrl] = useState<string | null>(null)
  const [dniDescriptor, setDniDescriptor] = useState<Float32Array | null>(null)
  const [dniProcessing, setDniProcessing] = useState(false)

  // Selfie
  const [selfieUploadedUrl, setSelfieUploadedUrl] = useState<string | null>(null)
  const [selfieProcessing, setSelfieProcessing] = useState(false)
  const [matchResult, setMatchResult] = useState<FaceMatchResult | null>(null)

  // State for re-submission if rejected
  const [isReSubmitting, setIsReSubmitting] = useState(false)

  const handleDniCapture = async (file: File, previewUrl: string) => {
    setDniPreview(previewUrl)
    setDniUploadedUrl(null)
    setDniDescriptor(null)
    setError(null)
    setDniProcessing(true)

    try {
      const [descriptorResult, uploadResult] = await Promise.all([
        (async () => {
          const img = await loadImageFromUrl(previewUrl)
          return getFaceDescriptor(img)
        })(),
        (async () => {
          const formData = new FormData()
          formData.append("file", file)
          return uploadImageAction(formData, "kyc")
        })(),
      ])

      if (!descriptorResult.descriptor) {
        setError(
          descriptorResult.faceCount === 0
            ? "No se detectó ningún rostro en la foto del DNI. Asegúrate de que la foto de tu documento salga nítida y vuelve a intentarlo."
            : "Se detectó más de un rostro en la foto. Vuelve a tomarla mostrando solo tu DNI."
        )
      } else {
        setDniDescriptor(descriptorResult.descriptor)
      }

      if (uploadResult.success && uploadResult.url) {
        setDniUploadedUrl(uploadResult.url)
      } else {
        setError(uploadResult.error || "Error al subir la foto del DNI.")
      }
    } catch (err) {
      console.error(err)
      setError("Error al procesar la foto del DNI.")
    } finally {
      setDniProcessing(false)
    }
  }

  const handleSelfieCapture = async (file: File, previewUrl: string) => {
    setSelfieUploadedUrl(null)
    setMatchResult(null)
    setError(null)
    setSelfieProcessing(true)

    try {
      const [descriptorResult, uploadResult] = await Promise.all([
        (async () => {
          const img = await loadImageFromUrl(previewUrl)
          return getFaceDescriptor(img)
        })(),
        (async () => {
          const formData = new FormData()
          formData.append("file", file)
          return uploadImageAction(formData, "kyc")
        })(),
      ])

      if (!descriptorResult.descriptor) {
        setError(
          descriptorResult.faceCount === 0
            ? "No se detectó ningún rostro en la selfie. Verifica la iluminación y vuelve a intentarlo."
            : "Se detectó más de un rostro en la selfie. Asegúrate de que solo aparezcas tú."
        )
      } else if (dniDescriptor) {
        setMatchResult(computeFaceMatch(dniDescriptor, descriptorResult.descriptor))
      }

      if (uploadResult.success && uploadResult.url) {
        setSelfieUploadedUrl(uploadResult.url)
      } else {
        setError(uploadResult.error || "Error al subir la selfie.")
      }
    } catch (err) {
      console.error(err)
      setError("Error al procesar la selfie.")
    } finally {
      setSelfieProcessing(false)
    }
  }

  const handleSubmitKYC = async () => {
    if (!dniUploadedUrl || !dniDescriptor) {
      setError("Por favor captura la foto de tu DNI.")
      setStep(1)
      return
    }
    if (!selfieUploadedUrl || !matchResult) {
      setError("Debes completar la verificación facial con tu selfie.")
      setStep(2)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await submitKYCVerification(dniUploadedUrl, selfieUploadedUrl, matchResult.matchPercent)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          setIsReSubmitting(false)
          router.refresh()
        }, 1500)
      } else {
        setError(res.error || "Ocurrió un error al enviar el expediente.")
      }
    } catch (err) {
      console.error(err)
      setError("Error de red inesperado al enviar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetWizard = () => {
    setError(null)
    setDniPreview(null)
    setDniUploadedUrl(null)
    setDniDescriptor(null)
    setSelfieUploadedUrl(null)
    setMatchResult(null)
    setStep(1)
    setIsReSubmitting(true)
  }

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Active status selector
  const activeStatus = isReSubmitting ? "PENDIENTE" : (verification?.status || "PENDIENTE")

  return (
    <div className="min-h-screen bg-panel-bg ">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* 1. STATE: PENDIENTE / WIZARD FLOW */}
        {activeStatus === "PENDIENTE" && (
          <div className="grid grid-cols-3 gap-8">
            {/* Left Col (2 cols): Wizard */}
            <div className="col-span-2 bg-panel-card-bg border border-panel-border shadow-sm rounded-2xl overflow-hidden">

              {/* Wizard Steps indicator */}
              <div className="bg-panel-hover-bg border-b border-panel-border px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-panel-text">Proceso de Verificación</h3>
                  <p className="text-xs text-panel-text-muted mt-0.5">Paso {step} de 3</p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(s => (
                    <div
                      key={s}
                      className={`h-1.5 w-6 rounded-full transition-colors ${
                        step >= s ? "bg-accent" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Wizard Content */}
              <div className="p-6">
                {error && (
                  <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2.5 mb-6 text-xs font-medium">
                    <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2.5 mb-6 text-xs font-medium">
                    <CheckmarkCircle01Icon size={16} className="shrink-0 mt-0.5" />
                    <span>¡Expediente enviado para revisión exitosamente!</span>
                  </div>
                )}

                {/* Step 1: DNI Photo capture via camera */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-panel-text mb-1.5">Documento de Identidad</h4>
                      <p className="text-xs text-panel-text-muted mb-4 leading-relaxed">
                        Usa tu cámara para tomar una foto clara y legible del anverso de tu Documento Nacional de Identidad (DNI) o Carnet de Extranjería.
                      </p>
                    </div>

                    <CameraCapture
                      facingMode="environment"
                      activateLabel="Activar cámara"
                      captureLabel="Capturar foto del DNI"
                      guideText="Ubica tu DNI dentro del recuadro, con buena iluminación y sin reflejos."
                      aspect="video"
                      onCapture={handleDniCapture}
                    />

                    {dniProcessing && (
                      <p className="text-[10px] text-accent animate-pulse font-bold">Analizando rostro y subiendo documento...</p>
                    )}

                    {dniPreview && dniDescriptor && dniUploadedUrl && !dniProcessing && (
                      <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-emerald-700">
                        <CheckmarkCircle01Icon size={16} className="shrink-0" />
                        Rostro detectado y documento cargado correctamente.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Facial biometric verification via selfie */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-panel-text mb-1.5">Verificación Facial Biométrica</h4>
                      <p className="text-xs text-panel-text-muted mb-4 leading-relaxed">
                        Tómate una selfie. El sistema comparará tu rostro con la foto de tu DNI para validar tu identidad.
                      </p>
                    </div>

                    <CameraCapture
                      facingMode="user"
                      activateLabel="Activar cámara"
                      captureLabel="Tomar selfie"
                      guideText="Centra tu rostro, con buena iluminación y sin lentes de sol ni gorra."
                      aspect="square"
                      onCapture={handleSelfieCapture}
                    />

                    {selfieProcessing && (
                      <p className="text-[10px] text-accent animate-pulse font-bold">Comparando rostro con el DNI...</p>
                    )}

                    {matchResult && !selfieProcessing && (
                      <div className={`rounded-xl p-4 text-center space-y-1.5 ${
                        matchResult.isMatch ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-200"
                      }`}>
                        <p className={`text-sm font-bold ${matchResult.isMatch ? "text-emerald-700" : "text-amber-700"}`}>
                          Coincidencia con DNI: {matchResult.matchPercent}%
                        </p>
                        <p className="text-[10px] text-panel-text-muted">
                          {matchResult.isMatch
                            ? "Rostro validado automáticamente."
                            : "Coincidencia baja — tu expediente pasará a revisión manual de un asesor."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review and submit */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-panel-text mb-1.5">Confirmar Expediente KYC</h4>
                      <p className="text-xs text-panel-text-muted mb-4 leading-relaxed">
                        Revisa que la información cargada esté en orden antes de enviarla.
                      </p>
                    </div>

                    <div className="border border-panel-border rounded-xl overflow-hidden text-xs font-semibold text-panel-text divide-y divide-slate-100">
                      <div className="p-3.5 bg-panel-hover-bg/50 flex justify-between">
                        <span className="text-panel-text-muted">Documento DNI:</span>
                        <span className="text-emerald-600">{dniUploadedUrl ? "✓ Cargado" : "Pendiente"}</span>
                      </div>
                      <div className="p-3.5 flex justify-between">
                        <span className="text-panel-text-muted">Coincidencia facial:</span>
                        <span className={matchResult?.isMatch ? "text-emerald-600" : "text-amber-600"}>
                          {matchResult ? `${matchResult.matchPercent}%` : "Pendiente"}
                        </span>
                      </div>
                      <div className="p-3.5 bg-panel-hover-bg/50 flex justify-between">
                        <span className="text-panel-text-muted">Resultado esperado:</span>
                        <span className={matchResult?.isMatch ? "text-emerald-600" : "text-amber-600"}>
                          {matchResult?.isMatch ? "Aprobación automática" : "Revisión manual por un asesor"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard Footer Nav */}
                <div className="mt-8 pt-6 border-t border-panel-border flex justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(prev => prev - 1)}
                      className="h-11 px-5 border border-panel-border rounded-xl text-xs font-bold text-panel-text-muted hover:bg-panel-hover-bg transition-colors cursor-pointer bg-panel-card-bg"
                    >
                      Atrás
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 1 && (!dniUploadedUrl || !dniDescriptor)) {
                          setError("Captura y espera a que se procese la foto de tu DNI.")
                          return
                        }
                        if (step === 2 && (!selfieUploadedUrl || !matchResult)) {
                          setError("Captura y espera a que se procese tu selfie.")
                          return
                        }
                        setError(null)
                        setStep(prev => prev + 1)
                      }}
                      disabled={dniProcessing || selfieProcessing}
                      className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitKYC}
                      disabled={isSubmitting || success}
                      className="h-11 px-6 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar para Aprobación"}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Right Col: Info Cards */}
            <div className="space-y-6">
              <div className="bg-panel-card-bg border border-panel-border shadow-sm rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <SecurityCheckIcon size={22} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-panel-text">Privacidad Protegida</h4>
                    <p className="text-[10px] text-panel-text-muted leading-relaxed mt-1">
                      Cumplimos estrictamente con la Ley N° 29733 de Protección de Datos Personales en el Perú. Tus documentos son encriptados en reposo y solo se usan para validaciones contractuales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-panel-card-bg border border-panel-border shadow-sm rounded-2xl p-5">
                <h4 className="text-xs font-bold text-panel-text mb-3 uppercase tracking-wider">¿Por qué es necesario?</h4>
                <p className="text-[10px] text-panel-text-muted leading-relaxed">
                  Para otorgar validez jurídica a las firmas electrónicas sobre contratos de desalojo exprés (Ley N° 30933) y allanamiento futuro (Ley N° 30201), requerimos validar la identidad del firmante con RENIEC para prevenir suplantaciones.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. STATE: EN REVISION */}
        {activeStatus === "EN_REVISION" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
              <SecurityCheckIcon size={32} />
            </div>
            <div>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-3">
                Expediente en Revisión
              </span>
              <h3 className="text-lg font-bold text-panel-text mb-2">Expediente en Proceso de Evaluación</h3>
              <p className="text-xs font-medium text-panel-text-muted leading-relaxed max-w-sm mx-auto">
                Tu coincidencia facial con el DNI fue baja, así que tus documentos están siendo revisados manualmente por nuestros oficiales legales. El tiempo máximo de respuesta es de <strong>24 horas hábiles</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-panel-border text-[10px] text-panel-text-muted">
              Te enviaremos una notificación al correo electrónico registrado en cuanto se valide tu perfil.
            </div>
          </div>
        )}

        {/* 3. STATE: APROBADO */}
        {activeStatus === "APROBADO" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-20 rounded-full flex items-center justify-center mx-auto shadow-xl bg-emerald-500 text-white shadow-emerald-500/20">
              <CheckmarkCircle01Icon size={44} />
            </div>
            <div>
              <span className="text-[10px] rounded font-bold px-2.5 py-0.5 inline-block mb-3 border bg-emerald-50 text-emerald-700 border-emerald-200">
                Perfil Verificado Activo ✓
              </span>
              <h3 className="text-lg font-bold text-panel-text mb-2">
                ¡Tu perfil está completamente activo!
              </h3>
              <p className="text-xs font-medium text-panel-text-muted leading-relaxed max-w-sm mx-auto">
                Ya puedes contactar arrendadores y firmar contratos con validez jurídica en la plataforma.
              </p>
              {verification?.verifiedAt && (
                <p className="text-[10px] text-panel-text-muted mt-3">Verificado el {formatLocalDate(verification.verifiedAt)}</p>
              )}
            </div>
            <div className="pt-6 border-t border-panel-border flex flex-col items-center gap-3">
              <Link
                href="/tenant/dashboard"
                className="inline-flex h-11 items-center justify-center px-6 rounded-xl text-xs font-bold transition-all no-underline text-panel-text-dim hover:text-panel-text"
              >
                Ir al Panel Principal →
              </Link>
            </div>
          </div>
        )}

        {/* 4. STATE: RECHAZADO */}
        {activeStatus === "RECHAZADO" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-16 rounded-full bg-red-50 text-red border border-red-200 flex items-center justify-center mx-auto">
              <AlertCircleIcon size={32} />
            </div>
            <div>
              <span className="text-[10px] bg-red/10 text-red border border-red/20 rounded font-bold px-2 py-0.5 inline-block mb-3">
                Verificación Rechazada
              </span>
              <h3 className="text-lg font-bold text-panel-text mb-2">Revisión de Identidad Fallida</h3>
              <p className="text-xs font-medium text-panel-text-muted leading-relaxed max-w-sm mx-auto mb-4">
                Lamentablemente tu expediente de identidad fue rechazado por nuestros asesores legales.
              </p>

              <div className="bg-red/5 border border-red/10 rounded-xl p-4 text-left">
                <span className="text-[10px] font-bold text-red block mb-1 uppercase tracking-wider">Motivo de Rechazo:</span>
                <p className="text-xs text-red font-medium leading-relaxed">
                  {verification?.reviewNotes || "La foto del DNI es borrosa o no coincide con los registros. Por favor sube una imagen con mayor nitidez."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-panel-border">
              <button
                type="button"
                onClick={resetWizard}
                className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
              >
                Corregir y Enviar Nuevamente
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
