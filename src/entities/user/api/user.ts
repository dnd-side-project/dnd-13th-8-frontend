import type { ProfileResponse, ShareCodeOwnerResponse } from '@/entities/user'
import type { ShareCode } from '@/features/auth'
import { api } from '@/shared/api/httpClient'

// shareCode 유효성 및 피드 본인 여부 확인
export const getShareCodeOwner = (shareCode: ShareCode) => {
  return api.get<ShareCodeOwnerResponse>(`/main/user/profile/${shareCode}/owner`)
}

// 프로필 조회
export const getUserProfile = (shareCode: ShareCode) => {
  return api.get<ProfileResponse>(`/main/user/profile/${shareCode}`)
}
