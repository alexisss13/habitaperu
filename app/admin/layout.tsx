import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <DashboardLayout session={session} role="admin" showSearch showThemeSwitch>
      {children}
    </DashboardLayout>
  )
}
