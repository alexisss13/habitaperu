'use client'

import { createContext, useCallback, useContext, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { AuthModal } from "./auth-modal"

interface AuthModalContextValue {
  // Runs `action` right away if there's a session; otherwise opens the
  // login/register modal and runs it once the user authenticates.
  requireAuth: (action: () => void) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  const requireAuth = useCallback((action: () => void) => {
    // Treat "loading" as authenticated to avoid a false-positive modal
    // flash for already-logged-in users while the session is resolving.
    if (status !== 'unauthenticated') {
      action()
      return
    }
    pendingActionRef.current = action
    setIsOpen(true)
  }, [status])

  const handleAuthenticated = () => {
    setIsOpen(false)
    const action = pendingActionRef.current
    pendingActionRef.current = null
    action?.()
  }

  return (
    <AuthModalContext.Provider value={{ requireAuth }}>
      {children}
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider")
  return ctx
}
