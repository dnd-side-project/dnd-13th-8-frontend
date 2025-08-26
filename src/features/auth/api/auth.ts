import type { LoginPayload, LoginResponse } from '@/features/auth/types/auth'
import { api } from '@/shared/api/httpClient'

export const postLogin = async (payload: LoginPayload) => {
  return api.post<LoginResponse>('/auth/login', payload)
}
