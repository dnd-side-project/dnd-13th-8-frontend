import {
  type PlaylistDetailResponse,
  type PlaylistParams,
  type PlaylistResponse,
} from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

export const getSufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/browse/playlists', { params })
}

export const getPlaylistDetail = (playlistId: number) => {
  return api.get<PlaylistDetailResponse>(`/main/playlists/${playlistId}`)
}
