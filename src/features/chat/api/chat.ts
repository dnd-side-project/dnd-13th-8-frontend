import type {
  ChatCountResponse,
  ChatHistoryParams,
  ChatHistoryResponse,
  ListenerNumResponse,
} from '@/features/chat/types/chat'
import { api } from '@/shared/api/httpClient'

export const getChatHistory = (roomId: string, params: ChatHistoryParams = {}) => {
  return api.get<ChatHistoryResponse>(`/chat/rooms/${roomId}/history`, {
    params,
  })
}

export const deleteChatMessage = async (roomId: string, messageId: string) => {
  return api.delete(`/chat/rooms/${roomId}/messages/${messageId}`)
}

export const getChatCount = (roomId: string) => {
  return api.get<ChatCountResponse>(`/chat/rooms/${roomId}/count/chat`)
}

export const getListenerCount = (roomId: string) => {
  return api.get<ListenerNumResponse>(`/chat/rooms/${roomId}/count/member`)
}
