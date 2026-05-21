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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg)' }}>
      <AdminSidebar 
        user={session.user} 
        isCollapsed={isSidebarCollapsed}
      />
      <div style={{ 
        flex: 1, 
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease'
      }}>
        <AdminNavbar 
          user={session.user}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main style={{ paddingTop: '70px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
