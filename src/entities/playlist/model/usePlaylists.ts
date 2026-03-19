import { useLocation } from 'react-router-dom'

import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import axios from 'axios'

import {
  getBundlePlaylist,
  getCdCarousel,
  getCdList,
  getLikedCdCarousel,
  getLikedCdList,
  getMyPlaylistDetail,
  getPlaylistDetail,
  getPlaylistViewCounts,
  getShufflePlaylists,
  postPlaylistConfirm,
  postPlaylistStart,
} from '@/entities/playlist/api/playlist'
import type {
  PlaylistDetail,
  PlaylistResponse,
  CdListParams,
  FEED_CD_LIST_TAB_TYPE,
  CarouselParams,
  CarouselDirection,
} from '@/entities/playlist/types/playlist'
import { useAuthStore, type ShareCode } from '@/features/auth'

export const useShufflePlaylists = (size: number = 5) => {
  const { isLogin, accessToken } = useAuthStore()
  const location = useLocation()

  // 로그인 콜백 중인지 확인
  const isLoggingIn = location.pathname === '/login/callback'

  return useInfiniteQuery<
    PlaylistResponse, // queryFn 반환 타입
    Error, // 에러 타입
    InfiniteData<PlaylistResponse, number>, // select 후 데이터 타입
    ['playlists', number], // queryKey 타입
    number | undefined // pageParam 타입
  >({
    queryKey: ['playlists', size],
    queryFn: ({ pageParam }) =>
      getShufflePlaylists({
        cursorId: pageParam,
        size,
      }),
    initialPageParam: undefined, // 첫 호출은 커서 없이 시작
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.nextCursor
      }
      return undefined
    },
    enabled:
      !isLoggingIn && (isLogin ? !!accessToken : !!sessionStorage.getItem('anonymous_token')),
  })
}

export const usePlaylistDetail = (playlistId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['playlistDetail', playlistId],
    queryFn: () => getPlaylistDetail(playlistId as number),
    enabled: options?.enabled ?? !!playlistId,
  })
}

export const useMyPlaylistDetail = (playlistId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['myPlaylistDetail', playlistId],
    queryFn: () => getMyPlaylistDetail(playlistId as number),
    enabled: options?.enabled ?? !!playlistId,
  })
}

export const usePlaylistStartMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (playlistId: number) => postPlaylistStart(playlistId),
    onSuccess: (_, playlistId) => {
      queryClient.invalidateQueries({ queryKey: ['playlistViewCounts', playlistId] })
    },
  })
}

export const usePlaylistConfirmMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (playlistId: number) => postPlaylistConfirm(playlistId),
    onSuccess: (_, playlistId) => {
      queryClient.invalidateQueries({ queryKey: ['playlistViewCounts', playlistId] })
    },
  })
}

export const usePlaylistViewCounts = (playlistId: number) => {
  return useQuery({
    queryKey: ['playlistViewCounts', playlistId],
    queryFn: () => getPlaylistViewCounts(playlistId),
  })
}

export const usePlaylistDetails = (ids: number[]) => {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['playlistDetail', id],
      queryFn: () => getPlaylistDetail(id),
      enabled: ids.length > 0,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)
  const data = results.reduce<PlaylistDetail[]>((acc, q) => {
    if (q.data) acc.push(q.data)
    return acc
  }, [])

  return { data, isLoading, isError }
}

export const useFeedCdList = ({
  shareCode,
  feedView,
  params,
}: {
  shareCode: ShareCode
  feedView: FEED_CD_LIST_TAB_TYPE
  params: Omit<CdListParams, 'cursor'>
}) => {
  return useInfiniteQuery({
    queryKey: ['feedCdList', shareCode, feedView, params.sort],
    queryFn: ({ pageParam }) => {
      const fetchParams = {
        ...params,
        cursor: pageParam as string,
      }
      return feedView === 'cds' ? getCdList(fetchParams) : getLikedCdList(fetchParams)
    },
    initialPageParam: '', // 초기 cursor 값
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled: !!shareCode,
  })
}

type PageParam = { cursor: number; direction: CarouselDirection } | undefined

export const useCarouselCdList = (
  type: FEED_CD_LIST_TAB_TYPE, // cds or likes
  shareCode: string,
  params: CarouselParams
) => {
  return useInfiniteQuery({
    queryKey: ['feedCdList', type, shareCode, params.sort],

    queryFn: ({ pageParam }: { pageParam: PageParam }) => {
      const fetchFn = type === 'cds' ? getCdCarousel : getLikedCdCarousel

      return fetchFn(shareCode, {
        ...params,
        // pageParam이 존재하면 anchorId를 undefined로 덮어씌워서 없앰
        anchorId: pageParam ? undefined : params.anchorId,
        cursor: pageParam?.cursor,
        direction: pageParam?.direction,
      })
    },

    retry: (_, error) => {
      // 404면 재시도 X
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false
      }

      return true // 아니면 디폴트 값인 3번까지 재시도
    },

    initialPageParam: undefined as PageParam,

    getNextPageParam: (lastPage): PageParam => {
      if (!lastPage.hasNext || lastPage.nextCursor === null) return undefined
      return { cursor: lastPage.nextCursor, direction: 'NEXT' }
    },

    getPreviousPageParam: (firstPage): PageParam => {
      if (!firstPage.hasPrev || firstPage.prevCursor === null) return undefined
      return { cursor: firstPage.prevCursor, direction: 'PREV' }
    },

    enabled: !!shareCode,
  })
}

export const useBundlePlaylist = (bundleId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: () => getBundlePlaylist(bundleId),
    enabled: options?.enabled ?? !!bundleId,
  })
}
