import type { CdCoverInfo } from '@/entities/playlist/types/playlist'
import type { StickerThemeUpperType } from '@/pages/mypage/types/mypage'
import type { MusicGenreId } from '@/shared/config/musicGenres'

export interface YoutubeVideoInfo {
  link: string
  title: string
  thumbnailUrl: string
  duration: string
  orderIndex: number
}

export type CdTempSavePayload = {
  name: string
  genre: MusicGenreId
  isPublic: boolean
  youTubeVideoInfo: YoutubeVideoInfo[]
}

export type CdFinalCreatePayload = { saveCdRequest: CdCoverInfo }

export type CdFinalUpdatePayload = CdFinalCreatePayload & { playlistId: number }

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
