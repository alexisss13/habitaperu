"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { KYCStatus, Role } from "@prisma/client"
import { createNotificationHelper } from "@/lib/notifications"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

export async function submitKYCVerification(
  dniDocumentUrl: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userId = session.user.id

    // Crear o actualizar registro de verificación KYC
    await prisma.kYCVerification.upsert({
      where: { userId },
      create: {
        userId,
        status: KYCStatus.EN_REVISION,
        dniDocument: dniDocumentUrl,
        dniVerified: false,
        biometricVerified: true, // Mock biometric as completed by client scan
        backgroundCheck: false,
      },
      update: {
        status: KYCStatus.EN_REVISION,
        dniDocument: dniDocumentUrl,
        dniVerified: false,
        biometricVerified: true,
        backgroundCheck: false,
        reviewNotes: null, // Clear any previous rejection notes
      }
    })

    revalidatePath("/tenant/kyc")
    revalidatePath("/tenant/dashboard")

    // Notificar a todos los administradores
    try {
      const admins = await prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true }
      })
      for (const admin of admins) {
        await createNotificationHelper(
          admin.id,
          "KYC_SUBMIT",
          "Nueva verificación KYC",
          "Un usuario ha cargado sus documentos de identidad para verificación KYC.",
          { applicantId: userId }
        )
      }
    } catch (err) {
      console.error("Error sending admin KYC notifications:", err)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error submitting KYC verification:", error)
    return { success: false, error: error.message || "Ocurrió un error al enviar la verificación." }
  }
}

export async function approveKYC(
  userId: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session || session.user.role !== Role.ADMIN) {
      return { success: false, error: "No autorizado. Debe ser administrador." }
    }

    // Actualizar verificación KYC a APROBADO y marcar campos como verificados
    await prisma.$transaction(async (tx) => {
      await tx.kYCVerification.update({
        where: { userId },
        data: {
          status: KYCStatus.APROBADO,
          dniVerified: true,
          backgroundCheck: true,
          verifiedAt: new Date(),
        }
      })

      // Actualizar al usuario como verificado
      await tx.user.update({
        where: { id: userId },
        data: {
          verified: true
        }
      })

      // Notificar al usuario inquilino
      await createNotificationHelper(
        userId,
        "KYC_APPROVE",
        "Identidad verificada exitosamente",
        "Tu verificación de identidad KYC ha sido aprobada. Ahora puedes firmar contratos y subir pagos.",
        null,
        tx
      )
    })

    revalidatePath("/admin/kyc")
    revalidatePath("/tenant/kyc")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error approving KYC:", error)
    return { success: false, error: error.message || "Ocurrió un error al aprobar la verificación." }
  }
}

export async function rejectKYC(
  userId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session || session.user.role !== Role.ADMIN) {
      return { success: false, error: "No autorizado. Debe ser administrador." }
    }

    if (!reason.trim()) {
      return { success: false, error: "Por favor indique el motivo de rechazo." }
    }

    // Actualizar verificación KYC a RECHAZADO y guardar notas
    await prisma.$transaction(async (tx) => {
      await tx.kYCVerification.update({
        where: { userId },
        data: {
          status: KYCStatus.RECHAZADO,
          reviewNotes: reason,
          verifiedAt: null,
        }
      })

      // Marcar al usuario como no verificado
      await tx.user.update({
        where: { id: userId },
        data: {
          verified: false
        }
      })

      // Notificar al usuario inquilino
      await createNotificationHelper(
        userId,
        "KYC_REJECT",
        "Verificación KYC rechazada",
        `Tu verificación de identidad KYC fue rechazada. Motivo: ${reason}`,
        null,
        tx
      )
    })

    revalidatePath("/admin/kyc")
    revalidatePath("/tenant/kyc")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error rejecting KYC:", error)
    return { success: false, error: error.message || "Ocurrió un error al rechazar la verificación." }
  }
}
