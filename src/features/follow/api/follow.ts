import type { FollowStatusResponse } from '@/features/follow/types/follow'
import { api } from '@/shared/api/httpClient'

export const postFollow = (userId: string) => {
  return api.post(`/main/follow/${userId}`)
}

export const deleteFollow = (userId: string) => {
  return api.delete(`/main/follow/${userId}`)
}

export const getFollowStatus = (userId: string) => {
  return api.get<FollowStatusResponse>(`/main/follow/${userId}`)
}
