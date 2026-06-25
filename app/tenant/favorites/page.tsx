import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { FavoritesView } from "./favorites-view"

export default async function TenantFavoritesPage() {
  const session = await auth()
  if (!session || session.user.role !== Role.TENANT) redirect("/login")

  return <FavoritesView />
}
