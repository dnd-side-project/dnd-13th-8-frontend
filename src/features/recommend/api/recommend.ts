import {
  type RecommendedGenresResponse,
  type RecommendationsResponse,
} from '@/features/recommend/types/recommend'
import { api } from '@/shared/api/httpClient'

export const getRecommendationsByRecent = () => {
  return api.get<RecommendationsResponse>('/main/playlists/recommendations/playlist')
}

export const getRecommendationsByFollow = () => {
  return api.get<RecommendationsResponse>('/main/playlists/recommendations/follow')
}

export const getRecommendedGenres = () => {
  return api.get<RecommendedGenresResponse>('/main/playlists/recommendations/genres')
}
