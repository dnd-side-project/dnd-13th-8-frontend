import styled from 'styled-components'

import cdOverlay from '@/assets/images/img_cd_overlay_test.png'
import { flexRowCenter } from '@/shared/styles/mixins'

interface CdProps {
  variant: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  bgColor?: 'none' | 'default' | 'dark'
}

const Cd = ({ variant, bgColor = 'default' }: CdProps) => {
  const Content = (
    <Base $variant={variant}>
      <Overlay />
    </Base>
  )

  if (bgColor === 'none') return Content

  return (
    <Container $variant={variant} $bgColor={bgColor}>
      {Content}
    </Container>
  )
}

export default Cd

const sizeMap = {
  xxl: { container: 280, base: 280, borderRadius: 0 },
  xl: { container: 140, base: 120, borderRadius: 16 },
  lg: { container: 124, base: 108, borderRadius: 14 },
  md: { container: 104, base: 88, borderRadius: 10 },
  sm: { container: 88, base: 72, borderRadius: 10 },
  xs: { container: 56, base: 48, borderRadius: 6 },
} as const

interface StyleProps {
  $variant: keyof typeof sizeMap
}

interface ContainerProps extends StyleProps {
  $bgColor?: 'default' | 'dark'
}

const Container = styled.div<ContainerProps>`
  width: ${({ $variant }) => sizeMap[$variant].container}px;
  height: ${({ $variant }) => sizeMap[$variant].container}px;
  border-radius: ${({ $variant }) => sizeMap[$variant].borderRadius}px;
  background-color: ${({ $bgColor, theme }) =>
    $bgColor === 'dark' ? theme.COLOR['gray-800'] : theme.COLOR['gray-600']};
  ${flexRowCenter}
`

const Base = styled.div<StyleProps>`
  position: relative;
  width: ${({ $variant }) => sizeMap[$variant].base}px;
  height: ${({ $variant }) => sizeMap[$variant].base}px;
  border-radius: 100%;
  background: ${({ theme }) => theme.GRADIENT.hologram};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;

  border-radius: 100%;
  background-image: url(${cdOverlay});
  background-size: cover;
  background-position: center;
  z-index: 2;
`
