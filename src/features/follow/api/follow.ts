import { api } from '@/shared/api/httpClient'

export const postFollow = (playlistId: number) => {
  return api.post(`/main/browse/playlists/${playlistId}/follow`)
}

export const deleteFollow = (playlistId: number) => {
  return api.delete(`/main/browse/playlists/${playlistId}/follow`)
}

export const getFollowStatus = (playlistId: number) => {
  return api.get(`/main/browse/playlists/${playlistId}/follow`)
}
