import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET /api/favorites?ids=id1,id2,id3 — obtener propiedades por IDs (desde localStorage del cliente)
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const idsParam = searchParams.get("ids")
    if (!idsParam) return NextResponse.json({ properties: [] })

    const ids = idsParam.split(",").filter(Boolean).slice(0, 50)

    const properties = await prisma.property.findMany({
      where: { id: { in: ids }, status: "DISPONIBLE", deletedAt: null },
      include: {
        owner: { select: { firstName: true, lastName: true, verified: true } },
        _count: { select: { reviews: true } },
      },
    })

    return NextResponse.json({
      properties: properties.map((p) => ({
        ...p,
        price: Number(p.price),
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
        images: Array.isArray(p.images) ? p.images as string[] : [],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        availableFrom: p.availableFrom?.toISOString() ?? null,
      })),
    })
  } catch (err) {
    console.error("[GET /api/favorites]", err)
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 })
  }
}
