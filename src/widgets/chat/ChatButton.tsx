import { useState } from 'react'

import { Message } from '@/assets/icons'
import { SvgButton } from '@/shared/ui'

import ChatBottomSheet from './ChatBottomSheet'

interface CharButtonProps {
  roomId: number // playlistId === roomId임
}

const ChatButton = ({ roomId }: CharButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  return (
    <>
      <SvgButton icon={Message} width={24} height={24} onClick={() => setIsBottomSheetOpen(true)} />

      {isBottomSheetOpen && (
        <ChatBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          roomId={String(roomId)}
        />
      )}
    </>
  )
}

export default ChatButton
