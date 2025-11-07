import type { RefObject } from 'react'

import styled from 'styled-components'

import { Volume } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'

interface VolumeButtonProps {
  playerRef: RefObject<YT.Player | null>
  isMuted: boolean | null
  setIsMuted: (value: boolean) => void
}

const VolumeButton = ({ playerRef, isMuted, setIsMuted }: VolumeButtonProps) => {
  if (isMuted === null) return null // 초기 상태 확인 전 렌더링 X

  const toggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()

      const playerState = playerRef.current.getPlayerState()
      // 1 === 재생상태
      if (playerState !== 1) {
        playerRef.current.playVideo()
      }
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }
  return (
    <StyledButton onClick={toggleMute}>
      <Volume />
      탭하여 음소거 해제
    </StyledButton>
  )
}

export default VolumeButton

const StyledButton = styled.button`
  position: absolute;
  z-index: 1000;

  background-color: ${({ theme }) => theme.COLOR['common-white']};
  color: ${({ theme }) => theme.COLOR['gray-900']};
  ${({ theme }) => theme.FONT.caption1};
  ${flexRowCenter}
  padding: 10px;
  gap: 4px;
  border-radius: 4px;
  white-space: nowrap;
`
