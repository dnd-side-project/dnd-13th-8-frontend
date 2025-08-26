import type { StickerThemeType } from '@/pages/myPage/types/mypage'

export const STICKER_THEME_LIST: { id: StickerThemeType; name: string }[] = [
  { id: 'deulak', name: '들락' },
  { id: 'background', name: '배경' },
  { id: 'vintage', name: '빈티지' },
  { id: 'handdrawn', name: '손그림' },
  { id: 'people&animals', name: '사람&동물' },
  { id: 'neonObject', name: '네온 오브젝트' },
  { id: 'transport', name: '이동수단' },
  { id: '3d', name: '3D' },
  { id: 'metal', name: '메탈' },
]

export const getCurrentThemeImages = (currentThemeId: StickerThemeType) => {
  const themeImages = {
    deulak: import.meta.glob('@/assets/customize/deulak/*.png', { eager: true }),
    background: import.meta.glob('@/assets/customize/background/*.png', { eager: true }),
    vintage: import.meta.glob('@/assets/customize/vintage/*.png', { eager: true }),
    handdrawn: import.meta.glob('@/assets/customize/handdrawn/*.png', { eager: true }),
    'people&animals': import.meta.glob('@/assets/customize/people&animals/*.png', { eager: true }),
    neonObject: import.meta.glob('@/assets/customize/neonObject/*.png', { eager: true }),
    transport: import.meta.glob('@/assets/customize/transport/*.png', { eager: true }),
    '3d': import.meta.glob('@/assets/customize/3d/*.png', { eager: true }),
    metal: import.meta.glob('@/assets/customize/metal/*.png', { eager: true }),
  }

  return themeImages[currentThemeId] || themeImages.deulak
}
