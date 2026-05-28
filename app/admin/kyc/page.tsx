import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AdminKYCView } from "./kyc-view"
import { Role } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function AdminKYCPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const verifications = await prisma.kYCVerification.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          verified: true,
        },
      },
    },
  })

  const mappedVerifications = verifications.map((v) => ({
    id: v.id,
    userId: v.userId,
    status: v.status,
    dniVerified: v.dniVerified,
    biometricVerified: v.biometricVerified,
    backgroundCheck: v.backgroundCheck,
    dniDocument: v.dniDocument,
    biometricData: v.biometricData,
    backgroundReport: v.backgroundReport,
    reviewNotes: v.reviewNotes,
    verifiedAt: v.verifiedAt ? v.verifiedAt.toISOString() : null,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    user: {
      name: `${v.user.firstName} ${v.user.lastName}`,
      email: v.user.email,
      phone: v.user.phone,
      role: v.user.role,
      verified: v.user.verified,
    },
  }))

  return <AdminKYCView verifications={mappedVerifications} />
}
