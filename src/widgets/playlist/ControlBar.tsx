import styled, { useTheme } from 'styled-components'

import { Next, Pause, Prev, Start } from '@/assets/icons'
import { SvgButton } from '@/shared/ui'
import type { BackgroundPlayerHandle } from '@/widgets/playlist/BackgroundPlayer'

interface ControlBarProps {
  playerRef?: React.RefObject<BackgroundPlayerHandle | null>
  isPlaying: boolean
  onTogglePlay: () => void
}

const ControlBar = ({ playerRef, isPlaying, onTogglePlay }: ControlBarProps) => {
  const theme = useTheme()

  const handlePrev = () => playerRef?.current?.prevTrack()
  const handleNext = () => playerRef?.current?.nextTrack()

  const handleIconToggle = () => {
    onTogglePlay()
  }

  return (
    <Wrapper>
      <SvgButton icon={Prev} width={32} height={32} onClick={handlePrev} />
      <SvgButton
        icon={isPlaying ? Pause : Start}
        width={32}
        height={32}
        onClick={handleIconToggle}
        fill={theme.COLOR['common-white']}
      />
      <SvgButton icon={Next} width={32} height={32} onClick={handleNext} />
    </Wrapper>
  )
}
export default ControlBar

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 32px 60px 40px 60px;
`
