export type ShareCode = string

export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface UserInfo {
  userId: string
  nickname: string
  shareCode: ShareCode
  profileUrl: string | null
}

export interface ChatUserInfo {
  userId: string
  username: string
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
  updateUserInfo: (data: UserInfo) => void
}

export interface ShareCodeOwnerResponse {
  isOwner: boolean
}
