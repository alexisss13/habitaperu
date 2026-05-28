import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// PATCH /api/notifications/read-all — marcar todas como leídas
export async function PATCH() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/notifications/read-all]", err)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
