import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import {
  postFollow,
  deleteFollow,
  getFollowStatus,
  getFollowingList,
  getFollowerList,
} from '@/features/follow/api/follow'
import type { FollowListResponse, FollowSortType } from '@/features/follow/types/follow'

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
      queryClient.invalidateQueries({
        queryKey: ['followingList'],
        refetchType: 'none',
      })
      queryClient.invalidateQueries({
        queryKey: ['followerList'],
        refetchType: 'none',
      })
      queryClient.invalidateQueries({ queryKey: ['getUserProfile', shareCode] })
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: () => deleteFollow(shareCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', shareCode] })
      queryClient.invalidateQueries({
        queryKey: ['followingList'],
        refetchType: 'none',
      })
      queryClient.invalidateQueries({
        queryKey: ['followerList'],
        refetchType: 'none',
      })
      queryClient.invalidateQueries({ queryKey: ['getUserProfile', shareCode] })
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

export const useFollowList = (
  type: 'FOLLOWERS' | 'FOLLOWING',
  shareCode: string,
  sort: FollowSortType = 'LATEST'
) => {
  const isFollower = type === 'FOLLOWERS'
  const queryKey = isFollower ? 'followerList' : 'followingList'
  const fetchFn = isFollower ? getFollowerList : getFollowingList

  return useInfiniteQuery<
    FollowListResponse,
    Error,
    InfiniteData<FollowListResponse>,
    string[],
    number | undefined
  >({
    queryKey: [queryKey, shareCode, sort],
    queryFn: ({ pageParam }) =>
      fetchFn(shareCode, {
        cursor: pageParam,
        limit: 10,
        sort,
      }),
    initialPageParam: undefined,
    enabled: !!shareCode,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined
      return lastPage.nextCursor
    },
  })
}
