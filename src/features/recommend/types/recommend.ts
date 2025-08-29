import type { CdCustomData, Track } from '@/entities/playlist'

export interface Playlist {
  playlistId: number
  playlistName: string
  creatorId: string
  creatorNickname: string
  songs: Track[]

  // TODO : 스티커 정보는 둘 중 하나로 올 수 있음 추후 통일 필요
  onlyCdResponse?: {
    cdItems: CdCustomData[]
  }
  cdItems?: CdCustomData[]
}

export type RecommendationsResponse = Playlist[]

export interface GenreInfo {
  code: string
  displayName: string
}

export type RecommendedGenresResponse = GenreInfo[]
