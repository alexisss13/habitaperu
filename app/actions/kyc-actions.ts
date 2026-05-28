"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { KYCStatus } from "@prisma/client"

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

    return { success: true }
  } catch (error: any) {
    console.error("Error submitting KYC verification:", error)
    return { success: false, error: error.message || "Ocurrió un error al enviar la verificación." }
  }
}
