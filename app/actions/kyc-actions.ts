"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { KYCStatus, Role } from "@prisma/client"
import { createNotificationHelper } from "@/lib/notifications"
import { sendKycApprovedEmail, sendKycRejectedEmail } from "@/lib/email"
import { FACE_MATCH_PERCENT_THRESHOLD } from "@/lib/face-verification-constants"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

export async function submitKYCVerification(
  dniDocumentUrl: string,
  selfiePhotoUrl: string,
  faceMatchScore: number
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userId = session.user.id

    // Si el cotejo facial (calculado en el cliente con face-api.js) supera el
    // umbral, se aprueba automáticamente. Si la coincidencia es baja, se
    // envía a revisión manual del admin en vez de rechazar de plano.
    const autoApproved = faceMatchScore >= FACE_MATCH_PERCENT_THRESHOLD
    const nextStatus = autoApproved ? KYCStatus.APROBADO : KYCStatus.EN_REVISION

    await prisma.$transaction(async (tx) => {
      await tx.kYCVerification.upsert({
        where: { userId },
        create: {
          userId,
          status: nextStatus,
          dniDocument: dniDocumentUrl,
          selfiePhoto: selfiePhotoUrl,
          faceMatchScore,
          dniVerified: autoApproved,
          biometricVerified: autoApproved,
          backgroundCheck: false,
          verifiedAt: autoApproved ? new Date() : null,
        },
        update: {
          status: nextStatus,
          dniDocument: dniDocumentUrl,
          selfiePhoto: selfiePhotoUrl,
          faceMatchScore,
          dniVerified: autoApproved,
          biometricVerified: autoApproved,
          backgroundCheck: false,
          verifiedAt: autoApproved ? new Date() : null,
          reviewNotes: null, // Clear any previous rejection notes
        }
      })

      if (autoApproved) {
        await tx.user.update({ where: { id: userId }, data: { verified: true } })
        await createNotificationHelper(
          userId,
          "KYC_APPROVE",
          "Identidad verificada exitosamente",
          "Tu rostro coincide con tu DNI. Tu verificación fue aprobada automáticamente y ya puedes firmar contratos y subir pagos.",
          null,
          tx
        )
      }
    })

    revalidatePath("/tenant/kyc")
    revalidatePath("/tenant/dashboard")

    if (autoApproved) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } })
      if (user) {
        sendKycApprovedEmail(user.email, user.firstName).catch(err => {
          console.error("Error sending KYC approved email:", err)
        })
      }
      return { success: true }
    }

    // Notificar a todos los administradores para revisión manual
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
          `Un usuario ha cargado sus documentos de identidad para verificación KYC (coincidencia facial: ${Math.round(faceMatchScore)}%, requiere revisión manual).`,
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

    // Enviar email de KYC aprobado
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true }
    }).then(user => {
      if (user) {
        sendKycApprovedEmail(user.email, user.firstName).catch(err => {
          console.error("Error sending KYC approved email:", err)
        })
      }
    }).catch(err => {
      console.error("Error fetching user for KYC approved email:", err)
    })

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

    // Enviar email de KYC rechazado
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true }
    }).then(user => {
      if (user) {
        sendKycRejectedEmail(user.email, user.firstName, reason).catch(err => {
          console.error("Error sending KYC rejected email:", err)
        })
      }
    }).catch(err => {
      console.error("Error fetching user for KYC rejected email:", err)
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error rejecting KYC:", error)
    return { success: false, error: error.message || "Ocurrió un error al rechazar la verificación." }
  }
}
