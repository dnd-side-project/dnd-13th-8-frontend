import Lottie from 'lottie-react'
import styled from 'styled-components'

import { Cancel, CoachMarkArrow } from '@/assets/icons'
import { SwipeLottie } from '@/assets/lottie'
import { useDevice } from '@/shared/lib/useDevice'
import { Cd, SvgButton } from '@/shared/ui'

interface DiscoverCoachMarkProps {
  onClick: () => void
}

const DiscoverCoachMark = ({ onClick }: DiscoverCoachMarkProps) => {
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  return (
    <Overlay>
      <CloseButton>
        <SvgButton icon={Cancel} onClick={onClick} />
      </CloseButton>

      <ContentWrapper $isMobile={isMobile}>
        {isMobile && (
          <CoachMarkCdWrapper>
            <CdText>
              <Highlight>CD를 클릭</Highlight>하면 <br /> 플레이리스트가 재생돼요
            </CdText>
            <CoachMarkCd>
              <CoachMarkArrow />
              <Cd variant="xxl" bgColor="none" />
            </CoachMarkCd>
          </CoachMarkCdWrapper>
        )}
        <Content>
          <p>
            더 많은 플레이리스트를 보려면 <br />
            <Highlight>화면을 위로</Highlight> 올려보세요!
          </p>
        </Content>
        <LottieWrapper>
          <Lottie animationData={SwipeLottie} loop autoplay style={{ height: 190 }} />
        </LottieWrapper>
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

const ContentWrapper = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  top: ${({ $isMobile }) => ($isMobile ? '64px' : '50%')};
  transform: ${({ $isMobile }) => ($isMobile ? 'translateX(-50%)' : 'translate(-50%, -50%)')};
`

const Content = styled.div`
  text-align: center;
  ${({ theme }) => theme.FONT.headline1};
  font-weight: 600;

  margin-top: 20px;
  white-space: nowrap;
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.COLOR['primary-normal']};
`

const CoachMarkCd = styled.div`
  position: relative;

  & svg {
    position: absolute;
    right: 0;
    top: 0;
  }
`

const LottieWrapper = styled.div`
  height: 180px;
  overflow: hidden;
`
const CoachMarkCdWrapper = styled.div`
  position: relative;
  display: inline-block;
  padding-top: 40px;
`

const CdText = styled.p`
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body1-normal']};
  text-align: right;
  position: absolute;

  top: -4%;
  right: 0;
  margin-bottom: 12px;

  white-space: nowrap;
`
