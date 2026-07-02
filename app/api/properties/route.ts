import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { propertySchema } from "@/lib/validations"
import { ensureDistrictExists } from "@/lib/locations"
import { z } from "zod"

// GET /api/properties - Listar propiedades con filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const type = searchParams.get("type")
    const district = searchParams.get("district")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRooms = searchParams.get("minRooms")
    const status = searchParams.get("status") || "DISPONIBLE"

    const where: any = {}

    if (type) where.type = type
    if (district) where.district = district
    if (status) where.status = status
    const parsedMin = minPrice ? parseFloat(minPrice) : NaN
    const parsedMax = maxPrice ? parseFloat(maxPrice) : NaN
    if (!isNaN(parsedMin) || !isNaN(parsedMax)) {
      where.price = {}
      if (!isNaN(parsedMin)) where.price.gte = parsedMin
      if (!isNaN(parsedMax)) where.price.lte = parsedMax
    }
    const parsedRooms = minRooms ? parseInt(minRooms) : NaN
    if (!isNaN(parsedRooms)) where.rooms = { gte: parsedRooms }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            verified: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calcular rating promedio
    const propertiesWithRating = properties.map((property) => {
      const avgRating =
        property.reviews.length > 0
          ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
            property.reviews.length
          : 0

      return {
        ...property,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: property.reviews.length,
      }
    })

    return NextResponse.json(propertiesWithRating)
  } catch (error) {
    console.error("Error al obtener propiedades:", error)
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    )
  }
}

// POST /api/properties - Crear propiedad (cualquier cuenta autenticada;
// así es como se gana la capacidad de arrendador la primera vez que publica)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const validated = propertySchema.parse(body)

    const property = await prisma.property.create({
      data: {
        ...validated,
        ownerId: session.user.id,
      },
    })

    // Si esta era la primera propiedad de la cuenta, gana la capacidad de
    // arrendador sin perder su rol original (ver User.isLandlord).
    if (!session.user.isLandlord) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isLandlord: true },
      })
    }

    // Si el distrito escrito no existía para esa ciudad, lo registra para que
    // aparezca en el combobox de los siguientes arrendadores.
    if (typeof body.city === "string" && body.city.trim()) {
      ensureDistrictExists(body.city, validated.district).catch((err) =>
        console.error("Error registrando distrito nuevo:", err)
      )
    }

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error al crear propiedad:", error)
    return NextResponse.json(
      { error: "Error al crear propiedad" },
      { status: 500 }
    )
  }
}
