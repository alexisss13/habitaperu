'use client'

import { useState } from "react"
import Link from "next/link"
import {
  Home01Icon, Add01Icon, BedIcon, Bathtub02Icon,
  SquareIcon, Location01Icon, FlashIcon, CheckmarkCircle01Icon,
  EyeIcon, ArrowUp01Icon, Edit01Icon, StarIcon
} from "hugeicons-react"
import { PaymentModal } from "@/components/ui/payment-modal"
import { PlanUpgradeModal } from "@/components/ui/plan-upgrade-modal"
import { processFeaturedListing } from "@/app/actions/culqi-actions"
import type { PropertyInfo } from "./properties-view"

const PLAN_LIMITS: Record<string, number> = { FREE: 3, PRO: 10, BUSINESS: Infinity }

interface Props {
  properties: PropertyInfo[]
  isMockPayment: boolean
  subscriptionPlan: string
  propertyCount: number
  openUpgrade?: boolean
}

export function PropertiesMobile({ properties, isMockPayment, subscriptionPlan, propertyCount, openUpgrade }: Props) {
  const [filter, setFilter] = useState<string>("TODAS")
  const [featuredModal, setFeaturedModal] = useState<{
    propertyId: string
    propertyTitle: string
    days: 7 | 15 | 30
  } | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(!!openUpgrade)

  const filteredProperties = properties.filter(p => {
    if (filter === "TODAS") return true
    if (filter === "DISPONIBLES") return p.status === "DISPONIBLE"
    if (filter === "OCUPADAS") return p.status === "OCUPADA"
    if (filter === "MANTENIMIENTO") return p.status === "MANTENIMIENTO"
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Disponible</span>
      case "OCUPADA":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">Ocupada</span>
      case "MANTENIMIENTO":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">Mantenimiento</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">{status}</span>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HABITACION": return "Habitación"
      case "DEPARTAMENTO": return "Depa"
      case "CASA": return "Casa"
      case "OFICINA": return "Oficina"
      case "LOCAL": return "Local"
      default: return type
    }
  }

  return (
    <div className="py-6 px-4 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis Propiedades</h1>
          <p className="text-xs font-medium text-text-muted mt-1">
            Administra tus anuncios de alquiler
          </p>
        </div>
        <Link
          href="/landlord/properties/new"
          className="w-full h-11 rounded-xl text-xs font-bold text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer no-underline"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
        >
          <Add01Icon size={16} />
          <span>Publicar Propiedad</span>
        </Link>
      </div>

      {/* Plan banner */}
      {subscriptionPlan !== "BUSINESS" && (() => {
        const limit = PLAN_LIMITS[subscriptionPlan] ?? 3
        const atLimit = limit !== Infinity && propertyCount >= limit
        const isNear = limit !== Infinity && propertyCount >= limit - 1 && !atLimit
        return (
          <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 mb-4 border ${atLimit ? "bg-red-50 border-red-200" : isNear ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
            <div>
              <span className="text-[10px] font-bold text-slate-500">Plan {subscriptionPlan}</span>
              <span className={`text-[10px] font-semibold ml-2 ${atLimit ? "text-red-600" : "text-slate-400"}`}>
                {limit === Infinity ? `${propertyCount} props.` : `${propertyCount}/${limit}`}
              </span>
            </div>
            <button onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1 text-[10px] font-bold text-accent border border-accent/30 px-2.5 py-1 rounded-lg cursor-pointer bg-white">
              <ArrowUp01Icon size={11} /> Mejorar plan
            </button>
          </div>
        )
      })()}

      {/* Top vistas compacto */}
      {properties.length > 0 && (() => {
        const top = [...properties].sort((a, b) => b.views - a.views).slice(0, 2).filter(p => p.views > 0)
        if (top.length === 0) return null
        return (
          <div className="flex gap-2 mb-4">
            {top.map(p => (
              <div key={p.id} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <EyeIcon size={13} className="text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-text truncate">{p.title}</p>
                  <p className="text-[10px] text-text-muted">{p.views} vistas</p>
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      {/* Filter horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4 -mx-4 px-4">
        {[
          { key: "TODAS", label: "Todas" },
          { key: "DISPONIBLES", label: "Disponibles" },
          { key: "OCUPADAS", label: "Ocupadas" },
          { key: "MANTENIMIENTO", label: "Mantenimiento" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all shrink-0 border border-slate-200 cursor-pointer ${
              filter === tab.key 
                ? "bg-[#151c26] text-white border-[#151c26]" 
                : "bg-white text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Property Cards */}
      <div className="space-y-4">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(p => {
            const imgArray = Array.isArray(p.images) ? p.images as string[] : []
            const firstImage = imgArray.length > 0 ? imgArray[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=85"

            return (
              <div 
                key={p.id} 
                className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative h-40 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={firstImage} 
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-bold">
                    {getTypeLabel(p.type)}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-text-muted font-semibold">
                    <Location01Icon size={12} className="text-slate-400" />
                    <span className="truncate">{p.district} • {p.address || "Ver dirección"}</span>
                  </div>

                  <h3 className="font-bold text-sm text-text truncate">{p.title}</h3>

                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold py-1 bg-slate-50 px-2 rounded-lg my-1">
                    <span className="flex items-center gap-0.5"><BedIcon size={14} /> {p.rooms} hab.</span>
                    <span className="flex items-center gap-0.5"><Bathtub02Icon size={14} /> {p.bathrooms} bañ.</span>
                    <span className="flex items-center gap-0.5"><SquareIcon size={14} /> {p.area || "--"} m²</span>
                  </div>
                </div>

                <div className="mt-auto bg-slate-50 border-t border-slate-100 p-3.5 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-text-muted font-semibold block uppercase">Mensual</span>
                      <span className="text-sm font-extrabold text-[#151c26]">S/ {Number(p.price).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/landlord/properties/${p.id}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700 hover:text-accent hover:border-accent/40 no-underline transition-all shadow-sm" aria-label="Editar">
                        <Edit01Icon size={12} />
                        <span>Editar</span>
                      </Link>
                      <Link href={`/propiedades/${p.id}`} className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-500 hover:border-blue-400/40 no-underline transition-all shadow-sm" aria-label="Ver publicación">
                        <EyeIcon size={12} />
                      </Link>
                    </div>
                  </div>

                  {p.status === "DISPONIBLE" && (
                    <div className="border-t border-slate-200/60 pt-2.5">
                      {p.featuredUntil && new Date(p.featuredUntil) > new Date() ? (
                        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-[9px] font-bold text-amber-800">
                          <div className="flex items-center gap-1">
                            <StarIcon size={10} className="text-amber-500 fill-amber-500" />
                            <span>Destacada</span>
                          </div>
                          <span className="text-amber-600 font-semibold">hasta {new Date(p.featuredUntil).toLocaleDateString("es-PE")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                            <FlashIcon size={11} className="text-amber-500" />
                            Destacar anuncio:
                          </span>
                          <div className="flex gap-1">
                            {([
                              { days: 7 as const, label: "7d", price: "S/15" },
                              { days: 15 as const, label: "15d", price: "S/25" },
                              { days: 30 as const, label: "30d", price: "S/45" },
                            ]).map(opt => (
                              <button key={opt.days}
                                onClick={() => setFeaturedModal({ propertyId: p.id, propertyTitle: p.title, days: opt.days })}
                                className="px-2 py-1 text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md cursor-pointer flex items-center gap-1 transition-colors">
                                <span>{opt.label}</span>
                                <span className="text-amber-500/80 font-normal">{opt.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl px-4">
            <Home01Icon size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-text mb-0.5">Sin propiedades</p>
            <p className="text-[10px] text-text-muted">No se registran propiedades publicadas.</p>
          </div>
        )}
      </div>

      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => window.location.reload()}
        currentPlan={subscriptionPlan}
        isMockMode={isMockPayment}
        propertyCount={propertyCount}
      />

      {featuredModal && (
        <PaymentModal
          isOpen
          onClose={() => setFeaturedModal(null)}
          onSuccess={() => setFeaturedModal(null)}
          amount={featuredModal.days === 7 ? 15 : featuredModal.days === 15 ? 25 : 45}
          title={`Destacar ${featuredModal.days} días`}
          description={featuredModal.propertyTitle}
          ctaLabel={`Pagar S/ ${featuredModal.days === 7 ? "15" : featuredModal.days === 15 ? "25" : "45"}.00`}
          isMockMode={isMockPayment}
          onProcessPayment={(token) =>
            processFeaturedListing(featuredModal.propertyId, featuredModal.days, token)
          }
        />
      )}
    </div>
  )
}
