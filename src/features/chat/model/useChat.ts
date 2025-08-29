import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'

import { deleteChatMessage, getChatHistory } from '@/features/chat/api/chat'
import type { ChatHistoryResponse } from '@/features/chat/types/chat'

export const useInfiniteChatHistory = (roomId: string, limit = 50) => {
  return useInfiniteQuery<
    ChatHistoryResponse,
    Error,
    InfiniteData<ChatHistoryResponse>,
    [string, string],
    string | undefined
  >({
    queryKey: ['chat-history', roomId],
    queryFn: ({ pageParam }) =>
      getChatHistory(roomId, { before: pageParam, limit }).then((res) => res),
    initialPageParam: undefined, // pageParam -> string | undefined
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 0,
  })
}

export const useDeleteChatMessage = (roomId: string, removeMessage: (id: string) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageId: string) => deleteChatMessage(roomId, messageId),
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', roomId] })
      removeMessage(messageId) //  소켓 state 업데이트
    },
  })
}
