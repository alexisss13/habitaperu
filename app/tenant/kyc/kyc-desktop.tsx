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

export function TenantKYCDesktop({ verification, isMockPayment }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dniDocument, setDniDocument] = useState("")
  const [isBiometricDone, setIsBiometricDone] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // State for re-submission if rejected
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
    // Simulated DNI image scan url
    setDniDocument("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80")
  }

  const handleStartScan = () => {
    setIsScanning(true)
    setError(null)
    
    // Simulate biometric scanning animation
    setTimeout(() => {
      setIsScanning(false)
      setScanSuccess(true)
      setIsBiometricDone(true)
    }, 2500)
  }

  const handleSubmitKYC = async () => {
    if (!dniDocument) {
      setError("Por favor adjunta la foto de tu DNI.")
      setStep(1)
      return
    }
    if (!isBiometricDone) {
      setError("Debes realizar la verificación facial biométrica.")
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
        setError(res.error || "Ocurrió un error al enviar el expediente.")
      }
    } catch (err) {
      console.error(err)
      setError("Error de red inesperado al enviar.")
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="min-h-screen bg-bg-2 ">
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-2">Verificación de Identidad (KYC)</h1>
          <p className="text-base font-medium text-text-muted">
            Valida tus datos y activa tu perfil para poder celebrar contratos con firmas digitales válidas.
          </p>
        </div>

        {/* 1. STATE: PENDIENTE / WIZARD FLOW */}
        {activeStatus === "PENDIENTE" && (
          <div className="grid grid-cols-3 gap-8">
            {/* Left Col (2 cols): Wizard */}
            <div className="col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              
              {/* Wizard Steps indicator */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text">Proceso de Verificación</h3>
                  <p className="text-xs text-text-muted mt-0.5">Paso {step} de 3</p>
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

                {/* Step 1: DNI Photo upload */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-text mb-1.5">Documento de Identidad</h4>
                      <p className="text-xs text-text-muted mb-4 leading-relaxed">
                        Sube una foto clara y legible del anverso de tu Documento Nacional de Identidad (DNI) o Carnet de Extranjería.
                      </p>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-text-muted font-bold uppercase">Foto del Documento</span>
                      <div className="flex gap-2">
                        {uploading && <span className="text-[10px] text-accent animate-pulse font-bold">Subiendo...</span>}
                        <button
                          type="button"
                          onClick={handleSimulateDni}
                          className="text-[10px] text-accent hover:underline bg-transparent border-0 cursor-pointer font-bold"
                        >
                          Simular Carga de DNI
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800 w-full"
                      />
                      <input 
                        type="text" 
                        value={dniDocument} 
                        onChange={(e) => setDniDocument(e.target.value)}
                        placeholder="O pega la URL de la foto de tu DNI aquí" 
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent bg-white"
                      />
                    </div>

                    {dniDocument && (
                      <div className="mt-4 border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={dniDocument} 
                          alt="DNI" 
                          className="w-24 h-16 rounded object-cover border border-slate-300" 
                        />
                        <div>
                          <p className="text-xs font-bold text-text">DNI_Anverso_Digital.jpg</p>
                          <p className="text-[10px] text-text-muted">Documento en alta resolución cargado para análisis OCR</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Facial Biometric analysis */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-text mb-1.5">Verificación Facial Biométrica</h4>
                      <p className="text-xs text-text-muted mb-4 leading-relaxed">
                        El sistema realizará una toma de puntos faciales para corroborar que tu rostro coincida con la fotografía de tu DNI.
                      </p>
                    </div>

                    {/* Camera Scanner Simulation viewport */}
                    <div className="border border-slate-200 rounded-2xl h-64 bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center p-6 text-white text-center">
                      {isScanning ? (
                        <>
                          {/* Animated scanner bar line */}
                          <div className="absolute left-0 right-0 h-1 bg-cyan-400 opacity-85 shadow-[0_0_10px_#22d3ee] scanner-line" />
                          <div className="size-32 rounded-full border-2 border-dashed border-cyan-400 animate-spin absolute" />
                          <p className="text-xs font-bold tracking-widest text-cyan-300 animate-pulse z-10 mt-20">ESCANEANDO ROSTRO...</p>
                        </>
                      ) : scanSuccess ? (
                        <div className="space-y-3 z-10">
                          <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                            <CheckmarkCircle01Icon size={32} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-400">Análisis Biométrico Completado</p>
                            <p className="text-[10px] text-slate-300 mt-1">Coincidencia con DNI: 98.6% (Aprobado)</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 z-10">
                          <div className="size-16 rounded-full border border-dashed border-slate-500 flex items-center justify-center mx-auto text-slate-400">
                            <span className="text-2xl">👤</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">Cámara Inactiva</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Haz clic en iniciar para simular el escaneo facial</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleStartScan}
                            className="h-10 px-6 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border-0"
                          >
                            Iniciar Análisis Facial
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Review and submit */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-text mb-1.5">Confirmar Expediente KYC</h4>
                      <p className="text-xs text-text-muted mb-4 leading-relaxed">
                        Revisa que la información cargada esté en orden antes de enviarla a los asesores legales de Habita Perú.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-xl overflow-hidden text-xs font-semibold text-text divide-y divide-slate-100">
                      <div className="p-3.5 bg-slate-50/50 flex justify-between">
                        <span className="text-text-muted">Documento DNI:</span>
                        <span className="text-emerald-600">✓ Cargado</span>
                      </div>
                      <div className="p-3.5 flex justify-between">
                        <span className="text-text-muted">Escaneo Biométrico:</span>
                        <span className="text-emerald-600">✓ Verificado con éxito</span>
                      </div>
                      <div className="p-3.5 bg-slate-50/50 flex justify-between">
                        <span className="text-text-muted">Verificación Antecedentes:</span>
                        <span className="text-amber-600">⚙ Encolada (Automática)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard Footer Nav */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(prev => prev - 1)}
                      className="h-11 px-5 border border-slate-200 rounded-xl text-xs font-bold text-text-muted hover:bg-slate-50 transition-colors cursor-pointer bg-white"
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
                          setError("Por favor adjunta la foto de tu DNI.")
                          return
                        }
                        if (step === 2 && !isBiometricDone) {
                          setError("Por favor completa el escaneo facial.")
                          return
                        }
                        setError(null)
                        setStep(prev => prev + 1)
                      }}
                      className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
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
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <SecurityCheckIcon size={22} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-text">Privacidad Protegida</h4>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                      Cumplimos estrictamente con la Ley N° 29733 de Protección de Datos Personales en el Perú. Tus documentos son encriptados en reposo y solo se usan para validaciones contractuales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">¿Por qué es necesario?</h4>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Para otorgar validez jurídica a las firmas electrónicas sobre contratos de desalojo exprés (Ley N° 30933) y allanamiento futuro (Ley N° 30201), requerimos validar la identidad del firmante con RENIEC para prevenir suplantaciones.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. STATE: EN REVISION */}
        {activeStatus === "EN_REVISION" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
              <SecurityCheckIcon size={32} />
            </div>
            <div>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold px-2 py-0.5 inline-block mb-3">
                Expediente en Revisión
              </span>
              <h3 className="text-lg font-bold text-text mb-2">Expediente en Proceso de Evaluación</h3>
              <p className="text-xs font-medium text-text-muted leading-relaxed max-w-sm mx-auto">
                Tus documentos DNI y prueba facial biométrica están siendo cotejados con el padrón electoral por nuestros oficiales legales. El tiempo máximo de respuesta es de <strong>24 horas hábiles</strong>.
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 text-[10px] text-text-muted">
              Te enviaremos una notificación al correo electrónico registrado en cuanto se valide tu perfil.
            </div>
          </div>
        )}

        {/* 3. STATE: APROBADO */}
        {activeStatus === "APROBADO" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-20 rounded-full flex items-center justify-center mx-auto shadow-xl bg-emerald-500 text-white shadow-emerald-500/20">
              <CheckmarkCircle01Icon size={44} />
            </div>
            <div>
              <span className="text-[10px] rounded font-bold px-2.5 py-0.5 inline-block mb-3 border bg-emerald-50 text-emerald-700 border-emerald-200">
                Perfil Verificado Activo ✓
              </span>
              <h3 className="text-lg font-bold text-text mb-2">
                ¡Tu perfil está completamente activo!
              </h3>
              <p className="text-xs font-medium text-text-muted leading-relaxed max-w-sm mx-auto">
                Ya puedes contactar arrendadores y firmar contratos con validez jurídica en la plataforma.
              </p>
              {verification?.verifiedAt && (
                <p className="text-[10px] text-text-muted mt-3">Verificado el {formatLocalDate(verification.verifiedAt)}</p>
              )}
            </div>
            <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
              <Link
                href="/tenant/dashboard"
                className="inline-flex h-11 items-center justify-center px-6 rounded-xl text-xs font-bold transition-all no-underline text-slate-500 hover:text-text"
              >
                Ir al Panel Principal →
              </Link>
            </div>
          </div>
        )}

        {/* 4. STATE: RECHAZADO */}
        {activeStatus === "RECHAZADO" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto my-10 space-y-6">
            <div className="size-16 rounded-full bg-red-50 text-red border border-red-200 flex items-center justify-center mx-auto">
              <AlertCircleIcon size={32} />
            </div>
            <div>
              <span className="text-[10px] bg-red/10 text-red border border-red/20 rounded font-bold px-2 py-0.5 inline-block mb-3">
                Verificación Rechazada
              </span>
              <h3 className="text-lg font-bold text-text mb-2">Revisión de Identidad Fallida</h3>
              <p className="text-xs font-medium text-text-muted leading-relaxed max-w-sm mx-auto mb-4">
                Lamentablemente tu expediente de identidad fue rechazado por nuestros asesores legales.
              </p>
              
              <div className="bg-red/5 border border-red/10 rounded-xl p-4 text-left">
                <span className="text-[10px] font-bold text-red block mb-1 uppercase tracking-wider">Motivo de Rechazo:</span>
                <p className="text-xs text-red font-medium leading-relaxed">
                  {verification?.reviewNotes || "La foto del DNI es borrosa o no coincide con los registros. Por favor sube una imagen con mayor nitidez."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
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
