"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role, PropertyStatus, ContractStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { hasLandlordRole } from "@/lib/permissions"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Incrementa el contador de vistas de una propiedad.
 * No cuenta vistas del propio dueño ni visitas repetidas en la misma sesión
 * (la protección anti-spam de sesión se hace en el cliente con sessionStorage).
 */
export async function incrementPropertyView(propertyId: string): Promise<void> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    // No contar vistas del propio arrendador
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    })

    if (!property || property.ownerId === userId) return

    await prisma.property.update({
      where: { id: propertyId },
      data: { views: { increment: 1 } },
    })
  } catch {
    // Silencioso — el contador de vistas no es crítico
  }
}

/**
 * Pausa o reactiva una publicación (ocultarla/publicarla), de forma
 * reversible: solo cambia el status a MANTENIMIENTO y de vuelta, sin tocar
 * deletedAt. Al poner el status en MANTENIMIENTO, la propiedad ya deja de
 * aparecer en la home ni en /propiedades (ambas filtran status:
 * 'DISPONIBLE'), sin afectar contratos activos existentes sobre ella.
 * La usa tanto el admin (como moderación) como el propio arrendador
 * (para ocultar temporalmente su anuncio sin eliminarlo).
 */
export async function setPropertyModerationStatus(
  propertyId: string,
  status: typeof PropertyStatus.MANTENIMIENTO | typeof PropertyStatus.DISPONIBLE
): Promise<ActionResult> {
  const session = await auth()
  if (!session) {
    return { success: false, error: "No autorizado." }
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { ownerId: true, deletedAt: true },
  })

  if (!property) {
    return { success: false, error: "La propiedad no existe." }
  }

  const isAdmin = session.user.role === Role.ADMIN
  const isOwner = hasLandlordRole(session.user) && property.ownerId === session.user.id
  if (!isAdmin && !isOwner) {
    return { success: false, error: "No autorizado." }
  }

  if (property.deletedAt) {
    return { success: false, error: "Esta propiedad está archivada y no se puede pausar/reactivar." }
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { status },
  })

  revalidatePath("/admin/properties")
  revalidatePath("/landlord/properties")
  revalidatePath("/")
  return { success: true }
}

/**
 * Elimina una publicación. Si la propiedad nunca tuvo contratos, se borra
 * de verdad (no hay nada en cascada que perder). Si tiene historial de
 * contratos, se archiva (soft delete + MANTENIMIENTO) para no romper datos
 * legales/financieros. Se bloquea si hay un contrato ACTIVE en curso.
 */
export async function deletePropertyAction(propertyId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session) {
    return { success: false, error: "No autorizado." }
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      ownerId: true,
      _count: { select: { contracts: true } },
      contracts: { where: { status: ContractStatus.ACTIVE }, select: { id: true }, take: 1 },
    },
  })

  if (!property) {
    return { success: false, error: "La propiedad no existe." }
  }

  const isAdmin = session.user.role === Role.ADMIN
  const isOwner = hasLandlordRole(session.user) && property.ownerId === session.user.id
  if (!isAdmin && !isOwner) {
    return { success: false, error: "No autorizado." }
  }

  if (property.contracts.length > 0) {
    return { success: false, error: "No se puede eliminar una propiedad con un contrato activo." }
  }

  if (property._count.contracts === 0) {
    await prisma.property.delete({ where: { id: propertyId } })
  } else {
    await prisma.property.update({
      where: { id: propertyId },
      data: { deletedAt: new Date(), status: PropertyStatus.MANTENIMIENTO },
    })
  }

  revalidatePath("/admin/properties")
  revalidatePath("/landlord/properties")
  revalidatePath("/")
  return { success: true }
}
