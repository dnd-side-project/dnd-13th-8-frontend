import { useMutation, useQuery } from '@tanstack/react-query'

import { postLogin, getAnonymousLogin, getUserInfo, deleteAccount } from '@/features/auth/api/auth'
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

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  })
}

export const useDeleteAccount = () => {
  return useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: deleteAccount,
  })
}
