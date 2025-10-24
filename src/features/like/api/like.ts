import type { LikeStatusResponse } from '@/features/like/type/like'
import { api } from '@/shared/api/httpClient'

export const postLike = (playlistId: number) => {
  return api.post(`/main/likes/${playlistId}`)
}

export const deleteLike = (playlistId: number) => {
  return api.delete(`/main/likes/${playlistId}`)
}

export const getLikeStatus = (playlistId: number) => {
  return api.get<LikeStatusResponse>(`/main/likes/${playlistId}`)
}
