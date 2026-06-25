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
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(`${actionType} KYC for user ${request.id}`)
    setIsProcessing(false)
    setAction(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const validations = [
    { label: 'DNI Validado', status: 'completed', icon: CheckmarkCircle01Icon },
    { label: 'Antecedentes Limpios', status: 'completed', icon: CheckmarkCircle01Icon },
    { label: 'Solvencia Comprobada', status: 'pending', icon: Clock01Icon },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0">
          <div
            className="size-16 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
          >
            <span className="text-white font-bold text-xl">
              {request.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text mb-0.5 truncate">{request.name}</h3>
          <p className="text-xs font-medium text-text-muted mb-2 truncate">{request.email}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold text-text-muted">Score KYC:</span>
            <span className={`text-sm font-bold ${getScoreColor(request.kycScore)}`}>
              {request.kycScore}/100
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        {validations.map((validation, index) => {
          const Icon = validation.icon
          const isCompleted = validation.status === 'completed'
          return (
            <div key={validation.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                <Icon size={16} className={isCompleted ? 'text-emerald-600' : 'text-slate-400'} />
              </div>
              <span className={`text-sm font-semibold ${isCompleted ? 'text-text' : 'text-text-muted'}`}>
                {validation.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-text-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300"
        >
          {isProcessing && action === 'reject' ? (
            <>
              <div className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Cancel01Icon size={18} />
              <span>Rechazar</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="h-12 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          {isProcessing && action === 'approve' ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
