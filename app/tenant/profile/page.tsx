import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { ProfileView } from "./profile-view"

export const dynamic = "force-dynamic"

export default async function TenantProfilePage() {
  const session = await auth()
  if (!session || session.user.role !== Role.TENANT) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      bio: true,
      district: true,
      avatar: true,
      verified: true,
      twoFactorEnabled: true,
      createdAt: true,
      _count: { select: { contractsAsTenant: true } },
    },
  })

  if (!user) redirect("/login")

  return (
    <ProfileView
      profile={{
        ...user,
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        district: user.district ?? "",
        avatar: user.avatar ?? null,
        memberSince: user.createdAt.toISOString(),
        contractsCount: user._count.contractsAsTenant,
      }}
    />
  )
}
