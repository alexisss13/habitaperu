"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  SecurityCheckIcon, 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon, 
  ImageAdd01Icon 
} from "hugeicons-react"
import { submitKYCVerification } from "@/app/actions/kyc-actions"
import { uploadImageAction } from "@/app/actions/upload-actions"
import type { KYCVerificationData } from "./kyc-view"

interface Props {
  verification: KYCVerificationData | null
  isMockPayment: boolean
}

export function TenantKYCMobile({ verification, isMockPayment }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dniDocument, setDniDocument] = useState("")
  const [isBiometricDone, setIsBiometricDone] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [isReSubmitting, setIsReSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await uploadImageAction(formData, "kyc")
      if (res.success && res.url) {
        setDniDocument(res.url)
      } else {
        if (res.isMocked) {
          setError("Cloudinary no configurado. Se mantiene el simulador, por favor ingresa la URL de forma manual o usa la simulación.")
        } else {
          setError(res.error || "Error al subir el DNI.")
        }
      }
    } catch (err) {
      console.error(err)
      setError("Error de conexión al subir la imagen del DNI.")
    } finally {
      setUploading(false)
    }
  }

  const handleSimulateDni = () => {
    setDniDocument("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80")
  }

  const handleStartScan = () => {
    setIsScanning(true)
    setError(null)
    setTimeout(() => {
      setIsScanning(false)
      setScanSuccess(true)
      setIsBiometricDone(true)
    }, 2000)
  }

  const handleSubmitKYC = async () => {
    if (!dniDocument) {
      setError("Adjunta tu DNI.")
      setStep(1)
      return
    }
    if (!isBiometricDone) {
      setError("Completa el análisis facial.")
      setStep(2)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await submitKYCVerification(dniDocument)
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

  const formatLocalDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const activeStatus = isReSubmitting ? "PENDIENTE" : (verification?.status || "PENDIENTE")

  return (
    <div className="min-h-screen bg-bg-2 pb-24">
      {/* CSS Keyframes for Scan Effect */}
      <style jsx global>{`
        @keyframes scanEffect {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .scanner-line {
          animation: scanEffect 2.5s infinite linear;
        }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text">Verificación KYC</h1>
        <p className="text-xs font-medium text-text-muted mt-1">Verifica tu cuenta para firmar contratos</p>
      </div>

      <div className="px-4">
        
        {/* 1. STATE: PENDIENTE / WIZARD FLOW */}
        {activeStatus === "PENDIENTE" && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            
            {/* Steps indicator */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-text-muted">Paso {step} de 3</p>
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
                    <h4 className="text-xs font-bold text-text">Foto de DNI</h4>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                      Sube una fotografía del anverso de tu documento para realizar la validación OCR.
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-text-muted font-bold uppercase">Foto del Documento</span>
                    <div className="flex gap-2">
                      {uploading && <span className="text-[9px] text-accent animate-pulse font-bold">Subiendo...</span>}
                      <button
                        type="button"
                        onClick={handleSimulateDni}
                        className="text-[9px] text-accent hover:underline bg-transparent border-0 cursor-pointer font-bold"
                      >
                        Simular Carga
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-[10px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800 w-full"
                    />
                    <input 
                      type="text" 
                      value={dniDocument} 
                      onChange={(e) => setDniDocument(e.target.value)}
                      placeholder="O pega la URL de la foto de tu DNI aquí" 
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent bg-white"
                    />
                  </div>

                  {dniDocument && (
                    <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={dniDocument} 
                        alt="DNI" 
                        className="w-16 h-11 rounded object-cover border border-slate-300" 
                      />
                      <div>
                        <p className="text-[10px] font-bold text-text">dni_anverso.jpg</p>
                        <p className="text-[9px] text-text-muted">Cargado con éxito</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-text">Escaneo Facial</h4>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                      Completa el análisis biométrico usando tu rostro en la cámara.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl h-48 bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center p-4 text-white text-center">
                    {isScanning ? (
                      <>
                        <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-80 scanner-line" />
                        <div className="size-24 rounded-full border border-dashed border-cyan-400 animate-spin absolute" />
                        <p className="text-[10px] font-bold tracking-widest text-cyan-300 animate-pulse mt-12">ESCANEANDO...</p>
                      </>
                    ) : scanSuccess ? (
                      <div className="space-y-2">
                        <div className="size-11 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                          <CheckmarkCircle01Icon size={22} />
                        </div>
                        <p className="text-xs font-bold text-emerald-400">Escaneo Completado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-xl block">👤</span>
                        <p className="text-[10px] text-slate-400">Cámara Inactiva</p>
                        <button
                          type="button"
                          onClick={handleStartScan}
                          className="h-9 px-4 bg-accent text-white rounded-lg text-[10px] font-bold transition-all border-0"
                        >
                          Iniciar Escaneo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-text">Confirmar Datos</h4>
                    <p className="text-[10px] text-text-muted mt-1">Confirma tu información antes del envío legal.</p>
                  </div>

                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-[11px] font-semibold text-text">
                    <div className="p-3 bg-slate-50/50 flex justify-between">
                      <span className="text-text-muted">DNI:</span>
                      <span className="text-green">✓ Cargado</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-text-muted">Rostro:</span>
                      <span className="text-green">✓ Escaneado</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="h-10 px-4 border border-slate-200 rounded-lg text-xs font-bold text-text-muted bg-white cursor-pointer"
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
                      if (step === 1 && !dniDocument) {
                        setError("Adjunta la foto de tu DNI.")
                        return
                      }
                      if (step === 2 && !isBiometricDone) {
                        setError("Completa el escaneo facial.")
                        return
                      }
                      setError(null)
                      setStep(prev => prev + 1)
                    }}
                    className="h-10 px-5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer border-0"
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
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm space-y-4">
            <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
              <SecurityCheckIcon size={24} />
            </div>
            <div>
              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-2">
                En Revisión
              </span>
              <h3 className="text-sm font-bold text-text">Expediente en Evaluación</h3>
              <p className="text-[11px] font-medium text-text-muted leading-relaxed max-w-xs mx-auto">
                Tus documentos y prueba biométrica están siendo cotejados. El tiempo de respuesta es menor a 24 horas hábiles.
              </p>
            </div>
          </div>
        )}

        {/* 3. STATE: APROBADO */}
        {activeStatus === "APROBADO" && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm space-y-5">
            <div className="size-14 rounded-full flex items-center justify-center mx-auto shadow-lg bg-emerald-500 text-white shadow-emerald-500/20">
              <CheckmarkCircle01Icon size={28} />
            </div>
            <div>
              <span className="text-[9px] rounded font-bold px-2 py-0.5 inline-block mb-2 border bg-emerald-50 text-emerald-700 border-emerald-200">
                Perfil Activo ✓
              </span>
              <h3 className="text-sm font-bold text-text">¡Tu perfil está activo!</h3>
              <p className="text-[11px] font-medium text-text-muted leading-relaxed max-w-xs mx-auto">
                Ya puedes contactar arrendadores y firmar contratos con validez legal.
              </p>
            </div>
            <Link
              href="/tenant/dashboard"
              className="block text-xs font-semibold text-slate-400 no-underline"
            >
              Ir al Panel →
            </Link>
          </div>
        )}

        {/* 4. STATE: RECHAZADO */}
        {activeStatus === "RECHAZADO" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm space-y-4">
            <div className="size-12 rounded-full bg-red/10 text-red flex items-center justify-center mx-auto">
              <AlertCircleIcon size={24} />
            </div>
            <div>
              <span className="text-[9px] bg-red/10 text-red border border-red/20 rounded font-bold px-2 py-0.5 inline-block mb-2">
                Rechazado
              </span>
              <h3 className="text-sm font-bold text-text">Revisión Fallida</h3>
              <p className="text-[11px] font-medium text-text-muted leading-relaxed mb-3">
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
              onClick={() => {
                setError(null)
                setDniDocument("")
                setIsBiometricDone(false)
                setScanSuccess(false)
                setStep(1)
                setIsReSubmitting(true)
              }}
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
