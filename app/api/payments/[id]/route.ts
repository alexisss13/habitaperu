import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { hasLandlordRole } from "@/lib/permissions"

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

    // La capacidad se decide por la relación con ESTE pago, no solo por el
    // rol principal de la cuenta (una cuenta dual puede ser tenant en un
    // contrato y landlord en otro).
    const isTenantOfPayment = payment.tenantId === userId
    const isLandlordOfPayment = hasLandlordRole(session.user) && payment.landlordId === userId
    const actsAsLandlord = isLandlordOfPayment || role === Role.ADMIN

    if (!isTenantOfPayment && !isLandlordOfPayment && role !== Role.ADMIN)
      return NextResponse.json({ error: "Sin acceso" }, { status: 403 })

    const data: Record<string, unknown> = {}
    if (receipt) data.receipt = receipt
    if (notes) data.notes = notes
    if (status && actsAsLandlord) data.status = status
    if (paidDate && actsAsLandlord) data.paidDate = new Date(paidDate)

    // Si el tenant sube recibo → pago pasa a EN_PROCESO para revisión del landlord
    if (receipt && !actsAsLandlord) data.status = "EN_PROCESO"

    const updated = await prisma.payment.update({ where: { id }, data })

    return NextResponse.json({ ...updated, amount: Number(updated.amount), dueDate: updated.dueDate.toISOString(), paidDate: updated.paidDate?.toISOString() ?? null })
  } catch (err) {
    console.error("[PATCH /api/payments/[id]]", err)
    return NextResponse.json({ error: "Error al actualizar pago" }, { status: 500 })
  }
}
