import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"

// GET /api/contracts/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await params
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        property: { select: { id: true, title: true, address: true, district: true, type: true, area: true, rooms: true, bathrooms: true } },
        landlord: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, verified: true } },
        tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        payments: { orderBy: { dueDate: "asc" }, take: 12 },
        auditLogs: { orderBy: { timestamp: "desc" }, take: 20, include: { user: { select: { firstName: true, lastName: true, role: true } } } },
      },
    })

    if (!contract) return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })

    const userId = session.user.id
    const role = session.user.role as Role
    if (role !== Role.ADMIN && contract.landlordId !== userId && contract.tenantId !== userId)
      return NextResponse.json({ error: "Sin acceso a este contrato" }, { status: 403 })

    return NextResponse.json({
      ...contract,
      monthlyRent: Number(contract.monthlyRent),
      deposit: Number(contract.deposit),
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
      landlordSignedAt: contract.landlordSignedAt?.toISOString() ?? null,
      tenantSignedAt: contract.tenantSignedAt?.toISOString() ?? null,
      payments: contract.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
        dueDate: p.dueDate.toISOString(),
        paidDate: p.paidDate?.toISOString() ?? null,
      })),
      auditLogs: contract.auditLogs.map((a) => ({
        ...a,
        timestamp: a.timestamp.toISOString(),
      })),
    })
  } catch (err) {
    console.error("[GET /api/contracts/[id]]", err)
    return NextResponse.json({ error: "Error al obtener contrato" }, { status: 500 })
  }
}

// PATCH /api/contracts/[id] — actualizar estado (solo ADMIN)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    if (session.user.role !== Role.ADMIN)
      return NextResponse.json({ error: "Solo administradores" }, { status: 403 })

    const { id } = await params
    const { status, terms } = await req.json()

    const updated = await prisma.contract.update({
      where: { id },
      data: { ...(status && { status }), ...(terms && { terms }) },
    })

    return NextResponse.json({ ...updated, monthlyRent: Number(updated.monthlyRent), deposit: Number(updated.deposit) })
  } catch (err) {
    console.error("[PATCH /api/contracts/[id]]", err)
    return NextResponse.json({ error: "Error al actualizar contrato" }, { status: 500 })
  }
}
