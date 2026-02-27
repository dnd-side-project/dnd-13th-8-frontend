import Lottie from 'lottie-react'
import styled from 'styled-components'

import { LoadingLottie } from '@/assets/lottie'
import { useDevice } from '@/shared/lib/useDevice'
import { flexRowCenter } from '@/shared/styles/mixins'
import Overlay from '@/shared/ui/Overlay'

interface LoadingProps {
  isLoading: boolean
  width?: string
  height?: string
}

const Loading = ({ isLoading, width = '210px', height = 'auto' }: LoadingProps) => {
  const { layoutWidth } = useDevice()
  return (
    <Overlay isOpen={isLoading} onClose={() => {}} childrenAlign="center">
      <LoadingContainer $width={width} $layoutWidth={layoutWidth} $height={height}>
        <Lottie animationData={LoadingLottie} loop autoplay />
      </LoadingContainer>
    </Overlay>
  )
}

export default Loading

const LoadingContainer = styled.div<{
  $width?: string
  $layoutWidth?: string
  $height?: string
}>`
  ${flexRowCenter}
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $layoutWidth }) => $layoutWidth};
  height: ${({ $height }) => $height};
  min-height: 100px;
`
