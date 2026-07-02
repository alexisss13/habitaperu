import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

// "Mi Panel" no aportaba nada que no estuviera ya, con más detalle, en
// /tenant/contract y /tenant/payments. Se mantiene la ruta como redirect
// (en vez de borrarla) porque varios emails y server actions ya apuntan
// a /tenant/dashboard.
export default async function TenantDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "TENANT") redirect("/login")

  redirect("/tenant/contract")
}
