import type { CdCustomData } from '@/entities/playlist'

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

export interface UserSearchResult {
  type: 'USER'
  userId: string
  shareCode: string
  nickname: string
  profileUrl: string | null
}

export interface PlaylistSearchResult {
  type: 'PLAYLIST'
  playlistId: number
  playlistName: string
  creatorId: string
  creatorNickname: string
  cdResponse?: {
    cdItems: CdCustomData[]
  }
}

export type SearchResultItem = UserSearchResult | PlaylistSearchResult

export type SearchPlaylistResponse = {
  content: {
    results: SearchResultItem[]
  }
  page: number
  size: number
  hasNext: boolean
  totalCount: number
}

export interface CategoryPlaylistItem {
  content: PlaylistSearchResult[]
  hasNext: boolean
  page: number
  size: number
  nextCursor: string | null
  totalCount: number
}

export interface PopularKeywordItem {
  term: string
  score: number
}

export interface PopularKeywordResponse {
  range: PopularKeywordParams['range']
  limit: number
  keywords: PopularKeywordItem[]
}
