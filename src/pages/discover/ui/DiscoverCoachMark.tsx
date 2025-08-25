import Lottie from 'lottie-react'
import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import { SwipeLottie } from '@/assets/lottie'
import { flexColCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface DiscoverCoachMarkProps {
  onClick: () => void
}

const DiscoverCoachMark = ({ onClick }: DiscoverCoachMarkProps) => {
  return (
    <Overlay>
      <CloseButton>
        <SvgButton icon={Cancel} onClick={onClick} />
      </CloseButton>

      <ContentWrapper>
        <Content>
          <p>
            더 많은 플레이리스트를 보려면 <br />
            <Highlight>화면을 위로</Highlight> 올려보세요!
          </p>
        </Content>
        <Lottie animationData={SwipeLottie} loop autoplay />
      </ContentWrapper>
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
  background: rgba(15, 16, 20, 0.68);
  z-index: 999;
`

const CloseButton = styled.div`
  position: absolute;
  top: 18px;
  right: 0;
  z-index: 1001;
`

const ContentWrapper = styled.div`
  height: 100%;
  ${flexColCenter}
`

const Content = styled.div`
  text-align: center;
  ${({ theme }) => theme.FONT.headline1};
  font-weight: 600;
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.COLOR['primary-normal']};
`
