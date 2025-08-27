import { useQuery } from '@tanstack/react-query'

import { getCategoryPlaylist, getSearchResult } from '@/features/search/api/search'
import type { CategoryPlaylistParams, SearchParams } from '@/features/search/types/search'

export const useSearchPlaylist = (params: SearchParams, enabled = true) => {
  return useQuery({
    queryKey: ['searchPlaylist', params],
    queryFn: () => getSearchResult(params),
    enabled,
  })
}

export const useCategoryPlaylist = (params: CategoryPlaylistParams, enabled = true) => {
  return useQuery({
    queryKey: ['categoryPlaylist', params],
    queryFn: () => getCategoryPlaylist(params),
    enabled,
  })
}
