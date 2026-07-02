"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageMultiple02Icon } from "hugeicons-react"
import { getMyConversations, type ConversationListItem } from "@/app/actions/message-actions"

interface MessagesInboxProps {
  role: "tenant" | "landlord"
}

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
  if (diffDays === 1) return "Ayer"
  return `Hace ${diffDays} días`
}

export function MessagesInbox({ role }: MessagesInboxProps) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchConversations = async () => {
      const res = await getMyConversations(role)
      if (!cancelled && res.success && res.data) setConversations(res.data)
      if (!cancelled) setLoading(false)
    }
    fetchConversations()
    const interval = setInterval(fetchConversations, 30000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [role])

  if (loading) {
    return <div className="text-center py-16 text-sm text-panel-text-muted">Cargando mensajes...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-panel-text mb-5">Mensajes</h1>

      {conversations.length === 0 ? (
        <div className="bg-panel-card-bg border border-panel-border rounded-2xl p-10 text-center">
          <MessageMultiple02Icon size={36} className="text-panel-text-dim mx-auto mb-3" />
          <p className="text-sm font-bold text-panel-text mb-1">Sin conversaciones</p>
          <p className="text-xs text-panel-text-muted">
            {role === "tenant"
              ? "Cuando escribas a un arrendador desde una propiedad, la conversación aparecerá aquí."
              : "Cuando un inquilino te escriba sobre una propiedad, la conversación aparecerá aquí."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/${role}/messages/${c.id}`}
              className="flex items-center gap-3 bg-panel-card-bg border border-panel-border rounded-2xl p-4 no-underline hover:border-accent/40 transition-colors"
            >
              <div
                className="size-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
              >
                {c.otherPartyName[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-panel-text truncate">{c.otherPartyName}</p>
                  <span className="text-[10px] text-panel-text-dim shrink-0">{formatRelativeTime(c.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-panel-text-muted truncate">{c.propertyTitle}</p>
                {c.lastMessage && (
                  <p className="text-xs text-panel-text-dim truncate mt-0.5">{c.lastMessage}</p>
                )}
              </div>
              {c.unreadCount > 0 && (
                <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {c.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
