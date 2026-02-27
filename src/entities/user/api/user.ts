import type { ProfileResponse } from '@/entities/user'
import type { ShareCode } from '@/features/auth'
import { api } from '@/shared/api/httpClient'

// 프로필 조회
export const getUserProfile = (shareCode: ShareCode) => {
  return api.get<ProfileResponse>(`/main/user/profile/${shareCode}`)
}
