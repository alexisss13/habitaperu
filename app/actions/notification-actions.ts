"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

export async function getNotifications(): Promise<ActionResult<any[]>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado" }
    }

    const userId = session.user.id

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const mapped = notifications.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }))

    return { success: true, data: mapped }
  } catch (error: any) {
    console.error("Error getting notifications:", error)
    return { success: false, error: error.message }
  }
}

export async function markNotificationAsRead(id: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado" }
    }

    const userId = session.user.id

    // Validar propiedad de la notificacion
    const notif = await prisma.notification.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!notif || notif.userId !== userId) {
      return { success: false, error: "No autorizado para modificar esta notificación" }
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true }
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message }
  }
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado" }
    }

    const userId = session.user.id

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteNotification(id: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado" }
    }

    const userId = session.user.id

    // Validar propiedad
    const notif = await prisma.notification.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!notif || notif.userId !== userId) {
      return { success: false, error: "No autorizado" }
    }

    await prisma.notification.delete({
      where: { id }
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return { success: false, error: error.message }
  }
}
