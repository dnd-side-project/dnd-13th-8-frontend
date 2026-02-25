import { useMutation, useQuery } from '@tanstack/react-query'

import { getUserProfile, patchProfile } from '@/entities/user/api/profile'

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: patchProfile,
  })
}

export const useUserProfile = (shareCode: string) => {
  return useQuery({
    queryKey: ['userProfile', shareCode],
    queryFn: () => getUserProfile(shareCode),
    enabled: !!shareCode,
  })
}
