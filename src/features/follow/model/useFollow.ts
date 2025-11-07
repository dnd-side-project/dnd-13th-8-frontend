import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { postFollow, deleteFollow, getFollowStatus } from '@/features/follow/api/follow'

const useFollow = (playlistId: number, initialIsFollowing: boolean) => {
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const followMutation = useMutation({
    mutationFn: (playlistId: number) => postFollow(playlistId),
    onSuccess: () => {
      setIsFollowing(true)
      queryClient.invalidateQueries({ queryKey: ['playlistDetail', playlistId] })
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: (playlistId: number) => deleteFollow(playlistId),
    onSuccess: () => {
      setIsFollowing(false)
      queryClient.invalidateQueries({ queryKey: ['playlistDetail', playlistId] })
    },
  })

  const toggleFollow = () => {
    if (followMutation.isPending || unfollowMutation.isPending) return
    if (isFollowing) {
      unfollowMutation.mutate(playlistId)
    } else {
      followMutation.mutate(playlistId)
    }
  }

  return { isFollowing, toggleFollow, followMutation, unfollowMutation }
}

export default useFollow

export const useFollowStatus = (playlistId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['followStatus', playlistId],
    queryFn: () => getFollowStatus(playlistId),
    staleTime: 0,
    enabled: playlistId !== undefined && (options?.enabled ?? true),
  })
}
