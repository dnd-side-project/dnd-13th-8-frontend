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

export interface PlaylistDetailResponse {
  playlistId: number
  playlistName: string
  genre: string
  creator?: Creator
  songs: Track[]
  representative: boolean
}

export interface PlaylistInfo extends PlaylistDetailResponse {
  cardId: number
  position: number
  shareUrl: string
  totalTime: string
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
