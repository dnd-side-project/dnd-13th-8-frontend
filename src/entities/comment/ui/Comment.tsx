import { useState } from 'react'

import styled from 'styled-components'

import { Menu } from '@/assets/icons'
import { BottomSheet, Profile, SvgButton } from '@/shared/ui'

interface CommentProps {
  profileUrl?: string
  name: string
  comment: string
  role: 'owner' | 'mine' | 'other'
}

const COMMENT_OPTIONS = {
  owner: [
    { text: '삭제하기', type: 'delete' },
    { text: '신고하기', type: 'report' },
  ],
  mine: [{ text: '삭제하기', type: 'delete' }],
  other: [{ text: '신고하기', type: 'report' }],
} as const

const Comment = ({ profileUrl, name, comment, role }: CommentProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleOptionClick = (type: 'delete' | 'report') => {
    if (type === 'delete') {
      console.log('삭제') // TODO: 실제 삭제 요청으로 변경
    } else if (type === 'report') {
      console.log('신고') // TODO: 실제 신고 요청으로 변경
    }

    setIsBottomSheetOpen(false)
  }

  return (
    <>
      <CommentWrapper>
        <Profile size="S" profileUrl={profileUrl} />
        <TextBox>
          <Name>{name}</Name>
          <Text>{comment}</Text>
        </TextBox>
        <SvgButton width={20} height={20} icon={Menu} onClick={() => setIsBottomSheetOpen(true)} />
      </CommentWrapper>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="fit-content"
      >
        {COMMENT_OPTIONS[role].map((option) => (
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
  flex: 1;
`

const Name = styled.span`
  ${({ theme }) => theme.FONT.caption1};
  color: ${({ theme }) => theme.COLOR['gray-200']};
`

const Text = styled.span`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-50']};
`
const StyledButton = styled.button<{ $optionType: 'delete' | 'report' }>`
  width: 100%;
  padding: 16px 20px;

  ${({ theme }) => theme.FONT.headline2};

  color: ${({ $optionType, theme }) =>
    $optionType === 'delete' ? theme.COLOR['gray-50'] : theme.COLOR['common-error']};
`
