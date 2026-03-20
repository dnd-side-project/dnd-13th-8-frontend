import { BACKEND_TO_FRONT_THEME } from '@/features/customize/constants/customize'
import type { StickerThemeType, StickerThemeUpperType } from '@/features/customize/types/customize'

export const THEME_IMAGES_MAP = {
  deulak: import.meta.glob('@/assets/customize/deulak/*.png', { eager: true }),
  background: import.meta.glob('@/assets/customize/background/*.png', { eager: true }),
  vintage: import.meta.glob('@/assets/customize/vintage/*.png', { eager: true }),
  handdrawn: import.meta.glob('@/assets/customize/handdrawn/*.png', { eager: true }),
  'people&animals': import.meta.glob('@/assets/customize/people&animals/*.png', { eager: true }),
  neonObject: import.meta.glob('@/assets/customize/neonObject/*.png', { eager: true }),
  transport: import.meta.glob('@/assets/customize/transport/*.png', { eager: true }),
  '3d': import.meta.glob('@/assets/customize/3d/*.png', { eager: true }),
  metal: import.meta.glob('@/assets/customize/metal/*.png', { eager: true }),
} as const

export const getCurrentThemeImages = (currentThemeId: StickerThemeType | StickerThemeUpperType) => {
  // 백엔드 대문자 테마 → 프론트 소문자 테마 변환
  const normalized =
    BACKEND_TO_FRONT_THEME[currentThemeId as StickerThemeUpperType] ??
    (currentThemeId as StickerThemeType)

  // user는 커스텀 스티커이므로 빈 객체 리턴
  if (normalized === 'user') {
    return {}
  }

  return THEME_IMAGES_MAP[normalized as keyof typeof THEME_IMAGES_MAP] || THEME_IMAGES_MAP.deulak
}
