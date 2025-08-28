import { useMutation, useQuery } from '@tanstack/react-query'

import { postLogin, getAnonymousLogin, getUserInfo } from '@/features/auth/api/auth'
import type { LoginPayload } from '@/features/auth/types/auth'

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => postLogin(payload),
  })
}

export const useAnonymousLogin = () => {
  return useMutation({
    mutationFn: getAnonymousLogin,
  })
}
export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  })
}
