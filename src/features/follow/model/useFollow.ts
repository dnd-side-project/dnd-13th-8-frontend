import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { postFollow, deleteFollow, getFollowStatus } from '@/features/follow/api/follow'

const useFollow = (userId: string) => {
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

  const isFollowing = data?.isFollowing ?? false

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
