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
}

export interface PlaylistInfo extends PlaylistDetail {
  cardId: number
  position: number
  shareUrl: string
  totalTime: string
  creator: Creator
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
