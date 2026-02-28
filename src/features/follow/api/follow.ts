import type {
  FollowListResponse,
  FollowSortType,
  FollowStatusResponse,
} from '@/features/follow/types/follow'
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

export const getFollowingList = (userId: string, sort?: FollowSortType) => {
  return api.get<FollowListResponse>(`/main/follow/following/${userId}`, {
    params: { sort: sort }, // Default: LATEST
  })
}

export const getFollowerList = (userId: string, sort?: FollowSortType) => {
  return api.get<FollowListResponse>(`/main/follow/follower/${userId}`, {
    params: { sort: sort }, // Default: LATEST
  })
}
