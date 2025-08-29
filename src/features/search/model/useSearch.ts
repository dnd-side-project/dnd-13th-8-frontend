import { useInfiniteQuery, useQuery, type InfiniteData } from '@tanstack/react-query'

import {
  getCategoryPlaylist,
  getPopularKeyword,
  getSearchResult,
} from '@/features/search/api/search'
import type {
  CategoryPlaylistItem,
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
  return useInfiniteQuery<
    CategoryPlaylistItem,
    Error,
    InfiniteData<CategoryPlaylistItem, string | null>,
    (string | CategoryPlaylistParams)[],
    string | null // pageParam 타입
  >({
    queryKey: ['categoryPlaylist', params],
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const cursorId = pageParam ? Number(pageParam) : undefined
      return getCategoryPlaylist({ ...params, cursorId })
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled,
  })
}

export const usePopularKeyword = (params: PopularKeywordParams) => {
  return useQuery({
    queryKey: ['popularKeywords', params],
    queryFn: () => getPopularKeyword(params),
  })
}
