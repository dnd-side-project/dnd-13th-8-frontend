import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  getCategoryPlaylist,
  getPopularKeyword,
  getSearchResult,
} from '@/features/search/api/search'
import type {
  CategoryPlaylistParams,
  PopularKeywordParams,
  SearchParams,
} from '@/features/search/types/search'

export const useSearchPlaylist = (params: SearchParams, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['searchPlaylist', params],
    queryFn: ({ pageParam = 0 }) => getSearchResult({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.page + 1
      }
      return undefined
    },

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

export const usePopularKeyword = (params: PopularKeywordParams) => {
  return useQuery({
    queryKey: ['popularKeywords', params],
    queryFn: () => getPopularKeyword(params),
  })
}
