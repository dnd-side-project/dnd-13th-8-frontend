import type { ProfilePayload, ProfileResponse } from '@/features/profile/types/profile'
import { api } from '@/shared/api/httpClient'

// 프로필 수정
export const patchProfile = (payload: ProfilePayload) => {
  const formData = new FormData()

  formData.append('nickname', payload.nickname)
  if (payload.file instanceof File) {
    formData.append('profileImage', payload.file)
  }

  return api.patch<ProfileResponse>('/main/mypage/playlists/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
