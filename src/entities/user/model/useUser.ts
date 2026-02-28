import { useMutation, useQuery } from '@tanstack/react-query'

import { getUserProfile, patchUserProfile } from '@/entities/user'
import type { ProfileEditPayload } from '@/entities/user'
import type { ShareCode } from '@/features/auth'

export const useUserProfile = (shareCode?: ShareCode) => {
  // 프로필 조회
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getUserProfile', shareCode],
    queryFn: () => getUserProfile(shareCode!),
    enabled: !!shareCode,
  })

  // 프로필 수정
  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ['patchUserProfile'],
    mutationFn: (payload: FormData) => patchUserProfile(payload as unknown as ProfileEditPayload),
  })

  return {
    userProfile,
    updateProfile,
    isLoading,
    isPending,
    isError,
  }
}
