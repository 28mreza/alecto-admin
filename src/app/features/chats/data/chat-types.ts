/**
 * Chat types ported from `shadcn-admin/src/features/chats/data/chat-types.ts`.
 * The source derives these from `convo.json`; here they are explicit
 * interfaces so templates and helpers stay strictly typed.
 */
export interface ChatMessage {
  sender: string
  message: string
  timestamp: string
}

export interface ChatUser {
  id: string
  profile: string
  username: string
  fullName: string
  title: string
  messages: ChatMessage[]
}

/** A single conversation entry (mirrors the source `Convo` type). */
export type Convo = ChatMessage

/** A chat user without the message history (used by the new-chat dialog). */
export type ChatUserPreview = Omit<ChatUser, 'messages'>
