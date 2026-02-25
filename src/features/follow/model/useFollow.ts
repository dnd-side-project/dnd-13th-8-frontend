import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import {
  postFollow,
  deleteFollow,
  getFollowStatus,
  getFollowingList,
  getFollowerList,
} from '@/features/follow/api/follow'

const useFollow = (userId: string, initialIsFollowing?: boolean) => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['followStatus', userId],
    queryFn: () => getFollowStatus(userId),
    enabled: !!userId,
  })

  const followMutation = useMutation({
    mutationFn: () => postFollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', userId] })
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: () => deleteFollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', userId] })
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

export const useFollowerList = (userId: string) => {
  return useQuery({
    queryKey: ['followerList', userId],
    queryFn: () => getFollowerList(userId),
    enabled: !!userId,
    gcTime: 0,
  })
}

export const useFollowingList = (userId: string) => {
  return useQuery({
    queryKey: ['followingList', userId],
    queryFn: () => getFollowingList(userId),
    enabled: !!userId,
    gcTime: 0,
  })
}
