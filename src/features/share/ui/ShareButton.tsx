import { useState } from 'react'

import styled from 'styled-components'

import { Share } from '@/assets/icons'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, Button, SvgButton } from '@/shared/ui'

interface ShareButtonProps {
  playlistId: number
}

const ShareButton = ({ playlistId }: ShareButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleShare = () => {
    setIsBottomSheetOpen(true)
  }

  // TODO: 이미지 저장 기능 구현
  const handleSaveImage = () => {}

  const handleCopyLink = () => {
    const link = `${window.location.origin}/discover/${playlistId}`
    navigator.clipboard.writeText(link)
  }

  return (
    <>
      <SvgButton icon={Share} width={24} height={24} onClick={handleShare} />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="fit-content"
      >
        <BottomSheetWrapper>
          <ImagePreview />
          <ButtonBar>
            <Button onClick={handleSaveImage} size="M" state="secondary">
              이미지로 저장
            </Button>
            <Button onClick={handleCopyLink} size="M" state="secondary">
              링크 복사
            </Button>
          </ButtonBar>
        </BottomSheetWrapper>
      </BottomSheet>
    </>
  )
}

export default ShareButton

const BottomSheetWrapper = styled.div`
  ${flexColCenter}
  gap: 24px;
`

const ImagePreview = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
`

const ButtonBar = styled.div`
  ${flexRowCenter}
  gap: 10px;
  width: 100%;

  & button {
    flex: 1;
  }
`
