import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getMyCdList,
  getLikedCdList,
  getTracklist,
  deleteMyCd,
  patchMyCdPublic,
} from '@/entities/playlist/api/playlist'

export const useMyCdList = (sort: string) => {
  return useQuery({
    queryKey: ['myCdList', sort],
    queryFn: () => getMyCdList(sort),
    staleTime: 0, // 캐시 무효화
    refetchOnWindowFocus: false,
  })
}

export const useMyLikedCdList = (sort: string) => {
  return useQuery({
    queryKey: ['myLikeList', sort],
    queryFn: () => getLikedCdList(sort),
    staleTime: 0, // 캐시 무효화
    refetchOnWindowFocus: false,
  })
}

export const useMyCdActions = (cdId: number, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  // 트랙리스트 조회
  const {
    data: tracklist,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['getTracklist', cdId],
    queryFn: () => getTracklist(cdId),
    enabled: Number.isInteger(cdId) && cdId >= 0 && (options?.enabled ?? true),
    refetchOnMount: 'always',
  })

  // CD 삭제
  const deleteMutation = useMutation({
    mutationKey: ['deleteMyCd', cdId],
    mutationFn: () => deleteMyCd(cdId),
  })

  // CD 공개여부 토글
  const togglePublicMutation = useMutation({
    mutationKey: ['patchMyCdPublic', cdId],
    mutationFn: () => patchMyCdPublic(cdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTracklist', cdId] })
    },
  })

  return {
    tracklist,
    isLoading,
    isFetching,
    isError,
    deleteMutation,
    togglePublicMutation,
  }
}
