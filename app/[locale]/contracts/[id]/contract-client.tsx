'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  SecurityCheckIcon, 
  SignatureIcon, 
  Download01Icon, 
  FileValidationIcon, 
  AlertCircleIcon, 
  CheckmarkCircle01Icon,
  LeftToRightListNumberIcon
} from "hugeicons-react"
import { signContractAsTenant, counterSignAsLandlord } from "@/app/actions/contract-actions"
import { processSuccessFee } from "@/app/actions/culqi-actions"
import { PaymentModal } from "@/components/ui/payment-modal"
import Link from "next/link"

interface UserFields {
  id: string
  firstName: string
  lastName: string
  dni: string | null
  email: string
}

interface PropertyFields {
  id: string
  title: string
  address: string | null
  district: string
}

interface ContractData {
  id: string
  status: "DRAFT" | "PENDING_TENANT" | "PENDING_LANDLORD" | "ACTIVE" | "FINISHED" | "BREACHED_CANCELLED"
  documentHash: string | null
  landlordSignedAt: string | null
  tenantSignedAt: string | null
  monthlyRent: number
  deposit: number
  successFeePaid: boolean
  landlord: UserFields
  tenant: UserFields
  property: PropertyFields
}

interface Props {
  contract: ContractData
  html: string
  isLandlord: boolean
  isTenant: boolean
  locale: string
  isMockPayment: boolean
}

export function ContractClient({ contract: initialContract, html, isLandlord, isTenant, locale, isMockPayment }: Props) {
  const router = useRouter()
  const [contract, setContract] = useState<ContractData>(initialContract)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showSuccessFeeModal, setShowSuccessFeeModal] = useState(
    initialContract.status === "ACTIVE" && isLandlord && !initialContract.successFeePaid
  )

  const handleSign = async () => {
    if (!acceptedTerms) {
      setError("Debes aceptar la declaración jurada antes de firmar.")
      return
    }

    setError(null)
    setIsSigning(true)

    try {
      if (isTenant) {
        const res = await signContractAsTenant(contract.id)
        if (res.success && res.data) {
          setSuccess("¡Contrato firmado con éxito! Esperando la contrafirma del arrendador.")
          setContract(prev => ({ 
            ...prev, 
            status: res.data!.status,
            tenantSignedAt: new Date().toISOString()
          }))
          router.refresh()
        } else {
          setError(res.error?.message || "Ocurrió un error al firmar el contrato.")
        }
      } else if (isLandlord) {
        const res = await counterSignAsLandlord(contract.id)
        if (res.success && res.data) {
          setSuccess("¡Contrato contrafirmado y activado con éxito!")
          setContract(prev => ({
            ...prev,
            status: res.data!.status,
            landlordSignedAt: new Date().toISOString(),
          }))
          // Abrir modal de success fee automáticamente al activar
          if (res.data.status === "ACTIVE") {
            setTimeout(() => setShowSuccessFeeModal(true), 800)
          }
          router.refresh()
        } else {
          setError(res.error?.message || "Ocurrió un error al contrafirmar el contrato.")
        }
      }
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
    } finally {
      setIsSigning(false)
    }
  }

  const handleDownloadPdf = () => {
    window.open(`/api/contracts/${contract.id}/download`, "_blank")
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT": return { label: "Borrador", color: "bg-slate-100 text-slate-700 border-slate-300" }
      case "PENDING_TENANT": return { label: "Esperando Inquilino", color: "bg-amber-50 text-amber-700 border-amber-300" }
      case "PENDING_LANDLORD": return { label: "Esperando Propietario", color: "bg-amber-50 text-amber-700 border-amber-300" }
      case "ACTIVE": return { label: "Activo / Vigente", color: "bg-emerald-50 text-emerald-700 border-emerald-300" }
      case "FINISHED": return { label: "Finalizado", color: "bg-slate-100 text-slate-500 border-slate-300" }
      case "BREACHED_CANCELLED": return { label: "Rescindido", color: "bg-red/10 text-red border-red/30" }
      default: return { label: status, color: "bg-slate-100 text-slate-700 border-slate-300" }
    }
  }

  const statusInfo = getStatusLabel(contract.status)

  return (
    <>
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link 
            href={isLandlord ? "/landlord/contracts" : "/tenant/dashboard"}
            className="text-xs font-semibold text-text-muted hover:text-accent flex items-center gap-1.5 no-underline transition-colors"
          >
            <span>&larr; Volver</span>
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <h1 className="text-base font-bold text-text truncate max-w-[200px] md:max-w-none">
            Firma de Contrato: {contract.property.title}
          </h1>
        </div>
        <div className={`text-xs font-bold border rounded-lg px-2.5 py-1 ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </header>

      {/* Main split layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Scrollable contract document */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-100">
          <div className="bg-white max-w-[850px] w-full p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] rounded-2xl border border-slate-200 relative overflow-hidden self-start">
            {/* Watermark in background if not active */}
            {contract.status !== "ACTIVE" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none rotate-[-45deg]">
                <span className="text-8xl font-black">BORRADOR NO VALIDO</span>
              </div>
            )}
            {/* Inject generatePeruvianLeaseAgreement HTML style nicely */}
            <div 
              className="prose max-w-none text-slate-800"
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          </div>
        </div>

        {/* Right Side: Sidebar interactive clickwrap panel */}
        <aside className="w-full lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 md:p-8 overflow-y-auto flex flex-col gap-6 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16">
          
          {/* Sello LegalTech Security Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <SecurityCheckIcon size={24} className="text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-text mb-1">Protección LegalTech</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Este contrato digital está respaldado por las Leyes N° 27269, 30201 y 30933 de la República del Perú.
                </p>
              </div>
            </div>
            {contract.documentHash && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-wider">
                  Sello Digital SHA-256:
                </p>
                <div className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-[9px] break-all select-all text-slate-600">
                  {contract.documentHash}
                </div>
              </div>
            )}
          </div>

          {/* Timeline / Signature States */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Estado de Firmas</h4>
            
            <div className="flex items-start gap-3.5 relative pb-4">
              <div className="absolute top-6 bottom-0 left-[11px] w-0.5 bg-slate-200" />
              <div className={`size-6 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                contract.tenantSignedAt ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 text-slate-400"
              }`}>
                {contract.tenantSignedAt ? <CheckmarkCircle01Icon size={14} /> : <span className="text-xs font-bold">1</span>}
              </div>
              <div>
                <p className="text-sm font-bold text-text">Inquilino (Arrendatario)</p>
                <p className="text-xs text-text-muted mt-0.5">{contract.tenant.firstName} {contract.tenant.lastName}</p>
                {contract.tenantSignedAt ? (
                  <p className="text-[10px] text-green font-medium mt-1">
                    Firmado el {new Date(contract.tenantSignedAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="text-[10px] text-amber-600 font-medium mt-1">Pendiente de firma</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3.5 relative">
              <div className={`size-6 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                contract.landlordSignedAt ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 text-slate-400"
              }`}>
                {contract.landlordSignedAt ? <CheckmarkCircle01Icon size={14} /> : <span className="text-xs font-bold">2</span>}
              </div>
              <div>
                <p className="text-sm font-bold text-text">Propietario (Arrendador)</p>
                <p className="text-xs text-text-muted mt-0.5">{contract.landlord.firstName} {contract.landlord.lastName}</p>
                {contract.landlordSignedAt ? (
                  <p className="text-[10px] text-green font-medium mt-1">
                    Firmado el {new Date(contract.landlordSignedAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="text-[10px] text-amber-600 font-medium mt-1">Pendiente de contrafirma</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            {/* Error notifications */}
            {error && (
              <div className="bg-red/10 border border-red/20 text-red rounded-xl p-4 flex items-start gap-2.5 mb-4 text-xs font-medium">
                <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success notifications */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-green rounded-xl p-4 flex items-start gap-2.5 mb-4 text-xs font-medium">
                <CheckmarkCircle01Icon size={16} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Signing Flow for Tenant */}
            {isTenant && (contract.status === "PENDING_TENANT" || contract.status === "DRAFT") && !contract.tenantSignedAt && (
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="size-4 shrink-0 rounded border-slate-300 text-accent focus:ring-accent mt-0.5"
                  />
                  <span className="text-xs font-medium text-text-muted leading-relaxed">
                    Declaro bajo juramento que he leído y acepto todas las cláusulas, sometiéndome a las Leyes N° 30201 (Allanamiento Futuro), 30933 (Desalojo Exprés) y 27269 (Firmas Digitales).
                  </span>
                </label>

                <button
                  onClick={handleSign}
                  disabled={isSigning || !acceptedTerms}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                >
                  {isSigning ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Firmando contrato...</span>
                    </>
                  ) : (
                    <>
                      <SignatureIcon size={18} />
                      <span>Aceptar y Firmar Contrato</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Signing Flow for Landlord */}
            {isLandlord && contract.status === "PENDING_LANDLORD" && !contract.landlordSignedAt && (
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="size-4 shrink-0 rounded border-slate-300 text-accent focus:ring-accent mt-0.5"
                  />
                  <span className="text-xs font-medium text-text-muted leading-relaxed">
                    Declaro bajo juramento que contrafirmo este contrato de arrendamiento residencial, autorizando la activación del arriendo y el cambio de estado de la propiedad a OCUPADA.
                  </span>
                </label>

                <button
                  onClick={handleSign}
                  disabled={isSigning || !acceptedTerms}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                >
                  {isSigning ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Contrafirmando...</span>
                    </>
                  ) : (
                    <>
                      <FileValidationIcon size={18} />
                      <span>Contrafirmar y Activar</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Active: success fee pendiente (landlord) */}
            {contract.status === "ACTIVE" && isLandlord && !contract.successFeePaid && (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-800 mb-1">Pago pendiente — S/ 29.00</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Tu contrato está activo. Completa el pago para registrarlo oficialmente en Habita Perú.
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessFeeModal(true)}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 border-none cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
                >
                  <SecurityCheckIcon size={16} />
                  Completar pago — S/ 29.00
                </button>
              </div>
            )}

            {/* Active: contrato completamente pagado */}
            {contract.status === "ACTIVE" && (!isLandlord || contract.successFeePaid) && (
              <button
                onClick={handleDownloadPdf}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                <Download01Icon size={18} />
                <span>Descargar Contrato (PDF)</span>
              </button>
            )}

            {/* Sign status messages */}
            {contract.status === "PENDING_LANDLORD" && isTenant && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-text">¡Ya firmaste este contrato!</p>
                <p className="text-[10px] text-text-muted mt-1">Esperando que el arrendador complete la contrafirma.</p>
              </div>
            )}

            {contract.status === "PENDING_TENANT" && isLandlord && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-text">Esperando firma del inquilino</p>
                <p className="text-[10px] text-text-muted mt-1">El inquilino debe firmar primero para que puedas contrafirmar.</p>
              </div>
            )}
          </div>

        </aside>
      </div>
    </div>

    {/* Modal de success fee */}
    <PaymentModal
      isOpen={showSuccessFeeModal}
      onClose={() => setShowSuccessFeeModal(false)}
      onSuccess={() => {
        setContract(prev => ({ ...prev, successFeePaid: true }))
        setSuccess("¡Pago completado! Tu contrato está completamente registrado.")
        setShowSuccessFeeModal(false)
      }}
      amount={29}
      title="Registrar contrato en Habita Perú"
      description="Pago único por contrato firmado exitosamente"
      ctaLabel="Pagar S/ 29.00"
      isMockMode={isMockPayment}
      onProcessPayment={(token) => processSuccessFee(contract.id, token)}
    />
    </>
  )
}
