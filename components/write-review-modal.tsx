"use client"

import { useState } from "react"
import { StarIcon, Cancel01Icon, CheckmarkCircle01Icon } from "hugeicons-react"
import { createReviewAction } from "@/app/actions/review-actions"

interface WriteReviewModalProps {
  propertyId: string
  propertyTitle: string
  onClose: () => void
  onSuccess?: () => void
}

export function WriteReviewModal({ propertyId, propertyTitle, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      setError("Por favor escribe un comentario detallado.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await createReviewAction({
        propertyId,
        rating,
        comment
      })

      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          if (onSuccess) onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Ocurrió un error al enviar la calificación.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#151c26]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl relative animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-gray-900 text-base">Escribir Reseña</h3>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer"
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-4">
            <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckmarkCircle01Icon size={40} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">¡Calificación Enviada!</h4>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Muchas gracias por tu reseña. Tu opinión ayuda a otros inquilinos a tomar mejores decisiones.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Inmueble</span>
              <h4 className="text-sm font-bold text-gray-800 leading-snug">{propertyTitle}</h4>
            </div>

            {/* Stars Selector */}
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Calificación del Inmueble</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 bg-transparent border-none cursor-pointer transition-transform hover:scale-110 outline-none"
                  >
                    <StarIcon
                      size={28}
                      className={
                        star <= (hoverRating ?? rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {rating === 5 ? "Excelente (5/5)" : rating === 4 ? "Muy bueno (4/5)" : rating === 3 ? "Bueno (3/5)" : rating === 2 ? "Regular (2/5)" : "Malo (1/5)"}
                </span>
              </div>
            </div>

            {/* Comment Field */}
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Tu Reseña / Experiencia</span>
              <textarea
                rows={4}
                required
                maxLength={500}
                placeholder="Cuéntanos sobre el estado del inmueble, el trato con el arrendador, comodidades, zona..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-slate-350 rounded-xl text-sm outline-none transition-all focus:border-accent-secondary bg-white text-gray-800 placeholder-gray-400 font-semibold"
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                <span>Sé descriptivo y respetuoso.</span>
                <span>{comment.length}/500 caracteres</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 bg-slate-50/20">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:-translate-y-px disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Publicar Calificación"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
