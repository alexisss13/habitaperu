import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FlashIcon, ArrowLeft01Icon } from "hugeicons-react"
import { NewPropertyForm } from "./new-property-form"

export const dynamic = "force-dynamic"

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 10,
  BUSINESS: Infinity,
}

export default async function NewPropertyPage() {
  const session = await auth()
  // Cualquier cuenta autenticada puede llegar aquí: así es como se gana
  // isLandlord al publicar la primera propiedad.
  if (!session) redirect("/login")

  const landlordId = session.user.id

  const [propertyCount, user] = await Promise.all([
    prisma.property.count({ where: { ownerId: landlordId } }),
    prisma.user.findUnique({ where: { id: landlordId }, select: { subscriptionPlan: true } }),
  ])

  const plan = user?.subscriptionPlan ?? "FREE"
  const limit = PLAN_LIMITS[plan] ?? 3

  if (propertyCount >= limit) {
    const nextPlan = plan === "FREE" ? "Pro" : "Business"
    const nextPrice = plan === "FREE" ? "49" : "129"
    const nextLimit = plan === "FREE" ? "10" : "ilimitadas"

    return (
      <div className="py-10 px-4 md:px-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/landlord/properties"
            className="text-xs font-bold text-text-muted hover:text-text no-underline flex items-center gap-1.5 transition-colors">
            <ArrowLeft01Icon size={14} /> Volver a mis propiedades
          </Link>
        </div>

        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h1 className="text-base font-bold text-text">Publicar Nueva Propiedad</h1>
          </div>
          <div className="p-8 text-center">
            <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <FlashIcon size={28} className="text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-[#151c26] mb-2">
              Límite del plan {plan} alcanzado
            </h2>
            <p className="text-sm text-slate-500 mb-1">
              Tienes <span className="font-bold text-[#151c26]">{propertyCount}</span> {propertyCount === 1 ? "propiedad publicada" : "propiedades publicadas"}.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              El plan <span className="font-bold">{plan}</span> permite hasta <span className="font-bold">{limit}</span> {limit === 1 ? "propiedad" : "propiedades"}.
              Actualiza a <span className="font-bold text-accent">{nextPlan}</span> para gestionar hasta <span className="font-bold">{nextLimit} propiedades</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/landlord/properties?upgrade=true"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)" }}
              >
                <FlashIcon size={16} />
                Actualizar a {nextPlan} — S/ {nextPrice}/mes
              </Link>
              <Link
                href="/landlord/properties"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 no-underline hover:bg-slate-50 transition-colors"
              >
                Ver mis propiedades
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <NewPropertyForm />
}
