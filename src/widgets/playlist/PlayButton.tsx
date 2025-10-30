import styled, { keyframes, css } from 'styled-components'

import { Start } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface PlayButtonProps {
  onPlayPause: () => void
  show: boolean
}

const PlayButton = ({ onPlayPause, show }: PlayButtonProps) => {
  return (
    <Wrapper $show={show}>
      <SvgButton icon={Start} width={32} height={32} onClick={onPlayPause} />
    </Wrapper>
  )
}
export default PlayButton

const fadeZoom = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  40% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
`

const Wrapper = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};

  background: rgba(126, 136, 154, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 99px;
  width: 60px;
  height: 60px;
  ${flexColCenter}

  ${({ $show }) =>
    $show &&
    css`
      animation: ${fadeZoom} 1s ease-in-out forwards;
    `}
`
