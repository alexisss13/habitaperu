import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { LandlordPaymentsView } from "./payments-view"
import { hasLandlordRole } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function LandlordPaymentsPage() {
  const session = await auth()
  if (!session || !hasLandlordRole(session.user)) {
    redirect("/login")
  }

  const landlordId = session.user.id

  const payments = await prisma.payment.findMany({
    where: { landlordId },
    orderBy: { dueDate: "desc" },
    include: {
      tenant: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      contract: {
        select: {
          id: true,
          property: {
            select: {
              id: true,
              title: true,
              district: true,
              address: true,
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
    tenantName: `${p.tenant.firstName} ${p.tenant.lastName}`,
    tenantEmail: p.tenant.email,
    tenantPhone: p.tenant.phone,
    propertyId: p.contract.property.id,
    propertyName: p.contract.property.title,
    propertyDistrict: p.contract.property.district,
    propertyAddress: p.contract.property.address,
  }))

  return <LandlordPaymentsView payments={mappedPayments} />
}
