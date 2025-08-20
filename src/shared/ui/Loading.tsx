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
  const deviceType = useDevice()

  const maxWidth = deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '375px'

  return (
    <Overlay isOpen={isLoading} onClose={() => {}} childrenAlign="center">
      <LoadingContainer $width={width} $maxWidth={maxWidth} $height={height}>
        <Lottie animationData={LoadingLottie} loop autoplay />
      </LoadingContainer>
    </Overlay>
  )
}

export default Loading

const LoadingContainer = styled.div<{
  $width?: string
  $maxWidth?: string
  $height?: string
}>`
  ${flexRowCenter}
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: ${({ $height }) => $height};
  min-height: 100px;
`
