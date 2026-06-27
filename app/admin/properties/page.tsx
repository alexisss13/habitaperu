import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Role, PropertyStatus } from "@prisma/client"
import { PropertiesView } from './properties-view'
export default async function PropertiesPage(props: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const searchParams = await props.searchParams
  const page = Math.max(1, parseInt(searchParams?.page ?? "1") || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit ?? "25") || 25))
  const skip = (page - 1) * limit

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { firstName: true, lastName: true, email: true } } }
    }),
    prisma.property.count(),
  ])

  const mapped = properties.map(p => ({
    ...p,
    price: Number(p.price),
    area: p.area ?? 0,
    images: (Array.isArray(p.images) ? p.images : []) as string[]
  }))

  const [disponible, ocupada, mantenimiento] = await Promise.all([
    prisma.property.count({ where: { status: PropertyStatus.DISPONIBLE } }),
    prisma.property.count({ where: { status: PropertyStatus.OCUPADA } }),
    prisma.property.count({ where: { status: PropertyStatus.MANTENIMIENTO } }),
  ])

  const avgPrice = total > 0 ? await prisma.property.aggregate({ _avg: { price: true } }).then(r => Math.round(Number(r._avg.price ?? 0))) : 0

  const stats = { total, disponible, ocupada, mantenimiento, avgPrice }

  return <PropertiesView data={{ properties: mapped, stats, page, limit, totalPages: Math.ceil(total / limit) }} />
}
