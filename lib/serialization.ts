/**
 * lib/serialization.ts
 *
 * Helper para serializar de forma segura los resultados de Prisma que se pasan de
 * Server Components (RSC) a Client Components.
 *
 * Convierte instancias de Prisma.Decimal a numbers para evitar errores de serialización
 * de Next.js (ya que Decimal es un objeto de clase compleja que Next.js no puede transferir).
 * Deja los objetos Date intactos, ya que Next.js v15/v16 permite serializarlos de forma nativa.
 */

export function serializePrisma<T>(data: T): any {
  if (data === null || data === undefined) {
    return data
  }

  // Manejar arreglos
  if (Array.isArray(data)) {
    return data.map(serializePrisma)
  }

  // Manejar fechas (Next.js las serializa de forma nativa)
  if (data instanceof Date) {
    return data
  }

  // Manejar objetos
  if (typeof data === "object") {
    // Verificar si es un Decimal de Prisma
    if ("toNumber" in data && typeof (data as any).toNumber === "function") {
      return (data as any).toNumber()
    }

    // Recorrer propiedades recursivamente
    const serialized: any = {}
    for (const key of Object.keys(data)) {
      serialized[key] = serializePrisma((data as any)[key])
    }
    return serialized
  }

  return data
}
