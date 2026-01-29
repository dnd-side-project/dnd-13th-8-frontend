import { useState, useRef, useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'

import { useChat } from '@/app/providers/ChatProvider'
import { Comment } from '@/entities/comment'
import { useUserInfo } from '@/features/auth/model/useAuth'
import { parseMessage, type ChatCountResponse, type ChatMessage } from '@/features/chat'
import { useInfiniteChatHistory } from '@/features/chat/model/useChat'
import { flexColCenter } from '@/shared/styles/mixins'
import { BottomSheet } from '@/shared/ui'
import ChatInput from '@/widgets/chat/ChatInput'

import EmojiCarousel from './EmojiCarousel'

interface ChatBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  creatorId: string
}

const ChatBottomSheet = ({ isOpen, onClose, roomId, creatorId }: ChatBottomSheetProps) => {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { messages: socketMessages, sendMessage, removeMessage } = useChat()
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChatHistory(roomId)
  const { data: userData } = useUserInfo()

  const historyMessages: ChatMessage[] = historyData?.pages.flatMap((page) => page.messages) ?? []

  // 히스토리 + 실시간 메시지 합치고 오래된 순으로 정렬
  const allMessages = (() => {
    const messageMap = new Map<string, ChatMessage>()

    ;[...historyMessages, ...socketMessages].forEach((msg: ChatMessage) => {
      messageMap.set(msg.messageId, msg)
    })

    return Array.from(messageMap.values()).sort(
      (a, b) => new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime()
    )
  })()

  // 스크롤 맨 아래 유지
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [allMessages.length])

  // 스크롤 이벤트로 이전 메시지 불러오기
  const handleScroll = () => {
    if (!scrollRef.current) return
    if (scrollRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !userData?.userId || !userData?.username) return
    const origin = queryClient.getQueryData<ChatCountResponse>(['chat-count', roomId])

    queryClient.setQueryData(['chat-count', roomId], (prev: ChatCountResponse) => ({
      totalCount: (prev?.totalCount ?? 0) + 1,
    }))

    try {
      await sendMessage(content)
    } catch (error) {
      console.error(error)
      queryClient.setQueryData(['chat-count', roomId], origin)
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="fit-content">
      <Title>실시간 채팅</Title>
      <CommentSection ref={scrollRef} onScroll={handleScroll}>
        {allMessages.length > 0 ? (
          allMessages.map((msg) => {
            const { Icon, text } = parseMessage(msg.content)

            // role 판별
            let role: 'mine' | 'owner' | 'other' = 'other'
            if (msg.senderId === userData?.userId) {
              role = 'mine'
            } else if (userData?.userId === creatorId) {
              role = 'owner'
            }

            return (
              <Comment
                profileUrl={msg.profileImage ?? undefined}
                key={msg.messageId}
                name={msg.username || '익명'}
                comment={text}
                Icon={Icon || undefined}
                role={role}
                messageId={msg.messageId}
                roomId={msg.roomId}
                removeMessage={removeMessage}
              />
            )
          })
        ) : (
          <Message>
            <EmptyText>아직 채팅이 없습니다</EmptyText>
            <HighlightText>첫 채팅을 남겨 보세요!</HighlightText>
          </Message>
        )}
      </CommentSection>
      <BottomSection>
        <EmojiCarousel onClick={(value) => handleSendMessage(value)} />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => {
            handleSendMessage(input)
            setInput('')
          }}
        />
      </BottomSection>
    </BottomSheet>
  )
}

export default ChatBottomSheet

const Title = styled.h1`
  ${({ theme }) => theme.FONT.headline1};
  font-weight: 600;
  color: ${({ theme }) => theme.COLOR['gray-10']};
  padding: 12px 0 12px 20px;
  margin: 0 -20px;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR['gray-600']};
`

const Message = styled.div`
  ${flexColCenter}
  gap: 4px;
  height: 350px;
`

const EmptyText = styled.span`
  color: ${({ theme }) => theme.COLOR['gray-50']};
  font-weight: 600;
  ${({ theme }) => theme.FONT.heading2};
`

const HighlightText = styled.span`
  color: ${({ theme }) => theme.COLOR['gray-200']};
  ${({ theme }) => theme.FONT['body1-normal']};
`

const CommentSection = styled.div`
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const BottomSection = styled.div`
  margin: 0 -20px;
  padding: 0 20px;
  box-shadow: 4px 0px 16px rgba(0, 0, 0, 0.4);
`
