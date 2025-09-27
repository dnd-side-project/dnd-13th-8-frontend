import styled from 'styled-components'

import { Pause, Start } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface PlayButtonProps {
  isPlaying: boolean
  onTogglePlay: () => void
}

const PlayButton = ({ isPlaying, onTogglePlay }: PlayButtonProps) => {
  return (
    <Wrapper>
      <SvgButton icon={isPlaying ? Pause : Start} width={24} height={24} onClick={onTogglePlay} />
    </Wrapper>
  )
}
export default PlayButton

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;

  background: rgba(126, 136, 154, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 99px;
  width: 60px;
  height: 60px;
  ${flexColCenter}
`
