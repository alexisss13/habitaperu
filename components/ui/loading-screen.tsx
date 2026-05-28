interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-2">
      <div className="text-center">
        <div
          className="size-20 mx-auto mb-6 rounded-[20px] flex items-center justify-center animate-pulse"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <span className="text-3xl font-extrabold text-white">H</span>
        </div>
        <p className="text-base font-medium text-text-muted">{message}</p>
      </div>
    </div>
  )
}
