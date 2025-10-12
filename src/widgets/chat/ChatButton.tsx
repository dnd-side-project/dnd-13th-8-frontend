import { useState } from 'react'

import styled from 'styled-components'

import { Message } from '@/assets/icons'
import { flexRowCenter, myCdButton } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

import ChatBottomSheet from './ChatBottomSheet'

interface ChatButtonProps {
  roomId: number // playlistId === roomId
  creatorId: string
  type?: 'MY' | 'DISCOVER'
}

const ChatButton = ({ roomId, creatorId, type = 'DISCOVER' }: ChatButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  return (
    <>
      <ButtonWrapper $isMy={type === 'MY'} onClick={() => setIsBottomSheetOpen(true)}>
        <SvgButton
          icon={Message}
          width={type === 'MY' ? 16 : 24}
          height={type === 'MY' ? 16 : 24}
        />
        {type === 'MY' && <p>28</p>}
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
  ${flexRowCenter};
  ${({ $isMy }) => $isMy && myCdButton};
`
