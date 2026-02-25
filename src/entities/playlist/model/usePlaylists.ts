import { useLocation } from 'react-router-dom'

import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'

import {
  getMyPlaylistDetail,
  getPlaylistDetail,
  getPlaylistViewCounts,
  getShufflePlaylists,
  postPlaylistConfirm,
  postPlaylistStart,
} from '@/entities/playlist/api/playlist'
import type { PlaylistDetail, PlaylistResponse } from '@/entities/playlist/types/playlist'
import { useAuthStore } from '@/features/auth'

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
