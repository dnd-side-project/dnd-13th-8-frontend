import { useQuery } from '@tanstack/react-query'

import { getMyCdList, getMyFollowingList, getCdCustomData } from '@/entities/playlist/api/playlist'

export const useMyCdList = (sort: string) => {
  return useQuery({
    queryKey: ['myCdList', sort],
    queryFn: () => getMyCdList(sort),
  })
}

export const useMyFollowingList = () => {
  return useQuery({
    queryKey: ['myFollowingList'],
    queryFn: () => getMyFollowingList('RECENT'),
  })
}

export const useCdCustomData = (playlistId: number) => {
  return useQuery({
    queryKey: ['cdCustomData', playlistId],
    queryFn: () => getCdCustomData(playlistId),
    enabled: Number.isInteger(playlistId) && playlistId >= 0,
  })
}
