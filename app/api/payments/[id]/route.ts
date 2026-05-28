import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"

// PATCH /api/payments/[id] — actualizar estado (marcar como pagado, subir recibo)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { status, receipt, notes, paidDate } = body

    const payment = await prisma.payment.findUnique({
      where: { id },
      select: { landlordId: true, tenantId: true },
    })
    if (!payment) return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })

    const userId = session.user.id
    const role = session.user.role as Role

    // Tenant solo puede subir recibo; landlord/admin pueden cambiar estado
    if (role === Role.TENANT && payment.tenantId !== userId)
      return NextResponse.json({ error: "Sin acceso" }, { status: 403 })
    if (role === Role.LANDLORD && payment.landlordId !== userId)
      return NextResponse.json({ error: "Sin acceso" }, { status: 403 })

    const data: Record<string, unknown> = {}
    if (receipt) data.receipt = receipt
    if (notes) data.notes = notes
    if (status && role !== Role.TENANT) data.status = status
    if (paidDate && role !== Role.TENANT) data.paidDate = new Date(paidDate)

    // Si tenant sube recibo → pago pasa a EN_PROCESO para revisión del landlord
    if (receipt && role === Role.TENANT) data.status = "EN_PROCESO"

    const updated = await prisma.payment.update({ where: { id }, data })

    return NextResponse.json({ ...updated, amount: Number(updated.amount), dueDate: updated.dueDate.toISOString(), paidDate: updated.paidDate?.toISOString() ?? null })
  } catch (err) {
    console.error("[PATCH /api/payments/[id]]", err)
    return NextResponse.json({ error: "Error al actualizar pago" }, { status: 500 })
  }
}
