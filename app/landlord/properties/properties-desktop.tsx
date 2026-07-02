'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home01Icon, Add01Icon, BedIcon, Bathtub02Icon, SquareIcon,
  Location01Icon, StarIcon, EyeIcon, FlashIcon,
  CheckmarkCircle01Icon, ArrowUp01Icon, Edit01Icon, GridViewIcon, ListViewIcon, Delete02Icon,
  PauseIcon, PlayIcon
} from "hugeicons-react"
import { usePagination } from "@/hooks/use-pagination"
import { Pagination } from "@/components/ui/pagination"
import { PaymentModal } from "@/components/ui/payment-modal"
import { PlanUpgradeModal } from "@/components/ui/plan-upgrade-modal"
import { processFeaturedListing } from "@/app/actions/culqi-actions"
import { deletePropertyAction, setPropertyModerationStatus } from "@/app/actions/property-actions"
import type { PropertyInfo } from "./properties-view"

const PLAN_LIMITS: Record<string, number> = { FREE: 3, PRO: 10, BUSINESS: Infinity }

interface Props {
  properties: PropertyInfo[]
  isMockPayment: boolean
  subscriptionPlan: string
  propertyCount: number
  openUpgrade?: boolean
}

export function PropertiesDesktop({ properties, isMockPayment, subscriptionPlan, propertyCount, openUpgrade }: Props) {
  const [filter, setFilter] = useState<string>("TODAS")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [featuredModal, setFeaturedModal] = useState<{
    propertyId: string
    propertyTitle: string
    days: 7 | 15 | 30
  } | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(!!openUpgrade)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    setPendingId(propertyId)
    try {
      const result = await deletePropertyAction(propertyId)
      if (!result.success) alert(result.error)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  const handleToggleVisibility = async (propertyId: string, currentStatus: string) => {
    setPendingId(propertyId)
    try {
      const nextStatus = currentStatus === "MANTENIMIENTO" ? "DISPONIBLE" : "MANTENIMIENTO"
      const result = await setPropertyModerationStatus(propertyId, nextStatus)
      if (!result.success) alert(result.error)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  // Calculate quick metrics
  const total = properties.length
  const disponibles = properties.filter(p => p.status === "DISPONIBLE").length
  const ocupadas = properties.filter(p => p.status === "OCUPADA").length
  const mantenimiento = properties.filter(p => p.status === "MANTENIMIENTO").length

  const filteredProperties = properties.filter(p => {
    if (filter === "TODAS") return true
    if (filter === "DISPONIBLES") return p.status === "DISPONIBLE"
    if (filter === "OCUPADAS") return p.status === "OCUPADA"
    if (filter === "MANTENIMIENTO") return p.status === "MANTENIMIENTO"
    return true
  })

  const pagination = usePagination(filteredProperties, 9, [filter])

  const getStatusBadge = (status: string, deletedAt?: string | null) => {
    if (deletedAt) return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">Archivada</span>
    switch (status) {
      case "DISPONIBLE":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Disponible</span>
      case "OCUPADA":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">Ocupada</span>
      case "MANTENIMIENTO":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Mantenimiento</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-panel-hover-bg text-panel-text-dim border border-panel-border rounded-lg">{status}</span>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HABITACION": return "Habitación"
      case "DEPARTAMENTO": return "Departamento"
      case "CASA": return "Casa"
      case "OFICINA": return "Oficina"
      case "LOCAL": return "Local"
      default: return type
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Plan status + upgrade banner */}
      {(() => {
        const limit = PLAN_LIMITS[subscriptionPlan] ?? 3
        const used = propertyCount
        const isNearLimit = limit !== Infinity && used >= limit - 1
        const atLimit = limit !== Infinity && used >= limit
        if (subscriptionPlan === "BUSINESS") return null
        return (
          <div className={`flex items-center justify-between rounded-xl px-5 py-3 mb-6 border ${
            atLimit ? "bg-red-50 border-red-200" : isNearLimit ? "bg-amber-50 border-amber-200" : "bg-panel-hover-bg border-panel-border"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                subscriptionPlan === "PRO" ? "bg-accent/10 text-accent" : "bg-slate-200 text-slate-600"
              }`}>
                Plan {subscriptionPlan}
              </span>
              <span className={`text-xs font-semibold ${atLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-panel-text-dim"}`}>
                {limit === Infinity ? `${used} propiedades` : `${used} / ${limit} propiedades`}
              </span>
              {atLimit && <span className="text-xs font-bold text-red-600">— Límite alcanzado</span>}
              {isNearLimit && !atLimit && <span className="text-xs text-amber-600">— Quedan {limit - used} espacios</span>}
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/5 cursor-pointer bg-panel-card-bg transition-colors"
            >
              <ArrowUp01Icon size={13} />
              {subscriptionPlan === "FREE" ? "Actualizar a Pro" : "Ver planes"}
            </button>
          </div>
        )
      })()}

      {/* Analytics: top 3 por vistas */}
      {properties.length > 0 && (() => {
        const top = [...properties].sort((a, b) => b.views - a.views).slice(0, 3).filter(p => p.views > 0)
        if (top.length === 0) return null
        return (
          <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-4">Propiedades más vistas</p>
            <div className="flex gap-4">
              {top.map((p, i) => (
                <div key={p.id} className="flex-1 flex items-center gap-3 bg-panel-hover-bg rounded-xl px-4 py-3">
                  <span className="text-xl font-extrabold text-slate-200">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-panel-text truncate">{p.title}</p>
                    <p className="text-[10px] text-panel-text-muted">{p.district}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-accent">
                    <EyeIcon size={13} />
                    <span className="text-sm font-extrabold">{p.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Total Propiedades</p>
          <p className="text-3xl font-bold text-panel-text">{total}</p>
        </div>
        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Disponibles</p>
          <p className="text-3xl font-bold text-emerald-600">{disponibles}</p>
        </div>
        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Alquiladas</p>
          <p className="text-3xl font-bold text-indigo-600">{ocupadas}</p>
        </div>
        <div className="bg-panel-card-bg border border-panel-border rounded-xl p-5">
          <p className="text-xs font-bold text-panel-text-muted uppercase tracking-wider mb-1">Mantenimiento</p>
          <p className="text-3xl font-bold text-amber-600">{mantenimiento}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex gap-2 bg-panel-card-bg p-1.5 border border-panel-border rounded-xl max-w-max">
          {[
            { key: "TODAS", label: "Todas" },
            { key: "DISPONIBLES", label: "Disponibles" },
            { key: "OCUPADAS", label: "Ocupadas" },
            { key: "MANTENIMIENTO", label: "Mantenimiento" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
                filter === tab.key
                  ? "bg-[#151c26] text-white shadow-sm"
                  : "text-panel-text-muted hover:text-panel-text hover:bg-panel-hover-bg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-panel-card-bg border border-panel-border rounded-full p-1">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Ver como tarjetas"
              className={`size-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors ${
                viewMode === "grid" ? "bg-[#151c26] text-white" : "bg-transparent text-panel-text-dim hover:bg-panel-hover-bg"
              }`}
            >
              <GridViewIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="Ver como lista"
              className={`size-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors ${
                viewMode === "list" ? "bg-[#151c26] text-white" : "bg-transparent text-panel-text-dim hover:bg-panel-hover-bg"
              }`}
            >
              <ListViewIcon size={16} />
            </button>
          </div>

          <Link
            href="/landlord/properties/new"
            className="h-11 px-5 rounded-xl text-sm font-bold !text-white transition-all duration-200 shadow-sm hover:brightness-110 flex items-center gap-2 cursor-pointer no-underline"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
          >
            <Add01Icon size={18} />
            <span>Publicar Propiedad</span>
          </Link>
        </div>
      </div>

      {/* Properties Cards Grid / List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-panel-card-bg border border-panel-border rounded-2xl">
          <Home01Icon size={56} className="text-panel-text-dim mx-auto mb-4" />
          <h3 className="text-base font-bold text-panel-text mb-1">Sin propiedades</h3>
          <p className="text-xs font-medium text-panel-text-muted mb-6">
            Aún no has publicado ninguna propiedad en el filtro seleccionado.
          </p>
          <Link
            href="/landlord/properties/new"
            className="inline-flex h-11 items-center justify-center px-6 rounded-xl text-xs font-bold !text-white transition-colors no-underline"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
          >
            Publicar mi primer anuncio
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-3 gap-6">
          {pagination.paginatedItems.map(p => {
            const imgArray = Array.isArray(p.images) ? p.images as string[] : []
            const firstImage = imgArray.length > 0 ? imgArray[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=85"

            return (
              <div 
                key={p.id} 
                className="bg-panel-card-bg border border-panel-border rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-panel-hover-bg shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={firstImage}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                    {getStatusBadge(p.status, p.deletedAt)}
                    {p.featuredUntil && new Date(p.featuredUntil) > new Date() && (
                      <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <StarIcon size={9} />
                        Destacada
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 z-10 bg-slate-900/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    {getTypeLabel(p.type)}
                  </div>
                  {/* Vistas */}
                  {p.views > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <EyeIcon size={10} />
                      {p.views} vistas
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="property-location-simple flex items-center gap-1.5 mb-2">
                    <Location01Icon size={14} className="shrink-0" />
                    <span>{p.district}</span>
                    {p.address && (
                      <>
                        <span>•</span>
                        <span className="truncate">{p.address}</span>
                      </>
                    )}
                  </div>

                  <p className="property-title-simple mb-2 line-clamp-1">{p.title}</p>
                  <p className="text-xs text-panel-text-muted line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                  <div className="h-px bg-panel-hover-bg my-2" />

                  {/* Core Features */}
                  <div className="property-specs-simple flex items-center justify-between py-2">
                    <div className="flex items-center gap-1">
                      <BedIcon size={16} />
                      <span>{p.rooms} hab.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bathtub02Icon size={16} />
                      <span>{p.bathrooms} bañ.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SquareIcon size={16} />
                      <span>{p.area || "--"} m²</span>
                    </div>
                  </div>

                  <div className="h-px bg-panel-hover-bg my-2" />
                </div>

                <div className="mt-auto bg-panel-hover-bg border-t border-panel-border p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-panel-text-muted font-bold uppercase tracking-wider block">Precio mensual</span>
                      <p className="property-price-simple">
                        <strong>S/ {Number(p.price).toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!p.deletedAt && (
                        <Link
                          href={`/landlord/properties/${p.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-panel-border bg-panel-card-bg text-xs font-bold text-panel-text-dim hover:text-accent hover:border-accent/40 no-underline transition-all shadow-sm"
                          aria-label="Editar propiedad"
                        >
                          <Edit01Icon size={14} />
                          <span>Editar</span>
                        </Link>
                      )}
                      {!p.deletedAt && (
                        <Link
                          href={`/propiedades/${p.id}`}
                          className="flex items-center justify-center size-8 rounded-lg border border-panel-border bg-panel-card-bg text-panel-text-dim hover:text-blue-500 hover:border-blue-400/40 no-underline transition-all shadow-sm"
                          aria-label="Ver publicación"
                        >
                          <EyeIcon size={14} />
                        </Link>
                      )}
                      {!p.deletedAt && p.status !== "OCUPADA" && (
                        <button
                          onClick={() => handleToggleVisibility(p.id, p.status)}
                          disabled={pendingId === p.id}
                          className={`flex items-center justify-center size-8 rounded-lg border bg-panel-card-bg transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
                            p.status === "MANTENIMIENTO"
                              ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                              : "border-panel-border text-panel-text-dim hover:text-amber-600 hover:border-amber-300"
                          }`}
                          aria-label={p.status === "MANTENIMIENTO" ? "Publicar propiedad" : "Ocultar propiedad"}
                          title={p.status === "MANTENIMIENTO" ? "Publicar" : "Ocultar"}
                        >
                          {p.status === "MANTENIMIENTO" ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={pendingId === p.id}
                        className="flex items-center justify-center size-8 rounded-lg border border-red-200 bg-panel-card-bg text-red-500 hover:bg-red-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        aria-label="Eliminar propiedad"
                      >
                        <Delete02Icon size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Botón destacar */}
                  {!p.deletedAt && p.status === "DISPONIBLE" && (
                    <div className="border-t border-panel-border/60 pt-3">
                      {p.featuredUntil && new Date(p.featuredUntil) > new Date() ? (
                        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] font-bold text-amber-800">
                          <div className="flex items-center gap-1.5">
                            <StarIcon size={12} className="text-amber-500 fill-amber-500" />
                            <span>Destacada</span>
                          </div>
                          <span className="text-amber-600 font-semibold">hasta {new Date(p.featuredUntil).toLocaleDateString("es-PE")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-panel-text-dim flex items-center gap-1">
                            <FlashIcon size={12} className="text-amber-500" />
                            Destacar anuncio:
                          </span>
                          <div className="flex gap-1.5">
                            {([
                              { days: 7 as const, label: "7d", price: "S/15" },
                              { days: 15 as const, label: "15d", price: "S/25" },
                              { days: 30 as const, label: "30d", price: "S/45" },
                            ]).map(opt => (
                              <button
                                key={opt.days}
                                onClick={() => setFeaturedModal({ propertyId: p.id, propertyTitle: p.title, days: opt.days })}
                                className="px-2.5 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md cursor-pointer flex items-center gap-1 transition-colors"
                              >
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
          })}
        </div>
      ) : (
        <div className="bg-panel-card-bg border border-panel-border rounded-2xl overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead className="bg-panel-hover-bg border-b border-panel-border text-xs font-bold text-panel-text-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Anuncio</th>
                <th className="px-6 py-4 font-bold">Tipo</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border text-sm text-panel-text">
              {pagination.paginatedItems.map(p => {
                const imgArray = Array.isArray(p.images) ? p.images as string[] : []
                const firstImage = imgArray.length > 0 ? imgArray[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=85"
                return (
                  <tr key={p.id} className="hover:bg-panel-hover-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={firstImage} alt={p.title} className="size-12 rounded-lg object-cover shrink-0" />
                        <span className="font-semibold line-clamp-1 max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-panel-text-dim">{getTypeLabel(p.type)}</td>
                    <td className="px-6 py-4 text-panel-text-dim">{p.district}</td>
                    <td className="px-6 py-4 font-bold">S/ {Number(p.price).toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(p.status, p.deletedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!p.deletedAt && (
                          <Link
                            href={`/landlord/properties/${p.id}/edit`}
                            className="flex items-center justify-center size-8 rounded-lg border border-panel-border bg-panel-card-bg text-panel-text-dim hover:text-accent hover:border-accent/40 no-underline transition-all"
                            aria-label="Editar propiedad"
                          >
                            <Edit01Icon size={14} />
                          </Link>
                        )}
                        {!p.deletedAt && (
                          <Link
                            href={`/propiedades/${p.id}`}
                            className="flex items-center justify-center size-8 rounded-lg border border-panel-border bg-panel-card-bg text-panel-text-dim hover:text-blue-500 hover:border-blue-400/40 no-underline transition-all"
                            aria-label="Ver publicación"
                          >
                            <EyeIcon size={14} />
                          </Link>
                        )}
                        {!p.deletedAt && p.status !== "OCUPADA" && (
                          <button
                            onClick={() => handleToggleVisibility(p.id, p.status)}
                            disabled={pendingId === p.id}
                            className={`flex items-center justify-center size-8 rounded-lg border bg-panel-card-bg transition-all cursor-pointer disabled:opacity-50 ${
                              p.status === "MANTENIMIENTO"
                                ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                : "border-panel-border text-panel-text-dim hover:text-amber-600 hover:border-amber-300"
                            }`}
                            aria-label={p.status === "MANTENIMIENTO" ? "Publicar propiedad" : "Ocultar propiedad"}
                            title={p.status === "MANTENIMIENTO" ? "Publicar" : "Ocultar"}
                          >
                            {p.status === "MANTENIMIENTO" ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={pendingId === p.id}
                          className="flex items-center justify-center size-8 rounded-lg border border-red-200 bg-panel-card-bg text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                          aria-label="Eliminar propiedad"
                        >
                          <Delete02Icon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredProperties.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="propiedades"
        />
      )}

      {/* Modal de upgrade de plan */}
      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => window.location.reload()}
        currentPlan={subscriptionPlan}
        isMockMode={isMockPayment}
        propertyCount={propertyCount}
      />

      {/* Modal de Featured Listing */}
      {featuredModal && (
        <PaymentModal
          isOpen
          onClose={() => setFeaturedModal(null)}
          onSuccess={() => setFeaturedModal(null)}
          amount={featuredModal.days === 7 ? 15 : featuredModal.days === 15 ? 25 : 45}
          title={`Destacar propiedad ${featuredModal.days} días`}
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

