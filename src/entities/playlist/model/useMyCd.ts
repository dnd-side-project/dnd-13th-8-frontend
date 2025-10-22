import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getMyCdList,
  getLikedCdList,
  getTracklist,
  deleteMyCd,
  patchMyCdPublic,
  getMyRepresentativePlaylist,
} from '@/entities/playlist/api/playlist'

export const useMyCdList = (sort: string) => {
  return useQuery({
    queryKey: ['myCdList', sort],
    queryFn: () => getMyCdList(sort),
    refetchOnMount: 'always',
  })
}

export const useMyLikedCdList = (sort: string) => {
  return useQuery({
    queryKey: ['myLikeList', sort],
    queryFn: () => getLikedCdList(sort),
    refetchOnMount: 'always',
  })
}

export const useMyCdActions = (cdId: number) => {
  const queryClient = useQueryClient()

  // 트랙리스트 조회
  const {
    data: tracklist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getTracklist', cdId],
    queryFn: () => getTracklist(cdId),
    enabled: Number.isInteger(cdId) && cdId >= 0,
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
      queryClient.invalidateQueries({ queryKey: ['playlistDetail', cdId] })
    },
  })

  return {
    tracklist,
    isLoading,
    isError,
    deleteMutation,
    togglePublicMutation,
  }
}

export const useMyRepresentativePlaylist = () => {
  return useQuery({
    queryKey: ['myRepresentativePlaylist'],
    queryFn: () => getMyRepresentativePlaylist(),
  })
}
