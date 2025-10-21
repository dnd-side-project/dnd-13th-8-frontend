import styled, { useTheme } from 'styled-components'

import { Next, Pause, Prev, Start } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface ControlBarProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
}

const ControlBar = ({ isPlaying, onTogglePlay, onNext, onPrev }: ControlBarProps) => {
  const theme = useTheme()

  return (
    <Wrapper>
      <SvgButton icon={Prev} width={24} height={24} onClick={onPrev} />
      <SvgButton
        icon={isPlaying ? Pause : Start}
        width={32}
        height={32}
        onClick={onTogglePlay}
        fill={theme.COLOR['common-white']}
      />
      <SvgButton icon={Next} width={24} height={24} onClick={onNext} />
    </Wrapper>
  )
}
export default ControlBar

const Wrapper = styled.div`
  ${flexRowCenter}
  gap: 48px;
`
