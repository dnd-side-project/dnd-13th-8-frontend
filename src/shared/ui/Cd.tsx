import styled from 'styled-components'

import cdBase from '@/assets/images/img_cd_base.png'
import cdOverlay from '@/assets/images/img_cd_overlay_test.png'

interface CdProps {
  variant: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
}

const Cd = ({ variant }: CdProps) => {
  return (
    <Container $variant={variant}>
      <Base />
      {/* icon layer */}
      <Overlay />
    </Container>
  )
}

export default Cd

const sizeMap = {
  xl: 120,
  lg: 108,
  md: 88,
  sm: 72,
  xs: 48,
} as const

interface StyleProps {
  $variant: keyof typeof sizeMap
}

const Container = styled.div<StyleProps>`
  position: relative; /* overlay 기준 */
  width: ${({ $variant }) => sizeMap[$variant]}px;
  height: ${({ $variant }) => sizeMap[$variant]}px;
`

const Base = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-image: url(${cdBase});
  background-size: cover;
  background-position: center;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-image: url(${cdOverlay});
  background-size: cover;
  background-position: center;
`
