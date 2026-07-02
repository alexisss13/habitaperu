'use client'

import { Cancel01Icon } from "hugeicons-react"
import { AuthForm } from "./auth-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 size-9 flex items-center justify-center rounded-full bg-transparent border-none text-gray-500 cursor-pointer transition-colors hover:bg-gray-100 z-10"
        >
          <Cancel01Icon size={18} />
        </button>
        <div className="p-8">
          <AuthForm onAuthenticated={onAuthenticated} />
        </div>
      </div>
    </div>
  )
}
