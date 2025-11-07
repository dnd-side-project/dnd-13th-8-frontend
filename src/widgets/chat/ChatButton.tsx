import { useState } from 'react'

import styled from 'styled-components'

import { Message } from '@/assets/icons'
import { useChatCount } from '@/features/chat/model/useChat'
import { flexColCenter, myCdButton } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

import ChatBottomSheet from './ChatBottomSheet'

interface ChatButtonProps {
  roomId: number // playlistId === roomId
  creatorId: string
  type?: 'MY' | 'DISCOVER'
}

const ChatButton = ({ roomId, creatorId, type = 'DISCOVER' }: ChatButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const { data, isLoading, isError } = useChatCount(String(roomId))

  return (
    <>
      <ButtonWrapper $isMy={type === 'MY'} onClick={() => setIsBottomSheetOpen(true)}>
        <SvgButton
          icon={Message}
          width={type === 'MY' ? 16 : 24}
          height={type === 'MY' ? 16 : 24}
        />
        <Count>{isLoading || isError ? '···' : (data?.totalCount ?? 0)}</Count>
      </ButtonWrapper>

      {isBottomSheetOpen && (
        <ChatBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          roomId={String(roomId)}
          creatorId={creatorId}
        />
      )}
    </>
  )
}

export default ChatButton

const ButtonWrapper = styled.div<{ $isMy: boolean }>`
  ${({ $isMy }) =>
    $isMy
      ? myCdButton
      : `
        ${flexColCenter};
        gap: 2px;
      `}
`

const Count = styled.p`
  ${({ theme }) => theme.FONT.caption1}
  color: ${({ theme }) => theme.COLOR['gray-100']};
`
