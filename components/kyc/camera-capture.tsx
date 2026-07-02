"use client"

import { useEffect, useRef, useState } from "react"
import { Camera01Icon, RefreshIcon, AlertCircleIcon } from "hugeicons-react"

interface CameraCaptureProps {
  /** "user" = cámara frontal (selfie), "environment" = cámara trasera (documentos) */
  facingMode: "user" | "environment"
  activateLabel: string
  captureLabel: string
  guideText?: string
  /** Relación de aspecto del visor: cuadrado para selfie, horizontal para documento */
  aspect?: "square" | "video"
  onCapture: (file: File, previewUrl: string) => void
}

export function CameraCapture({
  facingMode,
  activateLabel,
  captureLabel,
  guideText,
  aspect = "video",
  onCapture,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captured, setCaptured] = useState<string | null>(null)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
  }

  useEffect(() => () => stopStream(), [])

  const handleActivate = async () => {
    setError(null)
    setCaptured(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsActive(true)
    } catch (err) {
      console.error(err)
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setError("Permiso de cámara denegado. Habilítalo en la configuración del navegador para continuar.")
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setError("No se encontró ninguna cámara disponible en este dispositivo.")
      } else {
        setError("No se pudo acceder a la cámara. Verifica los permisos e intenta de nuevo.")
      }
      setIsActive(false)
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" })
      const previewUrl = URL.createObjectURL(blob)
      setCaptured(previewUrl)
      stopStream()
      setIsActive(false)
      onCapture(file, previewUrl)
    }, "image/jpeg", 0.92)
  }

  const handleRetake = () => {
    setCaptured(null)
    handleActivate()
  }

  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video"
  const maxWidthClass = aspect === "square" ? "max-w-[220px]" : "max-w-sm"

  return (
    <div className={`space-y-2.5 mx-auto ${maxWidthClass}`}>
      <div className={`relative w-full ${aspectClass} rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center`}>
        {/* Video feed */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isActive ? "block" : "hidden"} ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {captured ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captured} alt="Captura" className="w-full h-full object-cover" />
        ) : !isActive && (
          <div className="flex flex-col items-center gap-2 text-center p-4">
            {error ? (
              <>
                <AlertCircleIcon size={22} className="text-red-400" />
                <p className="text-[11px] text-red-300 font-semibold max-w-xs">{error}</p>
              </>
            ) : (
              <>
                <Camera01Icon size={22} className="text-slate-400" />
                {guideText && <p className="text-[11px] text-slate-300 max-w-xs">{guideText}</p>}
              </>
            )}
            <button
              type="button"
              onClick={handleActivate}
              className="h-9 px-4 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
            >
              {activateLabel}
            </button>
          </div>
        )}
      </div>

      {isActive && !captured && (
        <button
          type="button"
          onClick={handleCapture}
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
        >
          <Camera01Icon size={14} />
          {captureLabel}
        </button>
      )}

      {captured && (
        <button
          type="button"
          onClick={handleRetake}
          className="w-full h-9 border border-panel-border rounded-xl text-xs font-bold text-panel-text-muted hover:bg-panel-hover-bg transition-colors cursor-pointer bg-panel-card-bg flex items-center justify-center gap-2"
        >
          <RefreshIcon size={13} />
          Volver a tomar
        </button>
      )}
    </div>
  )
}
