import type { StickerThemeUpperType } from '@/pages/mypage/types/mypage'
import type { MusicGenreId } from '@/shared/config/musicGenres'

export interface YoutubeVideoInfo {
  link: string
  title: string
  thumbnailUrl: string
  duration: string
  orderIndex: number
}

export type TempSavePayload = {
  name: string
  genre: MusicGenreId
  isPublic: boolean
  youTubeVideoInfo: YoutubeVideoInfo[]
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

export interface CdItem {
  propId: number
  xCoordinate: number
  yCoordinate: number
  height: number
  width: number
  scale: number
  angle: number
}

export interface SaveCdRequestDto {
  cdItems: CdItem[]
}

export interface FinalPlaylistPayload {
  saveCdRequestDto: SaveCdRequestDto
}

export interface EditPlaylistPayload extends FinalPlaylistPayload {
  playlistId: number
  saveCdRequestDto: SaveCdRequestDto
}

export interface SongItem {
  id: number
  playlistId: number
  youtubeUrl: string
  youtubeTitle: string
  youtubeThumbnail: string
  youtubeLength: number
}

export interface FinalPlaylistResponse {
  playlistId: number
  songs: SongItem[]
}
