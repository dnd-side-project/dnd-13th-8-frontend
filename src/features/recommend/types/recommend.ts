import type { CdCustomData, Track } from '@/entities/playlist'
import type { ProfileResponse } from '@/entities/user'

export interface Playlist {
  playlistId: number
  playlistName: string
  creatorId: string
  creatorNickname: string
  songs: Track[]
  cdResponse?: {
    cdItems: CdCustomData[]
  }
}

export type RecommendationsResponse = Playlist[]

export interface GenreInfo {
  code: string
  displayName: string
}

export type RecommendedGenresResponse = GenreInfo[]

export type RecommendUserResponse = ProfileResponse[]
