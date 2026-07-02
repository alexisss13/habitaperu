import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { deletePropertyAction } from "@/app/actions/property-actions"
import { propertySchema } from "@/lib/validations"

// GET /api/properties/:id - Obtener detalle de propiedad
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            verified: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!property || property.deletedAt) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      )
    }

    // Incrementar contador de vistas
    await prisma.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    // Calcular rating promedio
    const avgRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
          property.reviews.length
        : 0

    return NextResponse.json({
      ...property,
      avgRating: Math.round(avgRating * 10) / 10,
    })
  } catch (error) {
    console.error("Error al obtener propiedad:", error)
    return NextResponse.json(
      { error: "Error al obtener propiedad" },
      { status: 500 }
    )
  }
}

// PUT /api/properties/:id - Actualizar propiedad (solo owner)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    })

    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      )
    }

    if (property.ownerId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta propiedad" },
        { status: 403 }
      )
    }

    if (property.deletedAt) {
      return NextResponse.json(
        { error: "Esta propiedad está archivada y no se puede editar." },
        { status: 409 }
      )
    }

    const body = await req.json()
    const validated = propertySchema.parse(body)

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error al actualizar propiedad:", error)
    return NextResponse.json(
      { error: "Error al actualizar propiedad" },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/:id - Eliminar propiedad (solo owner)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const result = await deletePropertyAction(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: "Propiedad eliminada" })
  } catch (error) {
    console.error("Error al eliminar propiedad:", error)
    return NextResponse.json(
      { error: "Error al eliminar propiedad" },
      { status: 500 }
    )
  }
}
