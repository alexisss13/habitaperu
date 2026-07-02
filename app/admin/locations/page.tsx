import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import { LocationsView } from "./locations-view"

export const dynamic = "force-dynamic"

export default async function AdminLocationsPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const [cities, districts] = await Promise.all([
    prisma.city.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { districts: true } } },
    }),
    prisma.district.findMany({
      include: { city: { select: { name: true } } },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    }),
  ])

  return (
    <LocationsView
      cities={cities.map((c) => ({ id: c.id, name: c.name, isActive: c.isActive, districtCount: c._count.districts }))}
      districts={districts.map((d) => ({
        id: d.id, name: d.name, isActive: d.isActive, source: d.source,
        cityId: d.cityId, cityName: d.city.name,
      }))}
    />
  )
}
