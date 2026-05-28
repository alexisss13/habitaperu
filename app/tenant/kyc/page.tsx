import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { TenantKYCView } from "./kyc-view"

export const dynamic = "force-dynamic"

export default async function TenantKYCPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const userId = session.user.id

  const verification = await prisma.kYCVerification.findUnique({
    where: { userId },
    select: {
      status: true,
      dniDocument: true,
      dniVerified: true,
      biometricVerified: true,
      backgroundCheck: true,
      reviewNotes: true,
      verifiedAt: true,
    },
  })

  const mappedVerification = verification ? {
    status: verification.status,
    dniDocument: verification.dniDocument,
    dniVerified: verification.dniVerified,
    biometricVerified: verification.biometricVerified,
    backgroundCheck: verification.backgroundCheck,
    reviewNotes: verification.reviewNotes,
    verifiedAt: verification.verifiedAt ? verification.verifiedAt.toISOString() : null,
  } : null

  return <TenantKYCView verification={mappedVerification} />
}
