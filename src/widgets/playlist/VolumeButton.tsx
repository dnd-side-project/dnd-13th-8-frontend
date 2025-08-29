import type { RefObject } from 'react'

import styled from 'styled-components'

interface VolumeButtonProps {
  playerRef: RefObject<YT.Player | null>
  isMuted: boolean | null
  setIsMuted: (value: boolean) => void
}

const VolumeButton = ({ playerRef, isMuted, setIsMuted }: VolumeButtonProps) => {
  if (isMuted === null) return null // 초기 상태 확인 전 렌더링 X

  const toggleMute = () => {
    if (!playerRef.current) return
    if (isMuted) playerRef.current.unMute()
    else playerRef.current.mute()
    setIsMuted(!isMuted)
  }

  return <StyledButton onClick={toggleMute} />
}

export default VolumeButton

const StyledButton = styled.button`
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 100%;
`
