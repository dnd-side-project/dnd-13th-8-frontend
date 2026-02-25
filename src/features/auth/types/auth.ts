import type { ProfileResponse } from '@/features/profile/types/profile'

export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface UserInfo {
  userId: string
  username: string
  shareCode: string
  userProfileImageUrl: string | null
}

export interface LoginResponse extends UserInfo {
  jwtAccessToken: string
}

export interface ShareCodeOwnerResponse {
  isOwner: boolean
}

export interface AuthState {
  userInfo: UserInfo
  accessToken: string
  isLogin: boolean
  setLogin: (data: LoginResponse) => void
  setLogout: () => void
  updateUserInfo: (data: ProfileResponse) => void
}
