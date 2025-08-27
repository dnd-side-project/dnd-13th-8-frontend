export interface SearchParams {
  query: string
  sort?: 'RECENT' | 'POPULAR'
  limit?: number
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
  userId: string
  username: string
  tracks: Track[]
  type: 'USER' | 'PLAYLIST'
}

export type SearchPlaylistResponse = {
  results: Playlist[]
}

export interface CategoryPlaylistItem {
  playlistId: number
  playlistName: string
  creatorId: string
  creatorNickname: string
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
