import type { ProfilePayload, ProfileResponse } from '@/entities/user/types/profile'
import { api } from '@/shared/api/httpClient'

// 프로필 수정
export const patchProfile = (payload: ProfilePayload) => {
  const formData = new FormData()

  formData.append('nickname', payload.nickname)
  if (payload.file instanceof File) {
    formData.append('profileImage', payload.file)
  }

  return api.patch<ProfileResponse>('/main/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
