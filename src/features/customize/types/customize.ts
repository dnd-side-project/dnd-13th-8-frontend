import type { CdCoverInfo } from '@/entities/playlist/types/playlist'
import type { MusicGenreId } from '@/shared/config/musicGenres'

// ========== [ 공통 도메인 타입 ] ==========
export type CUSTOMIZE_STEP = 1 | 2 | 3

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

// ========== [ API 관련 타입 ] ==========
export interface YoutubeVideoInfo {
  link: string
  title: string
  thumbnailUrl: string
  duration: string
  orderIndex: number
}

export type CdSavePayload = {
  savePlaylistRequest: {
    name: string
    genre: MusicGenreId
    isPublic: boolean
    youTubeVideoInfo: YoutubeVideoInfo[]
  }
  saveCdRequest: CdCoverInfo
}

export type CdCustomResponse = CdCoverInfo & { playlistId: number }

export type CdFinalSaveResponse = {
  playlistId: number
  songs: {
    id: number
    playlistId: number
    youtubeUrl: string
    youtubeTitle: string
    youtubeThumbnail: string
    youtubeLength: number
    orderIndex: number
  }[]
}

export interface UserEachStickerResponse {
  propId: number
  theme: StickerThemeUpperType
  imageUrl: string
}

export interface UserStickerListResponse {
  props: UserEachStickerResponse[]
}

export interface UserStickerPayload {
  theme: StickerThemeUpperType
  file: File
}
