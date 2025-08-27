import type { LoginPayload, LoginResponse } from '@/features/auth/types/auth'
import { api } from '@/shared/api/httpClient'

// 회원 로그인 (카카오)
export const postLogin = (payload: LoginPayload) => {
  return api.post<LoginResponse>('/auth/login', payload)
}

// 비회원 토큰 발급용 로그인
export const getAnonymousLogin = () => {
  return api.get<string>('/auth/anonymous')
}
