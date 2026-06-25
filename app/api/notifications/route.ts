import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET /api/notifications
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get("unread") === "true"
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") ?? "20") || 20), 50)

    const where = { userId: session.user.id, ...(unreadOnly ? { read: false } : {}) }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: session.user.id, read: false } }),
    ])

    return NextResponse.json({
      notifications: notifications.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() })),
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error("[GET /api/notifications]", err)
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 })
  }
}

// POST /api/notifications — crear notificación (interno/admin)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    if (session.user.role !== "ADMIN")
      return NextResponse.json({ error: "Solo administradores" }, { status: 403 })

    const { userId, type, title, message, metadata } = await req.json()
    if (!userId || !type || !title || !message)
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 })

    const notification = await prisma.notification.create({
      data: { userId, type, title, message, metadata },
    })

    return NextResponse.json({ ...notification, createdAt: notification.createdAt.toISOString() }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/notifications]", err)
    return NextResponse.json({ error: "Error al crear notificación" }, { status: 500 })
  }
}
