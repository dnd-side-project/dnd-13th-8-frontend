import { useMutation } from '@tanstack/react-query'

import { patchProfile } from '@/entities/user/api/profile'

export const useProfile = () => {
  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: patchProfile,
  })
}
