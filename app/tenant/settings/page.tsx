import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { UserSettingsView } from "@/components/user-settings-view"

export const dynamic = "force-dynamic"

export default async function TenantSettingsPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "TENANT") {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      twoFactorEnabled: true
    }
  })

  if (!user) {
    redirect("/login")
  }

  const mappedUser = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    role: user.role,
    twoFactorEnabled: user.twoFactorEnabled
  }

  return (
    <div className="bg-panel-bg min-h-screen">
      <UserSettingsView user={mappedUser} />
    </div>
  )
}
