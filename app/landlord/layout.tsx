import { ReactNode } from 'react'
import { Home01Icon, UserMultiple02Icon, FileValidationIcon, Wallet01Icon, Settings02Icon } from 'hugeicons-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: 'Dashboard Arrendador - Habita Perú',
  description: 'Panel de control para arrendadores',
}

interface LandlordLayoutProps {
  children: ReactNode
}

export default async function LandlordLayout({ children }: LandlordLayoutProps) {
  const session = await auth()

  if (!session || session.user.role !== "LANDLORD") {
    redirect("/login")
  }

  const navigation = [
    { name: 'Dashboard', href: '/landlord/dashboard', icon: Home01Icon },
    { name: 'Inquilinos', href: '/landlord/tenants', icon: UserMultiple02Icon },
    { name: 'Contratos', href: '/landlord/contracts', icon: FileValidationIcon },
    { name: 'Pagos', href: '/landlord/payments', icon: Wallet01Icon },
    { name: 'Configuración', href: '/landlord/settings', icon: Settings02Icon },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center shrink-0 px-6 mb-8">
            <Home01Icon size={32} className="text-accent" />
            <span className="ml-3 text-xl font-bold tracking-tight text-text">Habita Perú</span>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-text-muted hover:bg-bg-2 hover:text-accent"
                >
                  <Icon size={20} className="mr-3 shrink-0 transition-colors" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="shrink-0 flex border-t border-slate-200 p-4">
            <div className="flex items-center w-full">
              <div className="shrink-0">
                <div
                  className="size-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}
                >
                  <span className="text-white font-semibold text-sm">
                    {session.user.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-text">{session.user.name}</p>
                <p className="text-xs text-text-muted">Arrendador</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
      </div>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center transition-colors text-text-muted hover:text-accent"
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
