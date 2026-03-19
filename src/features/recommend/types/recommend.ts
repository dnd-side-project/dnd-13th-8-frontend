import type { BundleInfo, Playlist } from '@/entities/playlist'
import type { ProfileResponse } from '@/entities/user'

export type RecommendationsResponse = Playlist[]

export interface GenreInfo {
  code: string
  displayName: string
}

export type RecommendedGenresResponse = GenreInfo[]

export type RecommendUserResponse = ProfileResponse[]

export type TimeRecommendationResponse = BundleInfo[]
