"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Role, DistrictSource } from "@prisma/client"
import { revalidatePath } from "next/cache"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    return null
  }
  return session
}

// ── Lecturas públicas (usadas por los comboboxes de ciudad/distrito) ──

export async function getActiveCitiesAction(): Promise<string[]> {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: { name: true },
    orderBy: { name: "asc" },
  })
  return cities.map((c) => c.name)
}

export async function getActiveDistrictsAction(cityName: string): Promise<string[]> {
  if (!cityName.trim()) return []
  const city = await prisma.city.findFirst({
    where: { name: { equals: cityName.trim(), mode: "insensitive" } },
    select: { id: true },
  })
  if (!city) return []

  const districts = await prisma.district.findMany({
    where: { cityId: city.id, isActive: true },
    select: { name: true },
    orderBy: { name: "asc" },
  })
  return districts.map((d) => d.name)
}

// ── Administración de ciudades ──

export interface CityAdminRow {
  id: string
  name: string
  isActive: boolean
  districtCount: number
}

export async function getAllCitiesAction(): Promise<ActionResult<CityAdminRow[]>> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { districts: true } } },
  })

  return {
    success: true,
    data: cities.map((c) => ({ id: c.id, name: c.name, isActive: c.isActive, districtCount: c._count.districts })),
  }
}

export async function createCityAction(name: string): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const trimmed = name.trim()
  if (!trimmed) return { success: false, error: "El nombre de la ciudad es requerido." }

  const existing = await prisma.city.findFirst({ where: { name: { equals: trimmed, mode: "insensitive" } } })
  if (existing) return { success: false, error: "Ya existe una ciudad con ese nombre." }

  await prisma.city.create({ data: { name: trimmed } })
  revalidatePath("/admin/locations")
  return { success: true }
}

export async function updateCityAction(input: { id: string; name: string; isActive: boolean }): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const trimmed = input.name.trim()
  if (!trimmed) return { success: false, error: "El nombre de la ciudad es requerido." }

  await prisma.city.update({
    where: { id: input.id },
    data: { name: trimmed, isActive: input.isActive },
  })
  revalidatePath("/admin/locations")
  return { success: true }
}

export async function deleteCityAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  await prisma.city.delete({ where: { id } })
  revalidatePath("/admin/locations")
  return { success: true }
}

// ── Administración de distritos ──

export interface DistrictAdminRow {
  id: string
  name: string
  isActive: boolean
  source: DistrictSource
  cityId: string
  cityName: string
}

export async function getAllDistrictsAction(cityId?: string): Promise<ActionResult<DistrictAdminRow[]>> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const districts = await prisma.district.findMany({
    where: cityId ? { cityId } : undefined,
    include: { city: { select: { name: true } } },
    orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
  })

  return {
    success: true,
    data: districts.map((d) => ({
      id: d.id, name: d.name, isActive: d.isActive, source: d.source,
      cityId: d.cityId, cityName: d.city.name,
    })),
  }
}

export async function createDistrictAction(input: { name: string; cityId: string }): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const trimmed = input.name.trim()
  if (!trimmed) return { success: false, error: "El nombre del distrito es requerido." }

  const existing = await prisma.district.findFirst({
    where: { cityId: input.cityId, name: { equals: trimmed, mode: "insensitive" } },
  })
  if (existing) return { success: false, error: "Ya existe un distrito con ese nombre en esta ciudad." }

  await prisma.district.create({ data: { name: trimmed, cityId: input.cityId, source: DistrictSource.ADMIN } })
  revalidatePath("/admin/locations")
  return { success: true }
}

export async function updateDistrictAction(input: { id: string; name: string; isActive: boolean; cityId: string }): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  const trimmed = input.name.trim()
  if (!trimmed) return { success: false, error: "El nombre del distrito es requerido." }

  await prisma.district.update({
    where: { id: input.id },
    data: { name: trimmed, isActive: input.isActive, cityId: input.cityId },
  })
  revalidatePath("/admin/locations")
  return { success: true }
}

export async function deleteDistrictAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { success: false, error: "No autorizado. Debe ser administrador." }

  await prisma.district.delete({ where: { id } })
  revalidatePath("/admin/locations")
  return { success: true }
}
