import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// PATCH /api/notifications/[id]/read
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await params
    const notification = await prisma.notification.findUnique({ where: { id }, select: { userId: true } })
    if (!notification) return NextResponse.json({ error: "No encontrada" }, { status: 404 })
    if (notification.userId !== session.user.id)
      return NextResponse.json({ error: "Sin acceso" }, { status: 403 })

    await prisma.notification.update({ where: { id }, data: { read: true } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/notifications/[id]/read]", err)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
