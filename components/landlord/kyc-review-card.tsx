'use client'

import { useState } from 'react'
import { CheckmarkCircle01Icon, Clock01Icon, Cancel01Icon, FileValidationIcon } from 'hugeicons-react'

interface KycRequest {
  id: string
  name: string
  email: string
  kycScore: number
  kycStatus: string
}

interface KycReviewCardProps {
  request: KycRequest
}

export function KycReviewCard({ request }: KycReviewCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleAction = async (actionType: 'approve' | 'reject') => {
    setIsProcessing(true)
    setAction(actionType)

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Aquí iría la lógica real de aprobación/rechazo
    console.log(`${actionType} KYC for user ${request.id}`)

    setIsProcessing(false)
    setAction(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50'
    if (score >= 60) return 'bg-amber-50'
    return 'bg-red-50'
  }

  // Simulación de validaciones KYC
  const validations = [
    { label: 'DNI Validado', status: 'completed', icon: CheckmarkCircle01Icon },
    { label: 'Antecedentes Limpios', status: 'completed', icon: CheckmarkCircle01Icon },
    { label: 'Solvencia Comprobada', status: 'pending', icon: Clock01Icon },
  ]

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
      {/* Header with Photo and Score */}
      <div className="flex items-start gap-4 mb-5">
        {/* User Photo */}
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}>
            <span className="text-white font-bold text-xl">
              {request.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
        </div>

        {/* User Info and Score */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-0.5 truncate" style={{ color: 'var(--text)' }}>
            {request.name}
          </h3>
          <p className="text-xs font-medium mb-2 truncate" style={{ color: 'var(--text-muted)' }}>
            {request.email}
          </p>
          
          {/* Score Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Score KYC:</span>
            <span className={`text-sm font-bold ${getScoreColor(request.kycScore)}`}>
              {request.kycScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Validation Checks */}
      <div className="space-y-2.5 mb-5">
        {validations.map((validation, index) => {
          const Icon = validation.icon
          const isCompleted = validation.status === 'completed'
          
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <div
                className={`h-8 w-8 rounded-lg ${
                  isCompleted ? 'bg-emerald-50' : 'bg-slate-100'
                } flex items-center justify-center flex-shrink-0`}
              >
                <Icon
                  size={16}
                  className={isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                />
              </div>
              <span
                className={`text-sm font-semibold`}
                style={{ color: isCompleted ? 'var(--text)' : 'var(--text-muted)' }}
              >
                {validation.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Reject Button */}
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300"
          style={{ color: 'var(--text-muted)' }}
        >
          {isProcessing && action === 'reject' ? (
            <>
              <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Cancel01Icon size={18} />
              <span>Rechazar</span>
            </>
          )}
        </button>

        {/* Approve Button */}
        <button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="h-12 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
            ['--tw-ring-color' as any]: 'var(--accent)'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.filter = 'brightness(1.1)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          {isProcessing && action === 'approve' ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <FileValidationIcon size={18} />
              <span>Aprobar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
