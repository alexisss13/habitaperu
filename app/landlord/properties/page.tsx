import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { PropertiesView } from "./properties-view"
import { CULQI_IS_MOCK } from "@/lib/culqi"

export const dynamic = 'force-dynamic'

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>
}) {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  const landlordId = session.user.id
  const { upgrade } = await searchParams

  const [properties, user] = await Promise.all([
    prisma.property.findMany({ where: { ownerId: landlordId }, orderBy: { createdAt: 'desc' } }),
    prisma.user.findUnique({ where: { id: landlordId }, select: { subscriptionPlan: true, subscriptionEndsAt: true } }),
  ])

  const serializedProperties = JSON.parse(JSON.stringify(properties))
  const subscriptionPlan = user?.subscriptionPlan ?? "FREE"

  return (
    <PropertiesView
      properties={serializedProperties}
      isMockPayment={CULQI_IS_MOCK}
      subscriptionPlan={subscriptionPlan}
      propertyCount={properties.length}
      openUpgrade={upgrade === "true"}
    />
  )
}
