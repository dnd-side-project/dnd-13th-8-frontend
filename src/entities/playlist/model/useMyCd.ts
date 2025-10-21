import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getMyCdList,
  getLikedCdList,
  getTracklist,
  deleteMyPagePlaylist,
  setPrimaryPlaylist,
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
    mutationKey: ['deleteMyPagePlaylist', cdId],
    mutationFn: () => deleteMyPagePlaylist(cdId),
  })

  // 대표 플리 지정
  const setPrimaryMutation = useMutation({
    mutationKey: ['setPrimaryPlaylist', cdId],
    mutationFn: () => setPrimaryPlaylist(cdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPagePlaylist'] })
    },
  })

  return {
    tracklist,
    isLoading,
    isError,
    deletePlaylist: deleteMutation,
    setPrimaryPlaylist: setPrimaryMutation,
  }
}

export const useMyRepresentativePlaylist = () => {
  return useQuery({
    queryKey: ['myRepresentativePlaylist'],
    queryFn: () => getMyRepresentativePlaylist(),
  })
}
