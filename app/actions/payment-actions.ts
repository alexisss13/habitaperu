"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { PaymentStatus, Role } from "@prisma/client"

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}

export async function submitPaymentReceipt(
  paymentId: string,
  paymentMethod: string,
  receiptUrl: string,
  notes?: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userId = session.user.id
    const userRole = session.user.role

    if (userRole !== Role.TENANT) {
      return { success: false, error: "Solo los inquilinos pueden registrar comprobantes de pago." }
    }

    // Buscar el pago y verificar propiedad
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        tenantId: true,
        status: true,
      }
    })

    if (!payment) {
      return { success: false, error: "El pago especificado no existe." }
    }

    if (payment.tenantId !== userId) {
      return { success: false, error: "No tiene permisos para modificar este pago." }
    }

    if (payment.status === PaymentStatus.PAGADO) {
      return { success: false, error: "Este pago ya ha sido verificado y aprobado." }
    }

    // Actualizar pago a estado EN_PROCESO
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.EN_PROCESO,
        paymentMethod,
        receipt: receiptUrl,
        notes: notes || null,
        paidDate: new Date(),
      }
    })

    revalidatePath("/tenant/payments")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error submitting payment receipt:", error)
    return { success: false, error: error.message || "Ocurrió un error al registrar el comprobante." }
  }
}
