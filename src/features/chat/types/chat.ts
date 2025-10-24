export interface ChatHistoryParams {
  before?: string
  limit?: number
}

export interface ChatHistoryMessage {
  roomId: string
  messageId: string
  senderId: string
  username: string | null
  content: string
  sentAt: string
  systemMessage?: boolean
  profileImage: string | null
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[]
  nextCursor?: string
}

export interface ChatCountResponse {
  totalCount: number
}
