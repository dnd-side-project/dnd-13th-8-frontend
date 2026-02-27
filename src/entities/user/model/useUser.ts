import { useQuery } from '@tanstack/react-query'

import { getUserProfile } from '@/entities/user'
import type { ShareCode } from '@/features/auth'

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
