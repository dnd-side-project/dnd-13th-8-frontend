import type { StickerThemeType, StickerThemeUpperType } from '@/features/customize/types/customize'

export const THEME_PROP_ID_OFFSET = {
  deulak: 1000,
  background: 1100,
  handdrawn: 1200,
  vintage: 1300,
  neonObject: 1400,
  'people&animals': 1500,
  '3d': 1600,
  transport: 1700,
  metal: 1800,
} as const

// 유저가 업로드한 커스텀 스티커는 'user' 테마로 별도 관리
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

export const BACKEND_TO_FRONT_THEME: Record<StickerThemeUpperType, StickerThemeType> = {
  DEULAK: 'deulak',
  BACKGROUND: 'background',
  VINTAGE: 'vintage',
  HANDDRAWN: 'handdrawn',
  'PEOPLE&ANIMALS': 'people&animals',
  NEONOBJECT: 'neonObject',
  TRANSPORT: 'transport',
  '3D': '3d',
  METAL: 'metal',
  USER: 'user',
}
