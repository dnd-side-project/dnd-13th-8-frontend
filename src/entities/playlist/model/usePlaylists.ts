import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'

import {
  getPlaylistDetail,
  getPlaylistViewCounts,
  getShufflePlaylists,
  postPlaylistConfirm,
  postPlaylistStart,
} from '@/entities/playlist/api/playlist'
import type { Cursor, PlaylistResponse } from '@/entities/playlist/types/playlist'
import { useAuthStore } from '@/features/auth/store/authStore'
import { isDowntimeNow } from '@/shared/lib/isDowntimeNow'

export const useShufflePlaylists = (size: number = 5) => {
  return useInfiniteQuery<
    PlaylistResponse, // queryFn 반환 타입
    Error, // 에러 타입
    InfiniteData<PlaylistResponse, Cursor>, // select 후 데이터 타입
    ['playlists', number], // queryKey 타입
    Cursor | undefined // pageParam 타입
  >({
    queryKey: ['playlists', size],
    queryFn: ({ pageParam }) =>
      getShufflePlaylists({
        cursorPosition: pageParam?.position,
        cursorCardId: pageParam?.cardId,
        size,
      }),
    initialPageParam: undefined, // 첫 호출은 커서 없이 시작
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext && lastPage.nextCursor) {
        return lastPage.nextCursor // Cursor 타입
      }
      return undefined
    },
    enabled:
      (!!useAuthStore.getState().accessToken || !!sessionStorage.getItem('anonymous_token')) &&
      !isDowntimeNow(),
  })
}

export const usePlaylistDetail = (playlistId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['playlistDetail', playlistId],
    queryFn: () => getPlaylistDetail(playlistId as number),
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
