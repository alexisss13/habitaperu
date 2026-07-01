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
  AlertCircleIcon
} from "hugeicons-react"
import { createDraftContract } from "@/app/actions/contract-actions"

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

export function ContractsMobile({ landlord, contracts, properties, tenants }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("TODOS")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [selectedPropertyId, setSelectedPropertyId] = useState("")
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [monthlyRent, setMonthlyRent] = useState("")
  const [currency] = useState("PEN")
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
    setDeposit(price.toString())
    setStep(2)
  }

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    setStep(3)
  }

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!monthlyRent || !deposit || !startDate || !endDate || !paymentDay) {
      setError("Por favor completa todos los campos.")
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
        setIsModalOpen(false)
        router.refresh()
      } else {
        setError(res.error?.message || "Ocurrió un error al crear el contrato.")
      }
    } catch (err) {
      console.error(err)
      setError("Error interno al guardar el borrador.")
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(c => filter === "TODOS" || c.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">Borrador</span>
      case "PENDING_TENANT": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">Espera Inquilino</span>
      case "PENDING_LANDLORD": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-medium">Espera Propietario</span>
      case "ACTIVE": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">Activo</span>
      case "FINISHED": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded">Finalizado</span>
      case "BREACHED_CANCELLED": 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red/10 text-red border border-red/20 rounded">Rescindido</span>
      default: 
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  return (
    <div className="py-6 px-4 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-2">Mis Contratos</h1>
          <p className="text-sm text-admin-text-muted">
            Gestión y firma digital de contratos con validez legal.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="w-full h-11 rounded-xl text-xs font-bold text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <Add01Icon size={16} />
          <span>Crear Contrato</span>
        </button>
      </div>

      {/* Filter Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4 -mx-4 px-4">
        {["TODOS", "DRAFT", "PENDING_TENANT", "PENDING_LANDLORD", "ACTIVE"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all shrink-0 border border-slate-200 cursor-pointer ${
              filter === status 
                ? "bg-[#151c26] text-white border-[#151c26]" 
                : "bg-white text-text-muted hover:text-text"
            }`}
          >
            {status === "TODOS" ? "Todos" : status === "DRAFT" ? "Borradores" : status === "PENDING_TENANT" ? "P. Inquilino" : status === "PENDING_LANDLORD" ? "Por Firmar" : "Activos"}
          </button>
        ))}
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {filteredContracts.length > 0 ? (
          filteredContracts.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-text truncate">{c.property.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{c.property.district}</p>
                </div>
                {getStatusBadge(c.status)}
              </div>

              <div className="h-px bg-slate-100" />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-text-muted font-medium uppercase tracking-wider">Inquilino</span>
                  <span className="font-bold text-text truncate block mt-0.5">{c.tenant.firstName} {c.tenant.lastName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted font-medium uppercase tracking-wider">Renta Mensual</span>
                  <span className="font-bold text-text block mt-0.5">S/ {Number(c.monthlyRent).toLocaleString()}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="block text-[10px] text-text-muted font-medium uppercase tracking-wider">Vigencia</span>
                  <span className="font-medium text-text block mt-0.5">
                    {new Date(c.startDate).toLocaleDateString("es-PE")} al {new Date(c.endDate).toLocaleDateString("es-PE")}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <Link
                  href={`/contracts/${c.id}`}
                  className={`w-full h-10 inline-flex items-center justify-center text-xs font-bold rounded-lg border transition-all no-underline ${
                    c.status === "PENDING_LANDLORD"
                      ? "bg-accent border-accent text-white hover:brightness-110"
                      : "bg-white border-slate-200 text-text-muted hover:border-slate-300"
                  }`}
                >
                  {c.status === "PENDING_LANDLORD" ? "Contrafirmar" : "Ver Contrato"}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl px-4">
            <FileValidationIcon size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-text mb-0.5">Sin contratos</h3>
            <p className="text-[10px] text-text-muted">No se registran contratos en esta lista.</p>
          </div>
        )}
      </div>

      {/* Creation Modal for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-text">Crear Contrato</h3>
                <p className="text-[10px] text-text-muted">Paso {step} de 4</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 p-1 hover:text-text bg-transparent border-0 cursor-pointer"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="bg-red/10 border border-red/20 text-red rounded-xl p-3 flex items-start gap-2 mb-4 text-[10px] font-medium">
                  <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Property Selection */}
              {step === 1 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">Selecciona la Propiedad</h4>
                  {properties.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {properties.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => handlePropertySelect(p.id, p.price)}
                          className="p-3 bg-slate-50 border border-slate-200 active:border-accent rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="font-bold text-xs text-text">{p.title}</div>
                          <div className="text-[10px] text-text-muted mt-1">{p.district}</div>
                          <div className="text-right font-bold text-xs text-accent mt-1">S/ {p.price.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <Home01Icon size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-text mb-0.5">Sin propiedades</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Tenant Selection */}
              {step === 2 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">Selecciona Inquilino</h4>
                  {tenants.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {tenants.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => handleTenantSelect(t.id)}
                          className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer active:border-accent"
                        >
                          <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                            <UserCircleIcon size={16} className="text-slate-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-text truncate">{t.firstName} {t.lastName}</div>
                            <div className="text-[10px] text-text-muted truncate mt-0.5">{t.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                      <UserCircleIcon size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-text">Sin inquilinos</p>
                    </div>
                  )}
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[10px] font-bold text-text-muted mt-2 bg-transparent border-0 cursor-pointer"
                  >
                    &larr; Volver
                  </button>
                </div>
              )}

              {/* Step 3: Financials & Dates */}
              {step === 3 && (
                <form onSubmit={handleStep3Submit} className="space-y-3">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">Detalles</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Monto de Renta</label>
                    <input 
                      type="number"
                      required
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                      placeholder="1800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Garantía / Depósito</label>
                    <input 
                      type="number"
                      required
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                      placeholder="1800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Día de Pago</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      max="31"
                      value={paymentDay}
                      onChange={(e) => setPaymentDay(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Inicio</label>
                    <input 
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Término</label>
                    <input 
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[10px] font-bold text-text-muted bg-transparent border-0 cursor-pointer"
                    >
                      &larr; Volver
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold"
                    >
                      Siguiente &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Bank Account Details */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">Cuenta de Abono</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Banco</label>
                    <select 
                      value={bankProvider}
                      onChange={(e) => setBankProvider(e.target.value as any)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                    >
                      <option value="BCP">BCP</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Interbank">Interbank</option>
                      <option value="Niubiz">Niubiz</option>
                      <option value="Culqi">Culqi</option>
                      <option value="Izipay">Izipay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Número de Cuenta</label>
                    <input 
                      type="text"
                      required
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                      placeholder="191-XXXXXXXX-X-XX"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase">Titular</label>
                    <input 
                      type="text"
                      required
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-accent"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-[10px] font-bold text-text-muted bg-transparent border-0 cursor-pointer"
                    >
                      &larr; Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-10 px-4 bg-accent text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5"
                      style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                    >
                      {loading ? (
                        <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Crear Borrador</span>
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
