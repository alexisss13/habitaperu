"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

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
