export interface ChatHistoryParams {
  before?: string
  limit?: number
}

export interface ChatMessage {
  senderId: string
  messageId: string
  username: string | null
  content: string
  sentAt: string
  profileImage: string | null
  systemMessage?: boolean
  roomId: string
}

export interface ChatHistoryResponse {
  messages: ChatMessage[]
  nextCursor?: string
}

export interface ChatCountResponse {
  totalCount: number
}

export interface ListenerNumResponse {
  roomId: string
  count: number
}
