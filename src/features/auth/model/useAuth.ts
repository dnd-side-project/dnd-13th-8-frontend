import { useMutation } from '@tanstack/react-query'

import { postLogin, getAnonymousLogin } from '@/features/auth/api/auth'
import type { LoginPayload } from '@/features/auth/types/auth'

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginPayload) => postLogin(payload),
  })
}

export const useAnonymousLogin = () => {
  return useMutation({
    mutationKey: ['anonymousLogin'],
    mutationFn: getAnonymousLogin,
  })
}
