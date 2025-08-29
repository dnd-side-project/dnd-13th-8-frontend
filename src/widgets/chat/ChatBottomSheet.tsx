import { useState, useRef, useEffect } from 'react'

import styled from 'styled-components'

import { Comment } from '@/entities/comment'
import { useUserInfo } from '@/features/auth/model/useAuth'
import { parseMessage } from '@/features/chat'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { useInfiniteChatHistory } from '@/features/chat/model/useChat'
import { flexColCenter } from '@/shared/styles/mixins'
import { BottomSheet } from '@/shared/ui'
import ChatInput from '@/widgets/chat/ChatInput'

import EmojiCarousel from './EmojiCarousel'

interface ChatBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
}

const ChatBottomSheet = ({ isOpen, onClose, roomId }: ChatBottomSheetProps) => {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages: socketMessages, sendMessage } = useChatSocket(roomId)
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChatHistory(roomId)
  const { data: userData } = useUserInfo()

  const historyMessages = historyData?.pages.flatMap((page) => page.messages) ?? []

  // 히스토리 + 실시간 메시지 합치고 오래된 순으로 정렬
  const allMessages = [...historyMessages, ...socketMessages].sort(
    (a, b) => new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime()
  )

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

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="fit-content">
      <Title>실시간 채팅</Title>
      <CommentSection ref={scrollRef} onScroll={handleScroll}>
        {allMessages.length > 0 ? (
          allMessages.map((msg) => {
            const { Icon, text } = parseMessage(msg.content)
            // TODO : profileUrl, role 실제 값으로 변경 필요
            return (
              <Comment
                profileUrl=""
                key={msg.messageId}
                name={msg.username || '익명'}
                comment={text}
                Icon={Icon || undefined}
                role={msg.systemMessage ? 'mine' : 'owner'}
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
        {/* TODO : anonymous, 익명 수정 필요 */}
        <EmojiCarousel
          onClick={(value) => {
            if (!value) return
            sendMessage(userData?.userId || 'anonymous', userData?.username || '익명', value)
          }}
        />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => {
            if (input.trim()) {
              sendMessage(userData?.userId || 'anonymous', userData?.username || '익명', input)
              setInput('')
            }
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
