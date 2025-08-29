import { useMutation } from '@tanstack/react-query'

import { postShare } from '@/features/share/api/share'

export const useShare = () => {
  return useMutation({
    mutationKey: ['postShare'],
    mutationFn: () => postShare(),
  })
}
