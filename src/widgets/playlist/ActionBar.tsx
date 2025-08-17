import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { Heart, Share, Playlist } from '@/assets/icons'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, Button } from '@/shared/ui'
import SvgButton from '@/shared/ui/SvgButton'

interface ActionBarProps {
  playlistId: number
}

const ActionBar = ({ playlistId }: ActionBarProps) => {
  const theme = useTheme()
  const [liked, setLiked] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const navigate = useNavigate()

  const handleLike = () => {
    setLiked((prev) => !prev)
  }

  const handleShare = () => {
    setIsBottomSheetOpen(true)
  }

  const handleMovePlaylist = () => {
    navigate(`/discover/${playlistId}/playlist`)
  }

  // TODO: 이미지 저장 기능 구현
  const handleSaveImage = () => {}

  const handleCopyLink = () => {
    const link = `${window.location.origin}/discover/${playlistId}`
    navigator.clipboard.writeText(link)
  }

  return (
    <Wrapper>
      <SvgButton
        icon={Heart}
        width={24}
        height={24}
        fill={liked ? theme.COLOR['primary-normal'] : 'none'}
        stroke={liked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
        onClick={handleLike}
      />
      <SvgButton icon={Share} width={24} height={24} onClick={handleShare} />
      <SvgButton icon={Playlist} width={24} height={24} onClick={handleMovePlaylist} />

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
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div`
  ${flexRowCenter}
  gap: 16px;
`

const ImagePreview = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
`

const BottomSheetWrapper = styled.div`
  ${flexColCenter}
  gap: 24px;
`

const ButtonBar = styled.div`
  ${flexRowCenter}
  gap: 10px;
  width: 100%;

  & button {
    flex: 1;
  }
`
