import styled from 'styled-components'

import { Start } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface PlayButtonProps {
  onPlayPause: () => void
}

const PlayButton = ({ onPlayPause }: PlayButtonProps) => {
  return (
    <Wrapper onClick={onPlayPause}>
      <SvgButton icon={Start} width={32} height={32} />
    </Wrapper>
  )
}
export default PlayButton

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  background: rgba(126, 136, 154, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 99px;
  width: 60px;
  height: 60px;
  ${flexColCenter}
`
