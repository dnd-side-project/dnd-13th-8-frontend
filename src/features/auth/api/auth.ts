import type { LoginPayload, LoginResponse, UserInfo } from '@/features/auth/types/auth'
import { api } from '@/shared/api/httpClient'

// 회원 로그인 (카카오)
export const postLogin = (payload: LoginPayload) => {
  return api.post<LoginResponse>('/auth/login', payload)
}

// 비회원 토큰 발급용 로그인
export const getAnonymousLogin = () => {
  return api.get('/auth/anonymous')
}

// 채팅 내 이름/아이디 확인
export const getUserInfo = () => {
  return api.get<UserInfo>('/main/user')
}
