"use client"

import { useState, useEffect, useRef } from "react"
import { Notification02Icon, Cancel01Icon } from "hugeicons-react"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from "@/app/actions/notification-actions"

interface NotificationBellProps {
  theme?: "admin" | "landlord" | "tenant"
}

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

function formatRelativeTime(dateStr: string): string {
  try {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    if (diffMs < 0) return "Ahora"
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Ahora"
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    if (diffDays === 1) return "Ayer"
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" })
  } catch (e) {
    return ""
  }
}

export function NotificationBell({ theme = "tenant" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await getNotifications()
      if (res.success && res.data) {
        setNotifications(res.data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch initial notifications on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      fetchNotifications()
    }
  }

  const handleMarkRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    try {
      await markNotificationAsRead(id)
    } catch (error) {
      console.error("Error marking notification as read:", error)
      fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await markAllNotificationsAsRead()
    } catch (error) {
      console.error("Error marking all read:", error)
      fetchNotifications()
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering mark as read when clicking delete
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id))
    try {
      await deleteNotification(id)
    } catch (error) {
      console.error("Error deleting notification:", error)
      fetchNotifications()
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Styles based on theme
  const isAdmin = theme === "admin"
  
  const bellButtonClass = isAdmin
    ? `relative size-10 rounded-lg border border-admin-border flex items-center justify-center cursor-pointer transition-all text-admin-text hover:bg-[var(--admin-hover-bg)] ${isOpen ? 'bg-[var(--admin-hover-bg)]' : 'bg-transparent'}`
    : `relative size-10 rounded-full border border-slate-200 flex items-center justify-center bg-white cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all text-[#151c26]`

  const dropdownClass = isAdmin
    ? "absolute top-[50px] right-0 w-80 bg-admin-card-bg border border-admin-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden z-[200]"
    : "absolute top-[50px] right-0 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-[200]"

  const headerClass = isAdmin
    ? "p-4 border-b border-admin-border flex items-center justify-between"
    : "p-4 border-b border-slate-100 flex items-center justify-between"

  const titleClass = isAdmin
    ? "text-sm font-semibold text-admin-text"
    : "text-sm font-semibold text-[#151c26]"

  const markAllTextClass = isAdmin
    ? "text-xs text-admin-accent cursor-pointer hover:underline bg-transparent border-none"
    : "text-xs text-accent font-semibold cursor-pointer hover:underline bg-transparent border-none"

  const listClass = `max-h-[350px] overflow-y-auto divide-y ${isAdmin ? "divide-admin-border" : "divide-slate-100"}`

  const itemClass = (isUnread: boolean) => {
    if (isAdmin) {
      return `px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--admin-hover-bg)] flex items-start gap-2 relative ${isUnread ? 'bg-[rgba(15,52,87,0.03)] font-medium' : 'bg-transparent'}`
    }
    return `px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 flex items-start gap-3 relative ${isUnread ? 'bg-amber-500/5 font-medium' : 'bg-transparent'}`
  }

  const unreadDotClass = isAdmin
    ? "size-2 rounded-full bg-accent-secondary mt-1.5 shrink-0"
    : "size-2 rounded-full bg-amber-500 mt-1.5 shrink-0"

  const textTitleClass = isAdmin ? "text-sm text-admin-text" : "text-sm text-[#151c26] font-medium"
  const textMessageClass = isAdmin ? "text-xs text-admin-text-muted mt-0.5 line-clamp-2" : "text-xs text-slate-500 mt-0.5 line-clamp-2"
  const textTimeClass = isAdmin ? "text-[10px] text-admin-text-muted mt-1 block" : "text-[10px] text-slate-400 mt-1 block"

  const emptyTextClass = isAdmin ? "p-8 text-center text-xs text-admin-text-muted" : "p-8 text-center text-sm text-slate-400"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={bellButtonClass}
        aria-label="Notificaciones"
      >
        <Notification02Icon size={20} />
        {unreadCount > 0 && (
          <div 
            className={
              isAdmin 
                ? "absolute -top-1 -right-1 size-[18px] rounded-full bg-accent-secondary text-white text-[0.65rem] font-bold flex items-center justify-center border-2 border-admin-card-bg"
                : "absolute -top-0.5 -right-0.5 size-5 rounded-full bg-amber-500 text-white text-[0.65rem] font-bold flex items-center justify-center border-2 border-white"
            }
          >
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className={dropdownClass}>
          <div className={headerClass}>
            <h3 className={titleClass}>Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                className={markAllTextClass}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className={listClass}>
            {notifications.length === 0 ? (
              <div className={emptyTextClass}>
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={itemClass(!notif.read)}
                >
                  {!notif.read && (
                    <div className={unreadDotClass} />
                  )}
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={textTitleClass}>{notif.title}</p>
                    <p className={textMessageClass}>{notif.message}</p>
                    <span className={textTimeClass}>{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(notif.id, e)}
                    className="absolute right-3 top-3 text-slate-300 hover:text-red-500 transition-colors p-1 bg-transparent border-none cursor-pointer rounded"
                    title="Eliminar"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
