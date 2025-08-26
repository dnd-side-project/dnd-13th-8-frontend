export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface UserInfo {
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
}
