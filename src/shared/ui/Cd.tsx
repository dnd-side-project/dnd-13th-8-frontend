import styled from 'styled-components'

import { Overlay } from '@/assets/icons'
import type { CdCustomData } from '@/entities/playlist/types/playlist'
import { THEME_IMAGES_MAP } from '@/pages/myPage/lib/customizeTheme'
import { THEME_PROP_ID_OFFSET } from '@/pages/myPage/types/mypage'
import { flexRowCenter } from '@/shared/styles/mixins'

interface CdProps {
  variant: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'share' | 'customize' | 'carousel'
  bgColor?: 'none' | 'default' | 'dark'
  stickers?: CdCustomData[]
}

const Cd = ({ variant, bgColor = 'default', stickers }: CdProps) => {
  const getImagePath = (info: CdCustomData) => {
    const { imageUrl, theme, propId } = info
    if (imageUrl !== 'DEFAULT') return imageUrl

    const convertThemeName =
      theme === 'NEONOBJECT'
        ? 'neonObject'
        : theme === 'PEOPLE&ANIMALS'
          ? 'people&animals'
          : theme.toLowerCase()

    const images = THEME_IMAGES_MAP[convertThemeName as keyof typeof THEME_IMAGES_MAP]
    if (!images) {
      console.warn('Unknown theme:', theme)
      return ''
    }

    const offset = THEME_PROP_ID_OFFSET[convertThemeName as keyof typeof THEME_PROP_ID_OFFSET]
    const localIndex = propId - offset
    const fileName = localIndex.toString().padStart(2, '0') + '.png'

    const key = Object.keys(images).find((k) => k.endsWith('/' + fileName))
    if (!key) {
      console.warn(`Image not found for theme=${convertThemeName}, propId=${propId}`)
      return ''
    }

    const mod = images[key]
    return typeof mod === 'string' ? mod : (mod as { default: string }).default
  }

  const baseSize = sizeMap[variant].base
  const ratio = baseSize / 280

  const Content = (
    <Base $variant={variant}>
      {stickers?.map((sticker) => {
        const { cdItemId, xCoordinate, yCoordinate, width, height, scale, angle } = sticker
        const src = getImagePath(sticker)
        if (!src) return null

        return (
          <img
            key={`${cdItemId}-${xCoordinate}-${yCoordinate}`}
            src={src}
            alt="cd-sticker"
            style={{
              position: 'absolute',
              left: xCoordinate * ratio,
              top: yCoordinate * ratio,
              width: width * ratio,
              height: height * ratio,
              transform: `scale(${scale}) rotate(${angle}rad)`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          />
        )
      })}
      <StyledOverlay width="100%" height="100%" />
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
  share: { container: 280, base: 220, borderRadius: 24 },
  customize: { container: 220, base: 220, borderRadius: 0 },
  carousel: { container: 180, base: 180, borderRadius: 0 },
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
  overflow: hidden;
`

const StyledOverlay = styled(Overlay)`
  position: absolute;
  top: 0;
  left: 0;
`
