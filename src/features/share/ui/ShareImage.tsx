import styled from 'styled-components'

import { WaterMark } from '@/assets/icons'
import { Cd } from '@/shared/ui'

const ShareImage = () => {
  return (
    <ImagePreview>
      <CenteredCd>
        <Cd variant="share" bgColor="none" />
      </CenteredCd>
      <WaterMarkWrapper>
        <WaterMark />
      </WaterMarkWrapper>
    </ImagePreview>
  )
}

export default ShareImage

const ImagePreview = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
  position: relative;
`

const CenteredCd = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const WaterMarkWrapper = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`
