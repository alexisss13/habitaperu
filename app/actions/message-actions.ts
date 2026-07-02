"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createNotificationHelper } from "@/lib/notifications"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Obtiene la conversación existente entre el usuario actual (como inquilino
 * interesado) y el dueño de la propiedad, o la crea si es la primera vez.
 * No permite que el dueño abra una conversación consigo mismo.
 */
export async function getOrStartConversation(propertyId: string): Promise<ActionResult<{ conversationId: string }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "No autorizado. Inicie sesión." }
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { ownerId: true },
  })
  if (!property) {
    return { success: false, error: "La propiedad no existe." }
  }
  if (property.ownerId === session.user.id) {
    return { success: false, error: "No puedes iniciar una conversación sobre tu propia propiedad." }
  }

  const conversation = await prisma.conversation.upsert({
    where: { propertyId_tenantId: { propertyId, tenantId: session.user.id } },
    update: {},
    create: {
      propertyId,
      tenantId: session.user.id,
      landlordId: property.ownerId,
    },
  })

  return { success: true, data: { conversationId: conversation.id } }
}

/**
 * Busca una conversación ya existente sin crearla — para no ensuciar la
 * bandeja del arrendador con hilos vacíos solo por visitar la ficha.
 */
export async function findConversationForProperty(propertyId: string): Promise<ActionResult<{ conversationId: string } | null>> {
  const session = await auth()
  if (!session?.user) {
    return { success: true, data: null }
  }

  const conversation = await prisma.conversation.findUnique({
    where: { propertyId_tenantId: { propertyId, tenantId: session.user.id } },
    select: { id: true },
  })

  return { success: true, data: conversation ? { conversationId: conversation.id } : null }
}

async function assertParticipant(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } })
  if (!conversation) return null
  if (conversation.tenantId !== userId && conversation.landlordId !== userId) return null
  return conversation
}

export async function sendMessage(conversationId: string, content: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "No autorizado. Inicie sesión." }
  }
  if (!content.trim()) {
    return { success: false, error: "El mensaje no puede estar vacío." }
  }

  const conversation = await assertParticipant(conversationId, session.user.id)
  if (!conversation) {
    return { success: false, error: "No autorizado sobre esta conversación." }
  }

  const recipientId = conversation.tenantId === session.user.id ? conversation.landlordId : conversation.tenantId

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: session.user.id, content: content.trim() },
    }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ])

  const property = await prisma.property.findUnique({ where: { id: conversation.propertyId }, select: { title: true } })
  await createNotificationHelper(
    recipientId,
    "NEW_MESSAGE",
    "Nuevo mensaje",
    `Tienes un nuevo mensaje sobre "${property?.title ?? "una propiedad"}".`,
    { conversationId }
  )

  revalidatePath("/tenant/messages")
  revalidatePath("/landlord/messages")
  return { success: true }
}

export interface ConversationMessage {
  id: string
  senderId: string
  content: string
  createdAt: string
}

export interface ConversationDetail {
  id: string
  propertyId: string
  propertyTitle: string
  tenantId: string
  landlordId: string
  otherPartyName: string
  messages: ConversationMessage[]
}

export async function getConversation(conversationId: string): Promise<ActionResult<ConversationDetail>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "No autorizado. Inicie sesión." }
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      property: { select: { title: true } },
      tenant: { select: { firstName: true, lastName: true } },
      landlord: { select: { firstName: true, lastName: true } },
      messages: { orderBy: { createdAt: "asc" }, select: { id: true, senderId: true, content: true, createdAt: true } },
    },
  })

  if (!conversation || (conversation.tenantId !== session.user.id && conversation.landlordId !== session.user.id)) {
    return { success: false, error: "No autorizado sobre esta conversación." }
  }

  const isTenant = conversation.tenantId === session.user.id
  const otherParty = isTenant ? conversation.landlord : conversation.tenant

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: session.user.id }, read: false },
    data: { read: true },
  })

  return {
    success: true,
    data: {
      id: conversation.id,
      propertyId: conversation.propertyId,
      propertyTitle: conversation.property.title,
      tenantId: conversation.tenantId,
      landlordId: conversation.landlordId,
      otherPartyName: `${otherParty.firstName} ${otherParty.lastName}`,
      messages: conversation.messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    },
  }
}

export interface ConversationListItem {
  id: string
  propertyId: string
  propertyTitle: string
  otherPartyName: string
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
}

export async function getMyConversations(as: "tenant" | "landlord"): Promise<ActionResult<ConversationListItem[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "No autorizado. Inicie sesión." }
  }

  const where = as === "tenant" ? { tenantId: session.user.id } : { landlordId: session.user.id }

  const conversations = await prisma.conversation.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      property: { select: { title: true } },
      tenant: { select: { firstName: true, lastName: true } },
      landlord: { select: { firstName: true, lastName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
      _count: {
        select: {
          messages: { where: { senderId: { not: session.user.id }, read: false } },
        },
      },
    },
  })

  return {
    success: true,
    data: conversations.map(c => {
      const otherParty = as === "tenant" ? c.landlord : c.tenant
      return {
        id: c.id,
        propertyId: c.propertyId,
        propertyTitle: c.property.title,
        otherPartyName: `${otherParty.firstName} ${otherParty.lastName}`,
        lastMessage: c.messages[0]?.content ?? null,
        lastMessageAt: (c.messages[0]?.createdAt ?? c.updatedAt).toISOString(),
        unreadCount: c._count.messages,
      }
    }),
  }
}
