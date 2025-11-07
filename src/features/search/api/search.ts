import type {
  CategoryPlaylistItem,
  CategoryPlaylistParams,
  PopularKeywordParams,
  PopularKeywordResponse,
  SearchParams,
  SearchPlaylistResponse,
} from '@/features/search/types/search'
import { api } from '@/shared/api/httpClient'

export const getSearchResult = (params: SearchParams) => {
  return api.get<SearchPlaylistResponse>('/main/playlist/search/title', { params })
}

export const getCategoryPlaylist = (params: CategoryPlaylistParams) => {
  return api.get<CategoryPlaylistItem>('/main/playlist/search/genre', { params })
}

export const getPopularKeyword = (params: PopularKeywordParams) => {
  return api.get<PopularKeywordResponse>('/main/playlist/search/popular', { params })
}
