import type { ProfileResponse, ProfileEditPayload, ProfileEditResponse } from '@/entities/user'
import type { ShareCode } from '@/features/auth'
import { api } from '@/shared/api/httpClient'

// 프로필 조회
export const getUserProfile = (shareCode: ShareCode) => {
  return api.get<ProfileResponse>(`/main/user/profile/${shareCode}`)
}

// 프로필 수정
export const patchUserProfile = (payload: ProfileEditPayload) => {
  return api.patch<ProfileEditResponse>('/main/user/profile', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
