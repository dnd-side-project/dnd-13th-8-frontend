import styled from 'styled-components'

import { WaterMark } from '@/assets/icons'
import { Cd } from '@/shared/ui'

const ShareImage = () => {
  return (
    <ImagePreview>
      <Cd variant="share" bgColor="none" />
      <WaterMarkWrapper>
        <WaterMark />
      </WaterMarkWrapper>
    </ImagePreview>
  )
}

export default ShareImage

const ImagePreview = styled.div`
  display: grid;
  place-items: center;
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
  position: relative;
  overflow: hidden;
`

const WaterMarkWrapper = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`
