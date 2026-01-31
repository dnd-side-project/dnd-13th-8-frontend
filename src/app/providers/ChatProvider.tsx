import { createContext, useContext, type ReactNode } from 'react'

import { useChatSocket } from '@/features/chat/model/sendMessage'

interface ChatProviderProps {
  roomId: string
  children: ReactNode
}

export const ChatContext = createContext<ReturnType<typeof useChatSocket> | null>(null)

export const ChatProvider = ({ roomId, children }: ChatProviderProps) => {
  const chat = useChatSocket(roomId)

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat 사용 오류: ChatProvider 내부에서 호출하세요')
  return ctx
}
