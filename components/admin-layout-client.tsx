"use client"

import { useState } from "react"
import AdminSidebar from "./admin-sidebar"
import AdminNavbar from "./admin-navbar"

interface AdminLayoutClientProps {
  children: React.ReactNode
  session: {
    user: {
      name?: string | null
      email?: string | null
      role: string
    }
  }
}

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-admin-bg">
      <AdminSidebar user={session.user} isCollapsed={isSidebarCollapsed} />
      <div
        className="flex-1 transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px' }}
      >
        <AdminNavbar
          user={session.user}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="pt-[70px]">
          {children}
        </main>
      </div>
    </div>
  )
}
