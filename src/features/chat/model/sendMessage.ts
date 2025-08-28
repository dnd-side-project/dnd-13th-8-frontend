import { useEffect, useRef, useState, useCallback } from 'react'

import { Client, type Message } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

export interface ChatMessage {
  senderId: string
  username: string | null
  content: string
  sentAt?: string
  systemMessage?: boolean
}

export const useChatSocket = (roomId: string) => {
  const clientRef = useRef<Client | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!roomId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('https://api.deulak.com/chat/ws') as unknown as WebSocket,
      debug: (str) => console.log('[STOMP]', str),
    })

    client.onConnect = () => {
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
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [roomId])

  const sendMessage = useCallback(
    (senderId: string, username: string | null, content: string) => {
      if (!clientRef.current || !connected || !content.trim()) return

      const payload: ChatMessage = {
        senderId,
        username,
        content,
        systemMessage: false,
      }

      clientRef.current.publish({
        destination: `/chat/app/rooms/${roomId}`,
        body: JSON.stringify(payload),
      })
    },
    [roomId, connected]
  )

  return { messages, participantCount, sendMessage, connected }
}
