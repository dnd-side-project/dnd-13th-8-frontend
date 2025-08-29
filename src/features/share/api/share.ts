import { api } from '@/shared/api/httpClient'

// 공유 코드 발급
export const postShare = () => {
  return api.post<string>('/main/mypage/playlists/me/share')
}
