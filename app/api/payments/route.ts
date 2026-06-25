import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"

// GET /api/payments
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const userId = session.user.id
    const role = session.user.role as Role
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const contractId = searchParams.get("contractId")
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") ?? "20") || 20), 100)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (role === Role.LANDLORD) where.landlordId = userId
    else if (role === Role.TENANT) where.tenantId = userId
    if (status) where.status = status
    if (contractId) where.contractId = contractId

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: "desc" },
        include: {
          contract: {
            select: {
              id: true,
              property: { select: { title: true, district: true } },
              tenant: { select: { firstName: true, lastName: true, email: true } },
              landlord: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ])

    const mapped = payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      paidDate: p.paidDate?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    return NextResponse.json({ payments: mapped, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error("[GET /api/payments]", err)
    return NextResponse.json({ error: "Error al obtener pagos" }, { status: 500 })
  }
}

// POST /api/payments — crear registro de pago (ADMIN/LANDLORD)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const role = session.user.role as Role
    if (role === Role.TENANT)
      return NextResponse.json({ error: "Inquilinos no pueden crear registros de pago" }, { status: 403 })

    const body = await req.json()
    const { contractId, amount, dueDate, notes } = body

    if (!contractId || !amount || !dueDate)
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { landlordId: true, tenantId: true },
    })
    if (!contract) return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })

    const payment = await prisma.payment.create({
      data: {
        contractId,
        landlordId: contract.landlordId,
        tenantId: contract.tenantId,
        amount,
        dueDate: new Date(dueDate),
        notes,
        status: "PENDIENTE",
      },
    })

    return NextResponse.json({ ...payment, amount: Number(payment.amount), dueDate: payment.dueDate.toISOString() }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/payments]", err)
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 })
  }
}
