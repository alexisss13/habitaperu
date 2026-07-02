import { prisma } from "@/lib/db"
import { DistrictSource } from "@prisma/client"

/**
 * Registra un distrito nuevo escrito a mano por un arrendador (opción "Otro"),
 * quedando disponible de inmediato en el combobox de esa ciudad para los
 * siguientes arrendadores. No crea ciudades: si `cityName` no coincide con una
 * ciudad ya registrada, no hace nada (evita ciudades fantasma por typos).
 */
export async function ensureDistrictExists(cityName: string, districtName: string) {
  const city = cityName.trim()
  const district = districtName.trim()
  if (!city || !district) return

  const cityRow = await prisma.city.findFirst({
    where: { name: { equals: city, mode: "insensitive" } },
    select: { id: true },
  })
  if (!cityRow) return

  const existing = await prisma.district.findFirst({
    where: { cityId: cityRow.id, name: { equals: district, mode: "insensitive" } },
    select: { id: true },
  })
  if (existing) return

  await prisma.district.create({
    data: { name: district, cityId: cityRow.id, source: DistrictSource.HOST, isActive: true },
  })
}
