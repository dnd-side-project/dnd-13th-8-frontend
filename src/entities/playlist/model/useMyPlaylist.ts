import { useQuery } from '@tanstack/react-query'

import { getMyCdList, getMyFollowingList } from '@/entities/playlist/api/playlist'

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
