export interface LoginPayload {
  code: string
  codeVerifier: string
}

export interface LoginResponse {
  userId: string
  username: string
  jwtAccessToken: string
}

export interface AuthState {
  user: LoginResponse | null
  isLogin: boolean
  setLogin: (data: LoginResponse) => void
  setLogout: () => void
}
