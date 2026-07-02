import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { hasLandlordRole } from "@/lib/permissions"

// GET /api/contracts — lista contratos del usuario autenticado
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const userId = session.user.id
    const role = session.user.role as Role
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") ?? "20") || 20), 100)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = hasLandlordRole(session.user)
      ? { landlordId: userId }
      : role === Role.TENANT
        ? { tenantId: userId }
        : {} // ADMIN ve todos

    if (status) where.status = status

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: { select: { id: true, title: true, district: true, address: true, type: true } },
          landlord: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          _count: { select: { payments: true, auditLogs: true } },
        },
      }),
      prisma.contract.count({ where }),
    ])

    const mapped = contracts.map((c) => ({
      ...c,
      monthlyRent: Number(c.monthlyRent),
      deposit: Number(c.deposit),
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      landlordSignedAt: c.landlordSignedAt?.toISOString() ?? null,
      tenantSignedAt: c.tenantSignedAt?.toISOString() ?? null,
    }))

    return NextResponse.json({ contracts: mapped, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error("[GET /api/contracts]", err)
    return NextResponse.json({ error: "Error al obtener contratos" }, { status: 500 })
  }
}

// POST /api/contracts — crear contrato DRAFT (solo LANDLORD/ADMIN)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const role = session.user.role as Role
    if (!hasLandlordRole(session.user) && role !== Role.ADMIN)
      return NextResponse.json({ error: "Solo arrendadores pueden crear contratos" }, { status: 403 })

    const body = await req.json()
    const { propertyId, tenantId, monthlyRent, currency = "PEN", deposit, startDate, endDate, paymentDay, terms } = body

    if (!propertyId || !tenantId || !monthlyRent || !deposit || !startDate || !endDate || !paymentDay)
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true, status: true },
    })
    if (!property) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 })
    if (property.status !== "DISPONIBLE")
      return NextResponse.json({ error: "La propiedad no está disponible" }, { status: 409 })

    const landlordId = session.user.id
    if (hasLandlordRole(session.user) && property.ownerId !== landlordId)
      return NextResponse.json({ error: "No eres dueño de esta propiedad" }, { status: 403 })

    const contract = await prisma.contract.create({
      data: {
        propertyId,
        landlordId,
        tenantId,
        monthlyRent,
        currency,
        deposit,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paymentDay,
        terms,
        status: "DRAFT",
      },
      include: {
        property: { select: { id: true, title: true, district: true } },
        tenant: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return NextResponse.json(
      { ...contract, monthlyRent: Number(contract.monthlyRent), deposit: Number(contract.deposit) },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/contracts]", err)
    return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 })
  }
}
