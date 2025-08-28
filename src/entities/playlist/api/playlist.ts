import type { PlaylistParams, PlaylistResponse } from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

export const getSufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/browse/playlists', { params })
}
