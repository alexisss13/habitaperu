"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ArrowLeft01Icon, SentIcon } from "hugeicons-react"
import { getConversation, sendMessage, type ConversationMessage } from "@/app/actions/message-actions"

interface ConversationThreadProps {
  conversationId: string
  role: "tenant" | "landlord"
}

export function ConversationThread({ conversationId, role }: ConversationThreadProps) {
  const { data: session } = useSession()
  const [propertyTitle, setPropertyTitle] = useState("")
  const [otherPartyName, setOtherPartyName] = useState("")
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const fetchThread = async () => {
      const res = await getConversation(conversationId)
      if (cancelled) return
      if (res.success && res.data) {
        setPropertyTitle(res.data.propertyTitle)
        setOtherPartyName(res.data.otherPartyName)
        setMessages(res.data.messages)
      } else {
        setError(res.error || "No se pudo cargar la conversación.")
      }
      setLoading(false)
    }
    fetchThread()
    const interval = setInterval(fetchThread, 6000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [conversationId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending || !session?.user?.id) return
    setSending(true)
    const sentText = text.trim()
    setText("")
    setMessages(prev => [...prev, { id: `local-${Date.now()}`, senderId: session.user.id, content: sentText, createdAt: new Date().toISOString() }])

    const res = await sendMessage(conversationId, sentText)
    if (!res.success) setError(res.error || "No se pudo enviar el mensaje.")
    setSending(false)
  }

  if (loading) {
    return <div className="text-center py-16 text-sm text-panel-text-muted">Cargando conversación...</div>
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-panel-border shrink-0">
        <Link href={`/${role}/messages`} className="text-panel-text-muted no-underline flex items-center">
          <ArrowLeft01Icon size={20} />
        </Link>
        <div className="min-w-0">
          <p className="text-sm font-bold text-panel-text truncate">{otherPartyName}</p>
          <p className="text-xs text-panel-text-muted truncate">{propertyTitle}</p>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {messages.map((m) => {
          const mine = m.senderId === session?.user?.id
          return (
            <div
              key={m.id}
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                mine ? "self-end text-white rounded-br-md" : "self-start bg-panel-hover-bg text-panel-text rounded-bl-md"
              }`}
              style={mine ? { background: "linear-gradient(135deg, #0f3457 0%, #8f8272 100%)" } : undefined}
            >
              {m.content}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-panel-border shrink-0">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-3.5 py-2.5 border border-panel-border rounded-xl text-sm outline-none focus:border-accent bg-panel-bg text-panel-text transition-colors"
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
    </div>
  )
}
