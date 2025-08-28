import type { ChatHistoryParams, ChatHistoryResponse } from '@/features/chat/types/chat'
import { api } from '@/shared/api/httpClient'

export const getChatHistory = (roomId: string, params: ChatHistoryParams = {}) => {
  return api.get<ChatHistoryResponse>(`/chat/rooms/${roomId}/history`, {
    params,
  })
}
