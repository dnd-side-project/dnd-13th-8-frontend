import styled from 'styled-components'

import { WaterMark } from '@/assets/icons'

interface ShareImageProps {
  children: React.ReactNode
}

const ShareImage = ({ children }: ShareImageProps) => {
  return (
    <ImagePreview>
      {children}
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
