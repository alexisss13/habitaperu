import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { HostOnboardingView } from "./host-onboarding-view"

export const dynamic = "force-dynamic"

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 10,
  BUSINESS: Infinity,
}

export default async function PublicarOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  // Sin sesión → primero se registra/inicia sesión, y vuelve aquí mismo después.
  // Cualquier cuenta puede publicar: el rol de arrendador se gana al terminar
  // el wizard, no se elige al registrarse.
  if (!session?.user) {
    const callbackUrl = encodeURIComponent(`/${locale}/publicar/onboarding`)
    redirect(`/${locale}/register?callbackUrl=${callbackUrl}`)
  }

  // Si ya alcanzó el límite de su plan, no tiene sentido hacerle completar
  // los 3 pasos del wizard para recién ahí toparse con el muro de upgrade
  // en /landlord/properties/new (y perder el borrador que llenó).
  const [propertyCount, user] = await Promise.all([
    prisma.property.count({ where: { ownerId: session.user.id } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { subscriptionPlan: true } }),
  ])
  const limit = PLAN_LIMITS[user?.subscriptionPlan ?? "FREE"] ?? 3
  if (propertyCount >= limit) {
    redirect("/landlord/properties/new")
  }

  return <HostOnboardingView />
}
