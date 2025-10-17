import type { MusicGenreId } from '@/shared/config/musicGenres'

export interface MyCdInfo {
  playlistId: number
  playlistName: string
  isPublic: boolean
}

export type MyCdListResponse = (MyCdInfo & OnlyCdResponse)[]

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
  zCoordinate: number
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

export interface OnlyCdResponse {
  cdResponse: {
    cdItems: CdCustomData[]
  }
}

export interface MyPlaylistResponse extends MyCdInfo, OnlyCdResponse {
  songs: Track[]
  genre: MusicGenreId
}

export interface Track {
  id: number
  title: string
  youtubeUrl: string
  youtubeThumbnail: string
  youtubeLength: number
}

export interface Creator {
  creatorId: string
  creatorNickname: string
}

export interface PlaylistDetail {
  playlistId: number
  playlistName: string
  genre: string
  songs: Track[]
  representative: boolean
}

export interface PlaylistDetailResponse extends PlaylistDetail {
  creatorId: string
  creatorNickname: string

  // TODO : 타입 맞춰달라고 수정 요청 해야 함
  onlyCdResponse?: {
    cdItems: CdCustomData[]
  }
}

export interface PlaylistInfo extends PlaylistDetail {
  cardId?: number
  position?: number
  shareUrl?: string
  totalTime?: string
  creator: Creator

  // TODO : 타입 맞춰달라고 수정 요청 해야 함
  onlyCdResponse?: {
    cdItems: CdCustomData[]
  }
  cdItems?: CdCustomData[]
}

// 커서 정보
export interface Cursor {
  position: number
  cardId: number
}

export interface PlaylistResponse {
  content: PlaylistInfo[]
  nextCursor: Cursor | null
  size: number
  hasNext: boolean
}

export interface PlaylistParams {
  cursorPosition?: number
  cursorCardId?: number
  size?: number
}

export interface MyRepresentResponse {
  playlistId: number
  playlistName: string
  isRepresentative: boolean
  songs: Track[]
  genre: MusicGenreId
  onlyCdResponse: {
    cdItems: CdCustomData[]
  }
}
