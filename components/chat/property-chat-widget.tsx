"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SentIcon, MessageMultiple02Icon } from "hugeicons-react"
import {
  findConversationForProperty,
  getOrStartConversation,
  getConversation,
  sendMessage,
  type ConversationMessage,
} from "@/app/actions/message-actions"

interface PropertyChatWidgetProps {
  propertyId: string
  currentUserId: string
  compact?: boolean
}

export function PropertyChatWidget({ propertyId, currentUserId, compact }: PropertyChatWidgetProps) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    findConversationForProperty(propertyId).then(async (res) => {
      if (cancelled) return
      if (res.data?.conversationId) {
        setConversationId(res.data.conversationId)
        const detail = await getConversation(res.data.conversationId)
        if (!cancelled && detail.success && detail.data) {
          setMessages(detail.data.messages)
        }
      }
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [propertyId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    setError(null)

    try {
      let convId = conversationId
      if (!convId) {
        const started = await getOrStartConversation(propertyId)
        if (!started.success || !started.data) {
          setError(started.error || "No se pudo iniciar la conversación.")
          setSending(false)
          return
        }
        convId = started.data.conversationId
        setConversationId(convId)
      }

      const sentText = text.trim()
      setText("")
      // Optimistic append
      setMessages(prev => [...prev, { id: `local-${Date.now()}`, senderId: currentUserId, content: sentText, createdAt: new Date().toISOString() }])

      const res = await sendMessage(convId, sentText)
      if (!res.success) {
        setError(res.error || "No se pudo enviar el mensaje.")
      }
    } catch {
      setError("Error de red al enviar el mensaje.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-6 text-xs text-gray-400">Cargando chat...</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
      )}

      {messages.length > 0 ? (
        <div
          ref={scrollRef}
          className={`flex flex-col gap-2 overflow-y-auto pr-1 ${compact ? "max-h-48" : "max-h-64"}`}
        >
          {messages.map((m) => {
            const mine = m.senderId === currentUserId
            return (
              <div
                key={m.id}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                  mine
                    ? "self-end text-white rounded-br-md"
                    : "self-start bg-gray-100 text-[#151c26] rounded-bl-md"
                }`}
                style={mine ? { background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" } : undefined}
              >
                {m.content}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <MessageMultiple02Icon size={24} className="text-gray-300" />
          <p className="text-xs text-gray-400">Envía un mensaje al arrendador para consultar por esta propiedad.</p>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent bg-gray-50 transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Enviar mensaje"
          className="size-10 shrink-0 rounded-xl text-white flex items-center justify-center border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{ background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" }}
        >
          <SentIcon size={16} />
        </button>
      </form>

      {conversationId && (
        <Link
          href={`/tenant/messages/${conversationId}`}
          className="text-xs text-accent font-semibold text-center no-underline hover:underline"
        >
          Ver conversación completa
        </Link>
      )}
    </div>
  )
}
