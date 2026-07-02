'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  FileValidationIcon, 
  Add01Icon, 
  Home01Icon, 
  UserCircleIcon, 
  Cancel01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { Pagination } from "@/components/ui/pagination"
import { createDraftContract, sendContractToTenant } from "@/app/actions/contract-actions"
import { createTenantReview } from "@/app/actions/review-actions"
import { StarIcon } from "hugeicons-react"

interface LandlordInfo {
  id: string
  firstName: string
  lastName: string
  dni: string | null
  email: string
  phone: string | null
  district: string | null
}

interface TenantInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  dni?: string | null
  phone?: string | null
  district?: string | null
}

interface PropertyInfo {
  id: string
  title: string
  price: number
  district: string
  address?: string | null
  type?: "HABITACION" | "DEPARTAMENTO" | "CASA" | "OFICINA" | "LOCAL"
  area?: number | null
  rooms?: number
  bathrooms?: number
}

interface ContractInfo {
  id: string
  status: "DRAFT" | "PENDING_TENANT" | "PENDING_LANDLORD" | "ACTIVE" | "FINISHED" | "BREACHED_CANCELLED"
  monthlyRent: number
  currency: string
  startDate: string
  endDate: string
  tenant: TenantInfo
  property: PropertyInfo
  createdAt: string
}

interface Props {
  landlord: LandlordInfo
  contracts: ContractInfo[]
  properties: PropertyInfo[]
  tenants: TenantInfo[]
}

export function ContractsDesktop({ landlord, contracts, properties, tenants }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("TODOS")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tenantReviewModal, setTenantReviewModal] = useState<{
    contractId: string
    tenantName: string
  } | null>(null)
  const [tenantReviewRating, setTenantReviewRating] = useState(5)
  const [tenantReviewComment, setTenantReviewComment] = useState("")
  const [tenantReviewLoading, setTenantReviewLoading] = useState(false)
  const [tenantReviewDone, setTenantReviewDone] = useState<string[]>([])
  const [sendingId, setSendingId] = useState<string | null>(null)

  const handleSendToTenant = async (contractId: string) => {
    setSendingId(contractId)
    try {
      const res = await sendContractToTenant(contractId)
      if (!res.success) {
        alert(res.error?.message || "Ocurrió un error al enviar el contrato.")
      }
      router.refresh()
    } finally {
      setSendingId(null)
    }
  }

  // Form states
  const [selectedPropertyId, setSelectedPropertyId] = useState("")
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [monthlyRent, setMonthlyRent] = useState("")
  const [currency, setCurrency] = useState("PEN")
  const [deposit, setDeposit] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paymentDay, setPaymentDay] = useState("5")
  
  // Bank Account states
  const [bankProvider, setBankProvider] = useState<"Niubiz" | "Culqi" | "Izipay" | "BCP" | "Interbank" | "BBVA">("BCP")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankAccountHolder, setBankAccountHolder] = useState(`${landlord.firstName} ${landlord.lastName}`)

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setStep(1)
    setError(null)
    setSelectedPropertyId("")
    setSelectedTenantId("")
    setMonthlyRent("")
    setDeposit("")
    setStartDate("")
    setEndDate("")
    setPaymentDay("5")
    setBankAccountNumber("")
  }

  const handlePropertySelect = (propertyId: string, price: number) => {
    setSelectedPropertyId(propertyId)
    setMonthlyRent(price.toString())
    setDeposit(price.toString()) // Default: 1 month warranty
    setStep(2)
  }

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    setStep(3)
  }

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!monthlyRent || !deposit || !startDate || !endDate || !paymentDay) {
      setError("Por favor completa todos los campos de este paso.")
      return
    }
    setError(null)
    setStep(4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankAccountNumber) {
      setError("Por favor ingresa el número de cuenta bancaria.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await createDraftContract({
        propertyId: selectedPropertyId,
        tenantId: selectedTenantId,
        monthlyRent: Number(monthlyRent),
        currency: currency as "PEN" | "USD",
        deposit: Number(deposit),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paymentDay: Number(paymentDay),
        paymentAccount: {
          provider: bankProvider,
          accountNumber: bankAccountNumber,
          accountHolder: bankAccountHolder,
        },
      })

      if (res.success) {
        // Enlazar los detalles de la cuenta de banco en contract.terms
        // En un caso real esto se serializa automáticamente o lo maneja la acción
        setIsModalOpen(false)
        router.refresh()
      } else {
        setError(res.error?.message || "Ocurrió un error al crear el contrato.")
      }
    } catch (err) {
      console.error(err)
      setError("Error interno. Asegúrate de que los campos tienen formatos válidos.")
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(c => filter === "TODOS" || c.status === filter)
  const pagination = usePagination(filteredContracts, 10, [filter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-panel-hover-bg text-panel-text-dim border border-panel-border rounded-lg">Borrador</span>
      case "PENDING_TENANT": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Firma I</span>
      case "PENDING_LANDLORD": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">Espera Propietario</span>
      case "ACTIVE": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Activo</span>
      case "FINISHED": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-panel-hover-bg text-panel-text-dim border border-panel-border rounded-lg">Finalizado</span>
      case "BREACHED_CANCELLED": 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-red/10 text-red border border-red/20 rounded-lg">Rescindido</span>
      default: 
        return <span className="px-2.5 py-1 text-xs font-semibold bg-panel-hover-bg text-panel-text-dim border border-panel-border rounded-lg">{status}</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 bg-panel-card-bg p-1.5 border border-panel-border rounded-xl max-w-max">
          {["TODOS", "DRAFT", "PENDING_TENANT", "PENDING_LANDLORD", "ACTIVE"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === status
                  ? "bg-[#151c26] text-white shadow-sm"
                  : "text-panel-text-muted hover:text-panel-text hover:bg-panel-hover-bg"
              }`}
            >
              {status === "TODOS" ? "Todos" : status === "DRAFT" ? "Borradores" : status === "PENDING_TENANT" ? "Pendientes Inquilino" : status === "PENDING_LANDLORD" ? "Por Contrafirmar" : "Activos"}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenModal}
          className="h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-sm hover:brightness-110 flex items-center gap-2 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <Add01Icon size={18} />
          <span>Crear Contrato</span>
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-panel-card-bg border border-panel-border rounded-xl overflow-hidden">
        {filteredContracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-panel-border bg-panel-hover-bg/50">
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider">Propiedad</th>
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider">Inquilino</th>
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider">Renta Mensual</th>
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider">Vigencia</th>
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-panel-text-muted uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.paginatedItems.map(c => (
                  <tr key={c.id} className="hover:bg-panel-hover-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-panel-text">{c.property.title}</div>
                      <div className="text-xs text-panel-text-muted mt-0.5">{c.property.district}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-panel-text">{c.tenant.firstName} {c.tenant.lastName}</div>
                      <div className="text-xs text-panel-text-muted mt-0.5">{c.tenant.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm text-panel-text">
                        S/ {Number(c.monthlyRent).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-panel-text">
                        {new Date(c.startDate).toLocaleDateString("es-PE")} al {new Date(c.endDate).toLocaleDateString("es-PE")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "ACTIVE" && !tenantReviewDone.includes(c.id) && (
                          <button
                            onClick={() => setTenantReviewModal({
                              contractId: c.id,
                              tenantName: `${c.tenant.firstName} ${c.tenant.lastName}`,
                            })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            <StarIcon size={11} />
                            Calificar
                          </button>
                        )}
                        {c.status === "DRAFT" && (
                          <button
                            onClick={() => handleSendToTenant(c.id)}
                            disabled={sendingId === c.id}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg border border-accent bg-accent text-white hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingId === c.id ? "Enviando..." : "Enviar al inquilino"}
                          </button>
                        )}
                        <Link
                          href={`/contracts/${c.id}`}
                          className={`inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg border transition-all no-underline ${
                            c.status === "PENDING_LANDLORD"
                              ? "bg-accent border-accent text-white hover:brightness-110"
                              : "bg-panel-card-bg border-panel-border text-panel-text-muted hover:border-slate-300 hover:text-panel-text"
                          }`}
                        >
                          {c.status === "PENDING_LANDLORD" ? "Contrafirmar" : "Ver Contrato"}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <FileValidationIcon size={48} className="text-panel-text-dim mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-panel-text mb-1">Sin contratos</h3>
            <p className="text-xs font-medium text-panel-text-muted">No se encontraron contratos para el filtro seleccionado.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredContracts.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="contratos"
        />
      )}

      {/* Modal: calificar inquilino */}
      {tenantReviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-panel-border flex items-center justify-between bg-panel-hover-bg/50">
              <h3 className="text-base font-bold text-panel-text">Calificar a {tenantReviewModal.tenantName}</h3>
              <button onClick={() => setTenantReviewModal(null)} className="text-panel-text-dim hover:text-panel-text bg-transparent border-0 cursor-pointer p-1">
                <Cancel01Icon size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-panel-text-dim uppercase tracking-wide mb-2">Calificación</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setTenantReviewRating(s)}
                      className="p-1 bg-transparent border-none cursor-pointer text-2xl">
                      <span className={s <= tenantReviewRating ? "text-amber-400" : "text-slate-200"}>★</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-panel-text-dim uppercase tracking-wide mb-1.5">Comentario</p>
                <textarea rows={3} value={tenantReviewComment} onChange={e => setTenantReviewComment(e.target.value)}
                  placeholder="Puntualidad de pagos, cuidado del inmueble, comunicación..."
                  className="w-full px-3 py-2.5 border border-panel-border rounded-xl text-sm resize-none focus:border-accent outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setTenantReviewModal(null)}
                  className="px-4 py-2 text-xs font-bold text-panel-text-dim border border-panel-border rounded-lg bg-panel-card-bg hover:bg-panel-hover-bg cursor-pointer">
                  Cancelar
                </button>
                <button
                  disabled={tenantReviewLoading || !tenantReviewComment.trim()}
                  onClick={async () => {
                    if (!tenantReviewComment.trim()) return
                    setTenantReviewLoading(true)
                    const res = await createTenantReview({
                      contractId: tenantReviewModal.contractId,
                      rating: tenantReviewRating,
                      comment: tenantReviewComment,
                    })
                    setTenantReviewLoading(false)
                    if (res.success) {
                      setTenantReviewDone(prev => [...prev, tenantReviewModal.contractId])
                      setTenantReviewModal(null)
                      setTenantReviewComment("")
                      setTenantReviewRating(5)
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg cursor-pointer border-none disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
                >
                  {tenantReviewLoading ? "Enviando..." : "Publicar calificación"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-panel-card-bg rounded-2xl border border-panel-border shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-panel-border bg-panel-hover-bg/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-panel-text">Crear Borrador de Contrato</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-panel-text-dim hover:text-panel-text transition-colors bg-transparent border-0 cursor-pointer p-1"
                >
                  <Cancel01Icon size={20} />
                </button>
              </div>

              {/* Visual Stepper */}
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: "Propiedad" },
                  { num: 2, label: "Inquilino" },
                  { num: 3, label: "Detalles" },
                  { num: 4, label: "Abono" },
                ].map((s) => (
                  <div key={s.num} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2">
                      <div className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                        step > s.num
                          ? "bg-emerald-500 text-white"
                          : step === s.num
                          ? "bg-accent text-white"
                          : "bg-panel-hover-bg text-panel-text-dim"
                      }`}>
                        {step > s.num ? (
                          <CheckmarkCircle01Icon size={14} />
                        ) : (
                          s.num
                        )}
                      </div>
                      <span className={`text-[11px] font-semibold whitespace-nowrap ${
                        step >= s.num ? "text-panel-text" : "text-panel-text-dim"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {s.num < 4 && (
                      <div className={`flex-1 h-px mx-3 ${
                        step > s.num ? "bg-emerald-300" : "bg-panel-hover-bg"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Body / Steps */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-4 flex items-start gap-2.5 mb-6 text-xs font-medium">
                  <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Property Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-panel-text mb-2">Selecciona la Propiedad</h4>
                  {properties.length > 0 ? (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {properties.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => handlePropertySelect(p.id, p.price)}
                          className="flex items-center justify-between p-4 bg-panel-hover-bg border border-panel-border hover:border-accent rounded-xl cursor-pointer transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-sm text-panel-text group-hover:text-accent transition-colors">{p.title}</div>
                            <div className="text-xs text-panel-text-muted mt-1">{p.address}, {p.district}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm text-panel-text">S/ {p.price.toLocaleString()}</div>
                            <div className="text-[10px] text-panel-text-muted mt-0.5">mensual</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-panel-hover-bg rounded-xl border border-dashed border-panel-border">
                      <Home01Icon size={32} className="text-panel-text-dim mx-auto mb-2" />
                      <p className="text-xs font-semibold text-panel-text mb-1">Sin propiedades disponibles</p>
                      <p className="text-[10px] text-panel-text-muted">Debes registrar y tener libre al menos una propiedad.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Tenant Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-panel-text mb-2">Selecciona al Inquilino</h4>
                  {tenants.length > 0 ? (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {tenants.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => handleTenantSelect(t.id)}
                          className="flex items-center gap-3 p-4 bg-panel-hover-bg border border-panel-border hover:border-accent rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="size-10 rounded-full bg-panel-hover-bg flex items-center justify-center shrink-0">
                            <UserCircleIcon size={20} className="text-panel-text-dim" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-panel-text group-hover:text-accent transition-colors">
                              {t.firstName} {t.lastName}
                            </div>
                            <div className="text-xs text-panel-text-muted truncate mt-0.5">{t.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-panel-hover-bg rounded-xl border border-dashed border-panel-border">
                      <UserCircleIcon size={32} className="text-panel-text-dim mx-auto mb-2" />
                      <p className="text-xs font-semibold text-panel-text mb-1">Sin inquilinos en el sistema</p>
                      <p className="text-[10px] text-panel-text-muted">No hay inquilinos registrados en este momento.</p>
                    </div>
                  )}
                  <button 
                    onClick={() => setStep(1)}
                    className="mt-4 text-xs font-bold text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer"
                  >
                    &larr; Volver a seleccionar propiedad
                  </button>
                </div>
              )}

              {/* Step 3: Financials and dates */}
              {step === 3 && (
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <h4 className="text-sm font-bold text-panel-text mb-2">Detalles del Alquiler</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Moneda</label>
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                      >
                        <option value="PEN">Soles (PEN)</option>
                        <option value="USD">Dólares (USD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Monto de Renta</label>
                      <input 
                        type="number"
                        required
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                        placeholder="1800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Depósito Garantía</label>
                      <input 
                        type="number"
                        required
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                        placeholder="1800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Día de Pago (Mensual)</label>
                      <input 
                        type="number"
                        required
                        min="1"
                        max="31"
                        value={paymentDay}
                        onChange={(e) => setPaymentDay(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Fecha de Inicio</label>
                      <input 
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Fecha de Término</label>
                      <input 
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-panel-border">
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer"
                    >
                      &larr; Volver
                    </button>
                    <button
                      type="submit"
                      className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Continuar a Cuenta de Pago &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Bank account details */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Summary Preview */}
                  <div className="bg-panel-hover-bg border border-panel-border rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-bold text-panel-text-muted uppercase tracking-wider mb-2">Resumen del Contrato</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <span className="text-panel-text-muted">Propiedad:</span>
                      <span className="font-semibold text-panel-text text-right">
                        {properties.find(p => p.id === selectedPropertyId)?.title ?? "—"}
                      </span>
                      <span className="text-panel-text-muted">Inquilino:</span>
                      <span className="font-semibold text-panel-text text-right">
                        {(() => {
                          const t = tenants.find(t => t.id === selectedTenantId)
                          return t ? `${t.firstName} ${t.lastName}` : '—'
                        })()}
                      </span>
                      <span className="text-panel-text-muted">Renta Mensual:</span>
                      <span className="font-semibold text-panel-text text-right">{currency === "PEN" ? "S/" : "$"} {Number(monthlyRent).toLocaleString()}</span>
                      <span className="text-panel-text-muted">Depósito:</span>
                      <span className="font-semibold text-panel-text text-right">{currency === "PEN" ? "S/" : "$"} {Number(deposit).toLocaleString()}</span>
                      <span className="text-panel-text-muted">Vigencia:</span>
                      <span className="font-semibold text-panel-text text-right">
                        {startDate ? new Date(startDate).toLocaleDateString("es-PE", { day: "numeric", month: "short" }) : "—"} 
                        {" → "}
                        {endDate ? new Date(endDate).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                      <span className="text-panel-text-muted">Día de Pago:</span>
                      <span className="font-semibold text-panel-text text-right">{paymentDay} de cada mes</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-panel-text mb-2">Configura tu Cuenta de Abono</h4>
                  <p className="text-xs text-panel-text-muted leading-relaxed">
                    Los pagos mensuales serán depositados a esta cuenta bancaria. Esta información será interpolada en las cláusulas de pago del contrato (Clickwrap).
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Banco / Proveedor</label>
                      <select 
                        value={bankProvider}
                        onChange={(e) => setBankProvider(e.target.value as any)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                      >
                        <option value="BCP">Banco de Crédito del Perú (BCP)</option>
                        <option value="BBVA">BBVA Perú</option>
                        <option value="Interbank">Interbank</option>
                        <option value="Niubiz">Niubiz</option>
                        <option value="Culqi">Culqi</option>
                        <option value="Izipay">Izipay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Número de Cuenta</label>
                      <input 
                        type="text"
                        required
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                        placeholder="191-XXXXXXXX-X-XX"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-panel-text-muted mb-1.5 uppercase">Titular de la Cuenta</label>
                      <input 
                        type="text"
                        required
                        value={bankAccountHolder}
                        onChange={(e) => setBankAccountHolder(e.target.value)}
                        className="w-full h-11 px-3 border border-panel-border rounded-xl text-sm font-semibold focus:border-accent"
                        placeholder="Juan Díaz"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-panel-border">
                    <button 
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-panel-text-muted hover:text-panel-text bg-transparent border-0 cursor-pointer"
                    >
                      &larr; Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-12 px-6 bg-accent hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                    >
                      {loading ? (
                        <>
                          <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generando contrato...</span>
                        </>
                      ) : (
                        <>
                          <FileValidationIcon size={16} />
                          <span>Crear Borrador Contrato</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
