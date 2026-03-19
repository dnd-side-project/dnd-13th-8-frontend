import { useQuery } from '@tanstack/react-query'

import {
  getRecommendationsByRecent,
  getRecommendedGenres,
  getRecommendationsByFollow,
  getAdminRecommendList,
  getWeeklyRecommendList,
  getPopularUserList,
  getPlaylistByTime,
} from '@/features/recommend/api/recommend'
import type { TimeSlot } from '@/shared/types'

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

export const useUserRecommendation = (limit: number) => {
  return useQuery({
    queryKey: ['recommendations', 'user', limit],
    queryFn: () => getPopularUserList(limit),
  })
}

export const useTimeRecommendation = (timeSlot: TimeSlot) => {
  return useQuery({
    queryKey: ['recommendations', 'time', timeSlot],
    queryFn: () => getPlaylistByTime(timeSlot),
    enabled: !!timeSlot,
  })
}
