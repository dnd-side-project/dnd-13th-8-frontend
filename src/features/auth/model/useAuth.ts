import { useMutation } from '@tanstack/react-query'

import { postLogin } from '@/features/auth/api/auth'
import type { LoginPayload } from '@/features/auth/types/auth'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => postLogin(payload),
  })
}
