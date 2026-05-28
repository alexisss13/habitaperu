import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function createNotificationHelper(
  userId: string,
  type: string,
  title: string,
  message: string,
  metadata?: any,
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma
  return await client.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
    }
  })
}
