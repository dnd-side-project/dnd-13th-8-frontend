import { useQuery } from '@tanstack/react-query'

import {
  getRecommendationsbyRecent,
  getRecommendedGenres,
  getRecommendationsbyFollow,
} from '@/features/recommend/api/recommend'

export const useRecommendationsByRecent = () => {
  return useQuery({
    queryKey: ['recommendations', 'recent'],
    queryFn: () => getRecommendationsbyRecent(),
  })
}

export const useRecommendationsByFollow = () => {
  return useQuery({
    queryKey: ['recommendations', 'follow'],
    queryFn: () => getRecommendationsbyFollow(),
  })
}

export const useRecommendedGenres = () => {
  return useQuery({
    queryKey: ['recommendations', 'genre'],
    queryFn: () => getRecommendedGenres(),
  })
}
