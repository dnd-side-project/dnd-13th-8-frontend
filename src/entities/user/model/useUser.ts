import { useMutation, useQuery } from '@tanstack/react-query'

import { getShareCodeOwner, getUserProfile } from '@/entities/user'
import type { ShareCode } from '@/features/auth'

export const useVerifyOwner = () => {
  return useMutation({
    mutationKey: ['verifyOwner'],
    mutationFn: (shareCode: ShareCode) => getShareCodeOwner(shareCode),
  })
}

export const useOwnerStatus = (shareCode: ShareCode) => {
  return useQuery({
    queryKey: ['ownerStatus', shareCode],
    queryFn: () => getShareCodeOwner(shareCode),
    enabled: !!shareCode,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

export const useUserProfile = (shareCode: ShareCode) => {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getUserProfile', shareCode],
    queryFn: () => getUserProfile(shareCode),
    enabled: !!shareCode,
  })
  return {
    userProfile,
    isLoading,
    isError,
  }
}
