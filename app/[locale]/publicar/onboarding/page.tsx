import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HostOnboardingView } from "./host-onboarding-view"

export const dynamic = "force-dynamic"

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

  return <HostOnboardingView />
}
