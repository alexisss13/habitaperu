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

export function TenantKYCMobile({ verification, isMockPayment }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [dniPreview, setDniPreview] = useState<string | null>(null)
  const [dniUploadedUrl, setDniUploadedUrl] = useState<string | null>(null)
  const [dniDescriptor, setDniDescriptor] = useState<Float32Array | null>(null)
  const [dniProcessing, setDniProcessing] = useState(false)

  const [selfieUploadedUrl, setSelfieUploadedUrl] = useState<string | null>(null)
  const [selfieProcessing, setSelfieProcessing] = useState(false)
  const [matchResult, setMatchResult] = useState<FaceMatchResult | null>(null)

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
            ? "No se detectó ningún rostro en la foto del DNI. Vuelve a intentarlo con mejor iluminación."
            : "Se detectó más de un rostro. Vuelve a tomar la foto mostrando solo tu DNI."
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
            ? "No se detectó ningún rostro en la selfie. Intenta con mejor iluminación."
            : "Se detectó más de un rostro. Asegúrate de que solo aparezcas tú."
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
      setError("Captura tu DNI.")
      setStep(1)
      return
    }
    if (!selfieUploadedUrl || !matchResult) {
      setError("Completa el análisis facial.")
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
        setError(res.error || "Error al enviar.")
      }
    } catch (err) {
      console.error(err)
      setError("Error de red.")
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
      month: "short",
      year: "numeric",
    })
  }

  const activeStatus = isReSubmitting ? "PENDIENTE" : (verification?.status || "PENDIENTE")

  return (
    <div className="min-h-screen bg-panel-bg pb-24">
      <div className="px-4 pt-6">

        {/* 1. STATE: PENDIENTE / WIZARD FLOW */}
        {activeStatus === "PENDIENTE" && (
          <div className="bg-panel-card-bg border border-panel-border shadow-sm rounded-xl overflow-hidden">

            {/* Steps indicator */}
            <div className="bg-panel-hover-bg border-b border-panel-border px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-panel-text-muted">Paso {step} de 3</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`h-1 w-5 rounded-full transition-colors ${
                      step >= s ? "bg-accent" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Wizard Body */}
            <div className="p-4 space-y-4">
              {error && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-3 flex items-start gap-2 text-[11px] font-semibold">
                  <CheckmarkCircle01Icon size={14} className="shrink-0 mt-0.5" />
                  <span>¡Expediente enviado!</span>
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-panel-text">Foto de DNI</h4>
                    <p className="text-[10px] text-panel-text-muted leading-relaxed mt-1">
                      Usa la cámara para fotografiar el anverso de tu documento.
                    </p>
                  </div>

                  <CameraCapture
                    facingMode="environment"
                    activateLabel="Activar cámara"
                    captureLabel="Capturar DNI"
                    guideText="Ubica tu DNI dentro del recuadro, con buena luz."
                    aspect="video"
                    onCapture={handleDniCapture}
                  />

                  {dniProcessing && (
                    <p className="text-[9px] text-accent animate-pulse font-bold">Analizando rostro y subiendo documento...</p>
                  )}

                  {dniPreview && dniDescriptor && dniUploadedUrl && !dniProcessing && (
                    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-2.5 flex items-center gap-2 text-[10px] font-semibold text-emerald-700">
                      <CheckmarkCircle01Icon size={14} className="shrink-0" />
                      Rostro detectado y documento cargado.
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-panel-text">Escaneo Facial</h4>
                    <p className="text-[10px] text-panel-text-muted leading-relaxed mt-1">
                      Tómate una selfie para comparar tu rostro con el DNI.
                    </p>
                  </div>

                  <CameraCapture
                    facingMode="user"
                    activateLabel="Activar cámara"
                    captureLabel="Tomar selfie"
                    guideText="Centra tu rostro, sin lentes de sol ni gorra."
                    aspect="square"
                    onCapture={handleSelfieCapture}
                  />

                  {selfieProcessing && (
                    <p className="text-[9px] text-accent animate-pulse font-bold">Comparando rostro con el DNI...</p>
                  )}

                  {matchResult && !selfieProcessing && (
                    <div className={`rounded-lg p-3 text-center space-y-1 ${
                      matchResult.isMatch ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-200"
                    }`}>
                      <p className={`text-xs font-bold ${matchResult.isMatch ? "text-emerald-700" : "text-amber-700"}`}>
                        Coincidencia: {matchResult.matchPercent}%
                      </p>
                      <p className="text-[9px] text-panel-text-muted">
                        {matchResult.isMatch ? "Validado automáticamente." : "Pasará a revisión manual."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-panel-text">Confirmar Datos</h4>
                    <p className="text-[10px] text-panel-text-muted mt-1">Confirma tu información antes del envío.</p>
                  </div>

                  <div className="border border-panel-border rounded-xl divide-y divide-slate-100 text-[11px] font-semibold text-panel-text">
                    <div className="p-3 bg-panel-hover-bg/50 flex justify-between">
                      <span className="text-panel-text-muted">DNI:</span>
                      <span className="text-green">{dniUploadedUrl ? "✓ Cargado" : "Pendiente"}</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-panel-text-muted">Rostro:</span>
                      <span className={matchResult?.isMatch ? "text-green" : "text-amber-600"}>
                        {matchResult ? `${matchResult.matchPercent}%` : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 pt-4 border-t border-panel-border flex justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="h-10 px-4 border border-panel-border rounded-lg text-xs font-bold text-panel-text-muted bg-panel-card-bg cursor-pointer"
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
                        setError("Espera a que se procese la foto de tu DNI.")
                        return
                      }
                      if (step === 2 && (!selfieUploadedUrl || !matchResult)) {
                        setError("Espera a que se procese tu selfie.")
                        return
                      }
                      setError(null)
                      setStep(prev => prev + 1)
                    }}
                    disabled={dniProcessing || selfieProcessing}
                    className="h-10 px-5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer border-0 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitKYC}
                    disabled={isSubmitting || success}
                    className="h-10 px-5 bg-accent text-white rounded-lg text-xs font-bold cursor-pointer border-0 shadow-sm"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2. STATE: EN REVISION */}
        {activeStatus === "EN_REVISION" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-xl p-6 text-center shadow-sm space-y-4">
            <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
              <SecurityCheckIcon size={24} />
            </div>
            <div>
              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-2">
                En Revisión
              </span>
              <h3 className="text-sm font-bold text-panel-text">Expediente en Evaluación</h3>
              <p className="text-[11px] font-medium text-panel-text-muted leading-relaxed max-w-xs mx-auto">
                Tu coincidencia facial fue baja, así que tus documentos están siendo revisados manualmente. El tiempo de respuesta es menor a 24 horas hábiles.
              </p>
            </div>
          </div>
        )}

        {/* 3. STATE: APROBADO */}
        {activeStatus === "APROBADO" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-xl p-8 text-center shadow-sm space-y-5">
            <div className="size-14 rounded-full flex items-center justify-center mx-auto shadow-lg bg-emerald-500 text-white shadow-emerald-500/20">
              <CheckmarkCircle01Icon size={28} />
            </div>
            <div>
              <span className="text-[9px] rounded font-bold px-2 py-0.5 inline-block mb-2 border bg-emerald-50 text-emerald-700 border-emerald-200">
                Perfil Activo ✓
              </span>
              <h3 className="text-sm font-bold text-panel-text">¡Tu perfil está activo!</h3>
              <p className="text-[11px] font-medium text-panel-text-muted leading-relaxed max-w-xs mx-auto">
                Ya puedes contactar arrendadores y firmar contratos con validez legal.
              </p>
              {verification?.verifiedAt && (
                <p className="text-[9px] text-panel-text-muted mt-2">Verificado el {formatLocalDate(verification.verifiedAt)}</p>
              )}
            </div>
            <Link
              href="/tenant/dashboard"
              className="block text-xs font-semibold text-panel-text-dim no-underline"
            >
              Ir al Panel →
            </Link>
          </div>
        )}

        {/* 4. STATE: RECHAZADO */}
        {activeStatus === "RECHAZADO" && (
          <div className="bg-panel-card-bg border border-panel-border rounded-xl p-6 text-center shadow-sm space-y-4">
            <div className="size-12 rounded-full bg-red/10 text-red flex items-center justify-center mx-auto">
              <AlertCircleIcon size={24} />
            </div>
            <div>
              <span className="text-[9px] bg-red/10 text-red border border-red/20 rounded font-bold px-2 py-0.5 inline-block mb-2">
                Rechazado
              </span>
              <h3 className="text-sm font-bold text-panel-text">Revisión Fallida</h3>
              <p className="text-[11px] font-medium text-panel-text-muted leading-relaxed mb-3">
                Lamentablemente tu expediente fue rechazado.
              </p>

              <div className="bg-red/5 border border-red/10 rounded-lg p-3 text-left">
                <span className="text-[9px] font-bold text-red block mb-0.5">Motivo:</span>
                <p className="text-[10px] text-red font-medium leading-relaxed">
                  {verification?.reviewNotes || "La foto del DNI es ilegible o no coincide. Por favor vuelve a intentarlo."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetWizard}
              className="w-full h-10 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer border-0 mt-2"
            >
              Intentar de Nuevo
            </button>
          </div>
        )}

      </div>

    </div>
  )
}
