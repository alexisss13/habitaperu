import { prisma } from "@/lib/db"
import { PropertiesView } from './properties-view'

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { owner: { select: { firstName: true, lastName: true, email: true } } }
  })

  const mapped = properties.map(p => ({
    ...p,
    price: Number(p.price),
    area: p.area ?? 0,
    images: (Array.isArray(p.images) ? p.images : []) as string[]
  }))

  const stats = {
    total: mapped.length,
    disponible: mapped.filter(p => p.status === 'DISPONIBLE').length,
    ocupada: mapped.filter(p => p.status === 'OCUPADA').length,
    mantenimiento: mapped.filter(p => p.status === 'MANTENIMIENTO').length,
    avgPrice: mapped.length > 0
      ? Math.round(mapped.reduce((s, p) => s + p.price, 0) / mapped.length)
      : 0
  }

  return <PropertiesView data={{ properties: mapped, stats }} />
}
