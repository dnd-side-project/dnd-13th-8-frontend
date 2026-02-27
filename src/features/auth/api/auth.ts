import type {
  LoginPayload,
  LoginResponse,
  UserInfo,
  ShareCode,
  ShareCodeOwnerResponse,
} from '@/features/auth'
import { api } from '@/shared/api/httpClient'

// 회원 로그인 (카카오)
export const postLogin = (payload: LoginPayload) => {
  return api.post<LoginResponse>('/auth/login', payload)
}

// 비회원 토큰 발급용 로그인
export const getAnonymousLogin = () => {
  return api.get<string>('/auth/anonymous')
}

// 회원 탈퇴
export const deleteAccount = () => {
  return api.delete<null>('/main/user/account')
}

// 채팅 내 이름/아이디 확인
export const getUserInfo = () => {
  return api.get<UserInfo>('/chat/user')
}

// shareCode 유효성 및 피드 본인 여부 확인
export const getShareCodeOwner = (shareCode: ShareCode) => {
  return api.get<ShareCodeOwnerResponse>(`/main/user/profile/${shareCode}/owner`)
}
