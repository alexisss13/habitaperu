import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantPaymentsView } from "./payments-view"
import { Role } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function TenantPaymentsPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.TENANT) {
    redirect("/login")
  }

  const tenantId = session.user.id

  const payments = await prisma.payment.findMany({
    where: { tenantId },
    orderBy: { dueDate: "desc" },
    include: {
      contract: {
        select: {
          id: true,
          terms: true,
          property: {
            select: {
              title: true,
              district: true,
            },
          },
        },
      },
    },
  })

  const mappedPayments = payments.map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    dueDate: p.dueDate.toISOString(),
    paidDate: p.paidDate ? p.paidDate.toISOString() : null,
    status: p.status,
    paymentMethod: p.paymentMethod,
    receipt: p.receipt,
    notes: p.notes,
    propertyName: p.contract.property.title,
    propertyDistrict: p.contract.property.district,
    contractTerms: p.contract.terms,
  }))

  return <TenantPaymentsView payments={mappedPayments} />
}
