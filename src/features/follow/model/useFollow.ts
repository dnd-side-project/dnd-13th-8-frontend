import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import {
  postFollow,
  deleteFollow,
  getFollowStatus,
  getFollowingList,
  getFollowerList,
} from '@/features/follow/api/follow'
import type { FollowSortType } from '@/features/follow/types/follow'

const useFollow = (shareCode: string, initialIsFollowing?: boolean) => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['followStatus', shareCode],
    queryFn: () => getFollowStatus(shareCode),
    enabled: !!shareCode,
    initialData: initialIsFollowing !== undefined ? { isFollowing: initialIsFollowing } : undefined,
  })

  const followMutation = useMutation({
    mutationFn: () => postFollow(shareCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', shareCode] })
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: () => deleteFollow(shareCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', shareCode] })
    },
  })

  const isFollowing = data?.isFollowing ?? initialIsFollowing ?? false

  const toggleFollow = () => {
    if (followMutation.isPending || unfollowMutation.isPending) return

    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  return {
    isFollowing,
    toggleFollow,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  }
}

export default useFollow

export const useFollowerList = (shareCode: string, sort?: FollowSortType) => {
  return useQuery({
    queryKey: ['followerList', shareCode, sort],
    queryFn: () => getFollowerList(shareCode, sort),
    enabled: !!shareCode,
    gcTime: 0,
  })
}

export const useFollowingList = (shareCode: string, sort?: FollowSortType) => {
  return useQuery({
    queryKey: ['followingList', shareCode, sort],
    queryFn: () => getFollowingList(shareCode, sort),
    enabled: !!shareCode,
    gcTime: 0,
  })
}
