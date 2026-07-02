import { ConversationThread } from "@/components/chat/conversation-thread"

export default async function TenantConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConversationThread conversationId={id} role="tenant" />
}
