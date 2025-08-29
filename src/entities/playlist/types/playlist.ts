import type { Track } from '@/entities/playlist'
import type { MusicGenreId } from '@/shared/config/musicGenres'

export interface MyCdInfo {
  playlistId: number
  playlistName: string
  isRepresentative: boolean
}

export type MyCdListResponse = MyCdInfo[]

export interface MyFollowingInfo {
  creatorId: string
  creatorPlaylistId: string
  creatorNickname: string
  creatorProfileImageUrl: string | null
}

export interface MyFollowingListResponse {
  size: number
  followPlaylistDto: MyFollowingInfo[]
}

export interface CdCustomData {
  cdItemId: number
  propId: number
  theme: string
  xCoordinate: number
  yCoordinate: number
  height: number
  width: number
  scale: number
  angle: number
  imageUrl: string
}
export interface CdCustomDataResponse {
  playlistId: number
  cdItems: CdCustomData[]
}

export interface MyPlaylistResponse extends MyCdInfo {
  songs: Track[]
  genre: MusicGenreId
  onlyCdResponse: {
    cdItems: CdCustomData[]
  }
}
