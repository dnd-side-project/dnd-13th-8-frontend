export interface SearchParams {
  query: string
  sort?: 'RECENT' | 'POPULAR'
  limit?: number
  page?: number
}

export interface CategoryPlaylistParams {
  genre:
    | 'STUDY'
    | 'SLEEP'
    | 'RELAX'
    | 'WORKOUT'
    | 'DRIVE'
    | 'PARTY'
    | 'MOOD'
    | 'ROMANCE'
    | 'KPOP'
    | 'SAD'
  sort?: 'POPULAR' | 'RECENT'
  limit?: number
  cursorId?: number
}

export interface PopularKeywordParams {
  range: 'today' | '7d' | '30d'
  limit?: number
}

export interface Track {
  id: number
  title: string
  youtubeUrl: string
  youtubeThumbnail: string
  youtubeLength: string
}

export interface Playlist {
  playlistId: number
  playlistName: string
  creatorId: string
  creatorNickname: string
  tracks: Track[]
  type: 'USER' | 'PLAYLIST'
}

export type SearchPlaylistResponse = {
  content: {
    results: Playlist[]
  }
  page: number
  size: number
  hasNext: boolean
}

export interface CategoryPlaylistItem {
  content: Playlist[]
  hasNext: boolean
  page: number
  size: number
  nextCursor: string | null
}

export interface PopularKeywordItem {
  term: string
  score: number
}

export interface PopularKeywordResponse {
  range: string
  limit: number
  keywords: PopularKeywordItem[]
}
