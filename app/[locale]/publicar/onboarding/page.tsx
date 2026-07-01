import { HostOnboarding } from "./host-onboarding"

export default async function PublicarOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <HostOnboarding locale={locale} />
}
