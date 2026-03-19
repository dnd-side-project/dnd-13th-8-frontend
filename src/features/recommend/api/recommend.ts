import {
  type RecommendedGenresResponse,
  type RecommendationsResponse,
  type RecommendUserResponse,
  type TimeRecommendationResponse,
} from '@/features/recommend/types/recommend'
import { api } from '@/shared/api/httpClient'
import type { TimeSlot } from '@/shared/types'

export const getRecommendationsByRecent = () => {
  return api.get<RecommendationsResponse>('/main/recommendation/playlist')
}

export const getRecommendationsByFollow = () => {
  return api.get<RecommendationsResponse>('/main/recommendation/follow')
}

export const getRecommendedGenres = () => {
  return api.get<RecommendedGenresResponse>('/main/recommendation/genres')
}

export const getAdminRecommendList = (limit: number) => {
  return api.get<RecommendationsResponse>('/main/recommendation/admin', {
    params: { limit },
  })
}

export const getWeeklyRecommendList = (limit: number) => {
  return api.get<RecommendationsResponse>('/main/recommendation/weekly', {
    params: { limit },
  })
}

export const getPopularUserList = (limit: number) => {
  return api.get<RecommendUserResponse>('/main/recommendation/users', {
    params: { limit },
  })
}

export const getPlaylistByTime = (timeSlot: TimeSlot) => {
  return api.get<TimeRecommendationResponse>('/main/recommendation/time', {
    params: { timeSlot },
  })
}
