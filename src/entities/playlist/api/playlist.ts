import {
  type PlaylistDetailResponse,
  type PlaylistParams,
  type PlaylistResponse,
} from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

export const getShufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/browse/playlists', { params })
}

export const getPlaylistDetail = (playlistId: number) => {
  return api.get<PlaylistDetailResponse>(`/main/playlists/${playlistId}`)
}

export const postPlaylistStart = (playlistId: number) => {
  return api.post(`/main/browse/playlists/start`, null, { params: { playlistId } })
}

export const postPlaylistConfirm = (playlistId: number) => {
  return api.post(`/main/browse/playlists/confirm`, null, { params: { playlistId } })
}

export const getPlaylistViewCounts = (playlistId: number) => {
  return api.get(`/main/browse/playlists/view-counts/${playlistId}`)
}
