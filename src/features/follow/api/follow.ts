import { api } from '@/shared/api/httpClient'

export const postFollow = (playlistId: number) => {
  return api.post(`/main/follow/${playlistId}`)
}

export const deleteFollow = (playlistId: number) => {
  return api.delete(`/main/follow/${playlistId}`)
}

export const getFollowStatus = (playlistId: number) => {
  return api.get(`/main/follow/${playlistId}`)
}
