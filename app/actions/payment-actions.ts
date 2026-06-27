"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { PaymentStatus, Role } from "@prisma/client"
import { sendPaymentApprovedEmail } from "@/lib/email"
import { createNotificationHelper } from "@/lib/notifications"

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
        landlordId: true,
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

    // Notificar al arrendador del nuevo pago registrado
    await createNotificationHelper(
      payment.landlordId,
      "PAYMENT_SUBMIT",
      "Comprobante de pago subido",
      "El inquilino ha registrado un comprobante de pago. Por favor verifíquelo.",
      { paymentId: payment.id }
    )

    revalidatePath("/tenant/payments")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error submitting payment receipt:", error)
    return { success: false, error: error.message || "Ocurrió un error al registrar el comprobante." }
  }
}

export async function approvePayment(
  paymentId: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userId = session.user.id
    const userRole = session.user.role

    if (userRole !== Role.LANDLORD) {
      return { success: false, error: "Solo los propietarios pueden aprobar pagos." }
    }

    // Buscar el pago y verificar propiedad
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        contract: {
          select: { property: { select: { title: true } } },
        },
        tenant: {
          select: { firstName: true, email: true },
        },
      },
    })

    if (!payment) {
      return { success: false, error: "El pago especificado no existe." }
    }

    if (payment.landlordId !== userId) {
      return { success: false, error: "No tiene permisos para modificar este pago." }
    }

    // Actualizar pago a estado PAGADO
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAGADO,
        paidDate: new Date(),
      }
    })

    // Notificar al inquilino que el pago fue aprobado
    await createNotificationHelper(
      payment.tenantId,
      "PAYMENT_APPROVE",
      "Pago verificado y aprobado",
      "El propietario ha aprobado tu comprobante de pago. ¡Gracias!",
      { paymentId: payment.id }
    )

    // Enviar email de confirmación de pago
    const periodLabel = payment.dueDate
      ? new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "America/Lima" }).format(payment.dueDate)
      : "Mes actual"
    await sendPaymentApprovedEmail(
      payment.tenant.email,
      payment.tenant.firstName,
      payment.contract.property.title,
      Number(payment.amount),
      periodLabel,
    )

    revalidatePath("/landlord/payments")
    revalidatePath("/landlord/dashboard")
    revalidatePath("/tenant/payments")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error approving payment:", error)
    return { success: false, error: error.message || "Ocurrió un error al aprobar el pago." }
  }
}

export async function markOverduePayments(): Promise<ActionResult<{ updated: number }>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userRole = session.user.role
    if (userRole !== Role.ADMIN && userRole !== Role.LANDLORD) {
      return { success: false, error: "Solo administradores y arrendadores pueden marcar pagos como vencidos." }
    }

    const now = new Date()
    const result = await prisma.payment.updateMany({
      where: {
        status: { in: [PaymentStatus.PENDIENTE, PaymentStatus.EN_PROCESO] },
        dueDate: { lt: now },
      },
      data: { status: PaymentStatus.VENCIDO },
    })

    revalidatePath("/landlord/payments")
    revalidatePath("/landlord/dashboard")
    revalidatePath("/tenant/payments")
    revalidatePath("/tenant/dashboard")
    revalidatePath("/admin/payments")
    return { success: true, data: { updated: result.count } }
  } catch (error: any) {
    console.error("Error marking overdue payments:", error)
    return { success: false, error: error.message || "Ocurrió un error al marcar pagos vencidos." }
  }
}

export async function rejectPayment(
  paymentId: string,
  rejectionReason: string
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const userId = session.user.id
    const userRole = session.user.role

    if (userRole !== Role.LANDLORD) {
      return { success: false, error: "Solo los propietarios pueden rechazar pagos." }
    }

    // Buscar el pago y verificar propiedad
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        landlordId: true,
        tenantId: true,
        dueDate: true,
      }
    })

    if (!payment) {
      return { success: false, error: "El pago especificado no existe." }
    }

    if (payment.landlordId !== userId) {
      return { success: false, error: "No tiene permisos para modificar este pago." }
    }

    // Si la fecha actual ya superó la fecha de vencimiento, vuelve a VENCIDO, si no a PENDIENTE
    const isOverdue = new Date() > new Date(payment.dueDate)
    const nextStatus = isOverdue ? PaymentStatus.VENCIDO : PaymentStatus.PENDIENTE

    // Actualizar pago
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: nextStatus,
        receipt: null,
        paidDate: null,
        notes: rejectionReason ? `Rechazado: ${rejectionReason}` : null,
      }
    })

    // Notificar al inquilino que el pago fue rechazado
    await createNotificationHelper(
      payment.tenantId,
      "PAYMENT_REJECT",
      "Comprobante de pago rechazado",
      `El propietario ha rechazado tu comprobante de pago. Motivo: ${rejectionReason || "No especificado"}`,
      { paymentId: payment.id }
    )

    revalidatePath("/landlord/payments")
    revalidatePath("/landlord/dashboard")
    revalidatePath("/tenant/payments")
    revalidatePath("/tenant/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Error rejecting payment:", error)
    return { success: false, error: error.message || "Ocurrió un error al rechazar el pago." }
  }
}
