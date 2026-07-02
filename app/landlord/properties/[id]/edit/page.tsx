import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { EditPropertyForm } from "./edit-property-form"
import { hasLandlordRole } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session || !hasLandlordRole(session.user)) redirect("/login")

  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
  })

  if (!property) notFound()
  if (property.ownerId !== (session.user as any).id) redirect("/landlord/properties")

  // Serialize for client component
  const data = {
    id:           property.id,
    title:        property.title,
    description:  property.description,
    type:         property.type,
    condition:    property.condition,
    status:       property.status,
    district:     property.district,
    address:      property.address ?? "",
    area:         property.area?.toString() ?? "",
    rooms:        property.rooms.toString(),
    bathrooms:    property.bathrooms.toString(),
    parking:      property.parking.toString(),
    price:        Number(property.price).toString(),
    deposit:      property.deposit.toString(),
    minDuration:  property.minDuration.toString(),
    amenities:    (Array.isArray(property.amenities) ? property.amenities : []) as string[],
    images:       (Array.isArray(property.images) ? property.images : []) as string[],
    conditions:   property.conditions ?? "",
    lat:          property.lat ?? null,
    lng:          property.lng ?? null,
  }

  return <EditPropertyForm property={data} />
}
