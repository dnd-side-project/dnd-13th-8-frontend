import type {
  CategoryPlaylistItem,
  CategoryPlaylistParams,
  SearchParams,
  SearchPlaylistResponse,
} from '@/features/search/types/search'
import { api } from '@/shared/api/httpClient'

export const getSearchResult = (params: SearchParams) => {
  return api.get<SearchPlaylistResponse>('/main/playlist/search/title', { params })
}

export const getCategoryPlaylist = (params: CategoryPlaylistParams) => {
  return api.get<CategoryPlaylistItem[]>('/main/playlist/search/genre', { params })
}
