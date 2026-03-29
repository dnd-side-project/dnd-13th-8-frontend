import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Menu } from '@/assets/icons'
import { useDeleteChatMessage, useReportChat } from '@/features/chat/model/useChat'
import { BottomSheet, Profile, SvgButton } from '@/shared/ui'

interface CommentProps {
  profileUrl?: string
  name: string
  comment: string
  role: 'owner' | 'mine' | 'other'
  roomId: string
  messageId: string
  shareCode: string | null
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  removeMessage: (id: string) => void
}

const COMMENT_OPTIONS = {
  owner: [
    { text: '프로필로 가기', type: 'profile' },
    { text: '삭제하기', type: 'delete' },
    { text: '신고하기', type: 'report' },
  ],
  mine: [{ text: '삭제하기', type: 'delete' }],
  other: [
    { text: '프로필로 가기', type: 'profile' },
    { text: '신고하기', type: 'report' },
  ],
} as const

const Comment = ({
  profileUrl,
  name,
  comment,
  role,
  Icon,
  roomId,
  shareCode,
  messageId,
  removeMessage,
}: CommentProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const navigate = useNavigate()

  const { toast } = useToast()
  const { mutate: deleteMessage } = useDeleteChatMessage(roomId, removeMessage)
  const { mutate: reportMessage } = useReportChat()

  const isClickable = !!shareCode
  const handleProfileClick = () => {
    if (!shareCode) return
    navigate(`/${shareCode}`)
  }

  const handleOptionClick = (type: 'delete' | 'report' | 'profile') => {
    if (type === 'delete') {
      deleteMessage(messageId, {
        onSuccess: () => toast('COMMENT'),
      })
    } else if (type === 'report') {
      reportMessage(
        { roomId, messageId },
        {
          onSuccess: () => toast('REPORT'),
        }
      )
    } else if (type === 'profile') {
      handleProfileClick()
    }

    setIsBottomSheetOpen(false)
  }

  return (
    <>
      <CommentWrapper>
        <ProfileWrapper
          onClick={isClickable ? handleProfileClick : undefined}
          $clickable={isClickable}
        >
          <Profile size={32} profileUrl={profileUrl} />
        </ProfileWrapper>

        <TextBox>
          <Name onClick={isClickable ? handleProfileClick : undefined} $clickable={isClickable}>
            {name}
          </Name>

          <Text>
            {Icon && <Icon width={20} height={20} />}
            {comment}
          </Text>
        </TextBox>

        <SvgButton width={20} height={20} icon={Menu} onClick={() => setIsBottomSheetOpen(true)} />
      </CommentWrapper>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="fit-content"
      >
        {COMMENT_OPTIONS[role]
          .filter((option) => !(option.type === 'profile' && !shareCode))
          .map((option) => (
            <StyledButton
              key={option.text}
              $optionType={option.type}
              onClick={() => handleOptionClick(option.type)}
            >
              {option.text}
            </StyledButton>
          ))}
      </BottomSheet>
    </>
  )
}

export default Comment

const CommentWrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const Name = styled.span<{ $clickable: boolean }>`
  ${({ theme }) => theme.FONT.caption1};
  color: ${({ theme }) => theme.COLOR['gray-200']};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`

const Text = styled.span`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-50']};
  display: flex;
  gap: 6px;
`

const StyledButton = styled.button<{ $optionType: 'delete' | 'report' | 'profile' }>`
  width: 100%;
  padding: 16px 20px;

  ${({ theme }) => theme.FONT.headline2};

  color: ${({ $optionType, theme }) =>
    $optionType === 'report' ? theme.COLOR['common-error'] : theme.COLOR['gray-50']};
`

const ProfileWrapper = styled.button<{ $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`
