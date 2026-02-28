import { useEffect, useRef, useState, useCallback } from 'react'

import { Client, type Message } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

import { useAuthStore } from '@/features/auth'
import { getListenerCount, type ChatMessage } from '@/features/chat'

export const useChatSocket = (roomId: string) => {
  const clientRef = useRef<Client | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const accessToken = useAuthStore((s) => s.accessToken)
  const anonymousToken = sessionStorage.getItem('anonymous_token')

  const authToken = accessToken || anonymousToken

  const fetchInitialCount = useCallback(async () => {
    if (!roomId) return

    try {
      const res = await getListenerCount(roomId)

      setParticipantCount(res.count)
    } catch (e) {
      console.error('초기 인원 조회 실패 : ', e)
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId || !authToken) return
    if (clientRef.current?.active) return // 이미 활성화된 연결 방지

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/chat/ws`),
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },

      debug: import.meta.env.DEV ? (str) => console.log('[STOMP]', str) : () => {},
    })

    client.onConnect = async () => {
      setConnected(true)

      // 메시지 구독
      client.subscribe(`/chat/topic/rooms/${roomId}`, (message: Message) => {
        const data: ChatMessage = JSON.parse(message.body)
        setMessages((prev) => [...prev, data])
      })

      // 참여자 수
      client.subscribe(`/chat/topic/rooms/${roomId}/count`, (message: Message) => {
        const { count } = JSON.parse(message.body)

        setParticipantCount(count)
      })

      await fetchInitialCount()
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [roomId, authToken, fetchInitialCount])

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current || !connected || !content.trim()) return

      clientRef.current.publish({
        destination: `/chat/app/rooms/${roomId}`,
        body: JSON.stringify({
          content,
          systemMessage: false,
        }),
      })
    },
    [roomId, connected]
  )

  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId))
  }, [])

  return { messages, participantCount, sendMessage, connected, removeMessage }
}
