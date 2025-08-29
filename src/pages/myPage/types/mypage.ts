export type StickerThemeType =
  | 'deulak'
  | 'background'
  | 'vintage'
  | 'handdrawn'
  | 'people&animals'
  | 'neonObject'
  | 'transport'
  | '3d'
  | 'metal'
  | 'user'

export type StickerThemeUpperType = Uppercase<StickerThemeType>

export interface StickerInfoType {
  id: string
  type: string
  propId: number | undefined
  src: string
  x: number
  y: number
  z: number
  width: number
  height: number
  scale: number
  rotation: number
}

export type MyPageTabType = 'cd' | 'following'

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
