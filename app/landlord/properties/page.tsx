import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { PropertiesView } from "./properties-view"

export const dynamic = 'force-dynamic'

export default async function LandlordPropertiesPage() {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  const landlordId = session.user.id

  const properties = await prisma.property.findMany({
    where: {
      ownerId: landlordId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const serializedProperties = JSON.parse(JSON.stringify(properties))

  return <PropertiesView properties={serializedProperties} />
}
