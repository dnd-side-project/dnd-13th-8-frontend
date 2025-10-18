import { useRef, useState, useEffect } from 'react'

import styled from 'styled-components'

import { EyeSlash } from '@/assets/icons'
import overlayUrl from '@/assets/icons/icn_overlay.svg?url'
import type { CdCustomData } from '@/entities/playlist/types/playlist'
import { THEME_IMAGES_MAP } from '@/pages/mypage/lib/customizeTheme'
import { THEME_PROP_ID_OFFSET } from '@/pages/mypage/types/mypage'
import { flexRowCenter, flexColCenter } from '@/shared/styles/mixins'

interface CdProps {
  variant:
    | 'xxl'
    | 'xl'
    | 'lg'
    | 'md'
    | 'sm'
    | 'xs'
    | 'share'
    | 'customize'
    | 'carousel'
    | 'responsive'
  bgColor?: 'none' | 'default' | 'dark'
  stickers?: CdCustomData[]
  isPublic?: boolean
}

const Cd = ({ variant, bgColor = 'default', stickers, isPublic = true }: CdProps) => {
  const baseRef = useRef<HTMLDivElement>(null)
  const [dynamicBase, setDynamicBase] = useState(0)

  const baseSize = variant === 'responsive' ? dynamicBase : sizeMap[variant].base
  const ratio = baseSize / 275

  // 스티커 이미지 경로 가져오기
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

  // 반응형일 때 cd 크기 동적 계산
  useEffect(() => {
    if (variant === 'responsive' && baseRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width } = entries[0].contentRect
        setDynamicBase(width)
      })
      resizeObserver.observe(baseRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [variant])

  const Content = (
    <Base ref={variant === 'responsive' ? baseRef : undefined} $variant={variant}>
      {stickers?.map((sticker) => {
        const { cdItemId, xCoordinate, yCoordinate, width, height, scale, angle } = sticker
        const src = getImagePath(sticker)
        if (!src) return null

        return (
          <img
            key={`${cdItemId}-${xCoordinate}-${yCoordinate}`}
            src={src}
            alt="cd-sticker"
            // crossOrigin="anonymous"
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
      <Overlay />
      {!isPublic && (
        <PrivateCover>
          <EyeSlash width={16} height={16} />
          <span>비공개된 CD</span>
        </PrivateCover>
      )}
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
  responsive: { borderRadius: 10 },
} as const

interface StyleProps {
  $variant: keyof typeof sizeMap
}

interface ContainerProps extends StyleProps {
  $bgColor?: 'default' | 'dark'
}

const Container = styled.div<ContainerProps>`
  width: ${({ $variant }) =>
    $variant === 'responsive' ? '100%' : `${sizeMap[$variant].container}px`};
  aspect-ratio: 1 / 1;
  border-radius: ${({ $variant }) => sizeMap[$variant].borderRadius}px;
  background-color: ${({ $bgColor, theme }) =>
    $bgColor === 'dark' ? theme.COLOR['gray-800'] : theme.COLOR['gray-600']};
  ${flexRowCenter}
`

const Base = styled.div<StyleProps>`
  position: relative;
  width: ${({ $variant }) => ($variant === 'responsive' ? '82%' : `${sizeMap[$variant].base}px`)};
  aspect-ratio: 1 / 1;
  border-radius: 100%;
  background: ${({ theme }) => theme.GRADIENT.hologram};
  overflow: hidden;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: url(${overlayUrl}) no-repeat center/cover;
  mix-blend-mode: multiply;
  pointer-events: none;
`

const PrivateCover = styled.div`
  position: relative;
  ${flexColCenter}
  gap: 3px;
  width: 100%;
  height: 100%;
  background-color: rgba(42, 47, 57, 0.7);

  & > span {
    ${({ theme }) => theme.FONT['caption2']}
  }
`
