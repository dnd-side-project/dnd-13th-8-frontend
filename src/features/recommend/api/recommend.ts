import type { RecommendationsResponse } from '@/features/recommend/types/recommend'
import { api } from '@/shared/api/httpClient'

export const getRecommendationsbyRecent = () => {
  return api.get<RecommendationsResponse>('/main/playlists/recommendations/playlist')
}

export const getRecommendationsbyFollow = () => {
  return api.get<RecommendationsResponse>('/main/playlists/recommendations/follow')
}

export const getRecommendationsByGenre = () => {
  return api.get('/main/playlists/recommendations/genres')
}
