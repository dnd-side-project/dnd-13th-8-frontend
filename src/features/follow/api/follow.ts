import type {
  FollowListResponse,
  FollowParams,
  FollowStatusResponse,
} from '@/features/follow/types/follow'
import { api } from '@/shared/api/httpClient'

export const postFollow = (shareCode: string) => {
  return api.post(`/main/follow/${shareCode}`)
}

export const deleteFollow = (shareCode: string) => {
  return api.delete(`/main/follow/${shareCode}`)
}

export const getFollowStatus = (shareCode: string) => {
  return api.get<FollowStatusResponse>(`/main/follow/${shareCode}`)
}

export const getFollowingList = (shareCode: string, params?: FollowParams) => {
  return api.get<FollowListResponse>(`/main/follow/following/${shareCode}`, {
    params,
  })
}

export const getFollowerList = (shareCode: string, params?: FollowParams) => {
  return api.get<FollowListResponse>(`/main/follow/follower/${shareCode}`, {
    params,
  })
}
