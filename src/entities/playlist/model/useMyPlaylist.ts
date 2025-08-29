import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getMyCdList,
  getMyFollowingList,
  getCdCustomData,
  getMyPagePlaylist,
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

export const useMyFollowingList = () => {
  return useQuery({
    queryKey: ['myFollowingList'],
    queryFn: () => getMyFollowingList('RECENT'),
    refetchOnMount: 'always',
  })
}

export const useCdCustomData = (playlistId: number) => {
  return useQuery({
    queryKey: ['cdCustomData', playlistId],
    queryFn: () => getCdCustomData(playlistId),
    enabled: Number.isInteger(playlistId) && playlistId >= 0,
  })
}

export const useMyPagePlaylist = (playlistId: number) => {
  const queryClient = useQueryClient()

  // 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myPagePlaylist', playlistId],
    queryFn: () => getMyPagePlaylist(playlistId),
    enabled: Number.isInteger(playlistId) && playlistId >= 0,
    refetchOnMount: 'always',
  })

  // 삭제
  const deleteMutation = useMutation({
    mutationKey: ['deleteMyPagePlaylist', playlistId],
    mutationFn: () => deleteMyPagePlaylist(playlistId),
  })

  // 대표 플리 지정
  const setPrimaryMutation = useMutation({
    mutationKey: ['setPrimaryPlaylist', playlistId],
    mutationFn: () => setPrimaryPlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPagePlaylist'] })
    },
  })

  return {
    playlistData: data,
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
