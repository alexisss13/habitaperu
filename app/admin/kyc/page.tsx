import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AdminKYCView } from "./kyc-view"
import { Role, KYCStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function AdminKYCPage(props: { searchParams?: Promise<{ status?: string; page?: string; limit?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login")
  }

  const searchParams = await props.searchParams
  const statusFilter = searchParams?.status as string | undefined
  const validStatuses = Object.values(KYCStatus) as string[]
  const whereStatus = statusFilter && validStatuses.includes(statusFilter) ? statusFilter as KYCStatus : undefined

  const page = Math.max(1, parseInt(searchParams?.page ?? "1") || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit ?? "25") || 25))
  const skip = (page - 1) * limit

  const where = whereStatus ? { status: whereStatus } : {}

  const [verifications, total] = await Promise.all([
    prisma.kYCVerification.findMany({
      where,
      skip,
      take: limit,
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
    }),
    prisma.kYCVerification.count({ where }),
  ])

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
    selfiePhoto: v.selfiePhoto,
    faceMatchScore: v.faceMatchScore,
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

  return <AdminKYCView verifications={mappedVerifications} currentFilter={whereStatus ?? null} page={page} limit={limit} totalPages={Math.ceil(total / limit)} />
}
