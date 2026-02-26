import type { ProfileResponse } from '@/features/profile/types/profile'

export type ShareCode = string

export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface UserInfo {
  userId: string
  username: string
  shareCode: ShareCode
  profileUrl: string | null
}

export interface LoginResponse extends UserInfo {
  jwtAccessToken: string
}

export interface AuthState {
  userInfo: UserInfo
  accessToken: string
  isLogin: boolean
  setLogin: (data: LoginResponse) => void
  setLogout: () => void
  updateUserInfo: (data: ProfileResponse) => void
}
