import type { Track } from '@/entities/playlist'

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
