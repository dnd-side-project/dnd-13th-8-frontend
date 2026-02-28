import { useMutation, useQuery } from '@tanstack/react-query'

import {
  postLogin,
  getAnonymousLogin,
  getUserInfo,
  deleteAccount,
  getShareCodeOwner,
  type LoginPayload,
  type ShareCode,
} from '@/features/auth'

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

export const useVerifyOwner = () => {
  return useMutation({
    mutationKey: ['verifyOwner'],
    mutationFn: (shareCode: ShareCode) => getShareCodeOwner(shareCode),
  })
}

export const useOwnerStatus = (shareCode: ShareCode) => {
  return useQuery({
    queryKey: ['ownerStatus', shareCode],
    queryFn: () => getShareCodeOwner(shareCode),
    enabled: !!shareCode,
    staleTime: 1000 * 60 * 5, // 5분
  })
}
