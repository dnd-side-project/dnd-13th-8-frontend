import type { ProfileResponse } from '@/features/profile/types/profile'

export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface UserInfo {
  userId: string
  username: string
  userProfileImageUrl: string | null
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
