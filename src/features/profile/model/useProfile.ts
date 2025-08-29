import { useMutation } from '@tanstack/react-query'

import { patchProfile } from '@/features/profile/api/profile'

export const useProfile = () => {
  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: patchProfile,
  })
}
