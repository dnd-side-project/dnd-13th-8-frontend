export interface CdBasicInfo {
  playlistId: number
  playlistName: string
  creatorNickname?: string
  genre: string
  isPublic: boolean
}

export interface CdCustomData {
  cdItemId?: number
  propId: number
  theme?: string
  xCoordinate: number
  yCoordinate: number
  zCoordinate: number
  height: number
  width: number
  scale: number
  angle: number
  imageUrl?: string
}

export interface CdCoverInfo {
  cdItems: CdCustomData[]
}

export type CdMetaResponse = (CdBasicInfo & OnlyCdResponse)[]

export interface OnlyCdResponse {
  cdResponse: {
    cdItems: CdCustomData[]
  }
}

export interface Track {
  id: number
  title: string
  youtubeUrl: string
  youtubeThumbnail: string
  youtubeLength: number
  orderIndex: number
}

export interface Creator {
  creatorId: string
  creatorNickname: string
  creatorShareCode?: string
  creatorProfileImageUrl?: string
}

export interface PlaylistDetail extends OnlyCdResponse, Creator {
  playlistId: number
  playlistName: string
  isPublic: boolean
  songs: Track[]
  genre: string
}

// 커서 정보
export interface Cursor {
  position: number
  cardId: number
}

export interface PlaylistResponse {
  content: number[] // playlistId 배열
  nextCursor: number | null
  size: number
  hasNext: boolean
}

export interface PlaylistParams {
  cursorId?: number
  size?: number
}
