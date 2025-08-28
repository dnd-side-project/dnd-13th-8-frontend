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

export interface PlaylistInfo {
  cardId: number
  position: number
  playlistId: number
  playlistName: string
  genre: string
  creator: Creator
  songs: Track[]
  representative: boolean
  shareUrl: string
  // TODO : 추후 cdItem 추가 필요
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
