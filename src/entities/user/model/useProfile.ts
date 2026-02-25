import { useMutation } from '@tanstack/react-query'

import { patchProfile } from '@/entities/user/api/profile'

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: patchProfile,
  })
}
