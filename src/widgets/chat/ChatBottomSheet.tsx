import { useState } from 'react'

import styled from 'styled-components'

import { Comment, type CommentData } from '@/entities/comment'
import { useUserInfo } from '@/features/auth/model/useAuth'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { flexColCenter } from '@/shared/styles/mixins'
import { BottomSheet } from '@/shared/ui'
import ChatInput from '@/widgets/chat/ChatInput'

import EmojiCarousel from './EmojiCarousel'

interface ChatBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  comments?: CommentData[]
  roomId: string
}

const ChatBottomSheet = ({ isOpen, onClose, roomId }: ChatBottomSheetProps) => {
  const [input, setInput] = useState('')
  const { messages, sendMessage } = useChatSocket(roomId)

  const { data } = useUserInfo()
  console.log(data)

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="fit-content">
      <Title>실시간 채팅</Title>
      <CommentSection>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Comment
              key={msg.senderId + msg.sentAt}
              // profileUrl={msg?.username || null}
              name={msg.username || '익명'}
              comment={msg.content}
              role={msg.systemMessage ? 'mine' : 'owner'}
            />
          ))
        ) : (
          <Message>
            <EmptyText>아직 채팅이 없습니다</EmptyText>
            <HighlightText>첫 채팅을 남겨 보세요!</HighlightText>
          </Message>
        )}
      </CommentSection>
      <BottomSection>
        <EmojiCarousel />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => {
            if (input.trim()) {
              // TODO : 랜덤 이름 프론트에서 보내야 하는지 백엔드에서 생성하는 지 체크
              sendMessage(data?.userId || 'anonymous', data?.username || '익명', input)
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
