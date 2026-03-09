import { useQuery } from '@tanstack/react-query'

import {
  getRecommendationsByRecent,
  getRecommendedGenres,
  getRecommendationsByFollow,
  getAdminRecommendList,
  getWeeklyRecommendList,
} from '@/features/recommend/api/recommend'

export const useRecommendationsByRecent = () => {
  return useQuery({
    queryKey: ['recommendations', 'recent'],
    queryFn: () => getRecommendationsByRecent(),
  })
}

export const useRecommendationsByFollow = () => {
  return useQuery({
    queryKey: ['recommendations', 'follow'],
    queryFn: () => getRecommendationsByFollow(),
  })
}

export const useRecommendedGenres = () => {
  return useQuery({
    queryKey: ['recommendations', 'genre'],
    queryFn: () => getRecommendedGenres(),
  })
}

export const useAdminRecommendation = (limit: number) => {
  return useQuery({
    queryKey: ['recommendations', 'admin', limit],
    queryFn: () => getAdminRecommendList(limit),
  })
}

export const useWeeklyRecommendation = (limit: number) => {
  return useQuery({
    queryKey: ['recommendations', 'weekly', limit],
    queryFn: () => getWeeklyRecommendList(limit),
  })
}
