import Lottie from 'lottie-react'
import styled from 'styled-components'

import { SwipeLottie } from '@/assets/lottie'
import { flexColCenter } from '@/shared/styles/mixins'

interface DiscoverCoachMarkProps {
  onClose: () => void
}

const DiscoverCoachMark = ({ onClose }: DiscoverCoachMarkProps) => {
  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()

    setTimeout(() => {
      onClose()
    }, 0)
  }

  return (
    <Overlay
      onClick={handleOverlayClick}
      onTouchStart={handleOverlayClick}
      onMouseDown={handleOverlayClick}
    >
      <Content>
        <p>
          더 많은 플레이리스트를 보려면 <br />
          <Highlight>화면을 위로</Highlight> 올려보세요!
        </p>
      </Content>
      <Lottie animationData={SwipeLottie} loop autoplay style={{ height: 220 }} />
    </Overlay>
  )
}

export default DiscoverCoachMark

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(15, 16, 20, 0.8);
  z-index: ${({ theme }) => theme.Z_INDEX.coachMark};
  ${flexColCenter}

  pointer-events: auto;
`

const Content = styled.div`
  text-align: center;
  ${({ theme }) => theme.FONT.headline1};
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.COLOR['primary-normal']};
`
