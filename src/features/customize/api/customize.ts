import type { TempPlaylistPayload, YouTubeVideoInfo } from '@/features/customize/types/customize'
import { api } from '@/shared/api/httpClient'

// 유튜브 영상 정보 조회
export const postYouTubeVideoInfo = (payload: string[]) => {
  return api.post<YouTubeVideoInfo[]>('/api/playlist/songs', payload)
}

// 임시 플레이리스트 저장: 플레이리스트 최종 생성 전 본문 세션에 임시 저장
export const postTempPlaylist = (payload: TempPlaylistPayload) => {
  return api.post('/main/mypage/playlists/temp', payload)
}

// 플레이리스트 생성: 세션 임시본 사용 + cd 요청
export const postFinalPlaylist = () => {
  return api.post('/main/mypage/playlists/final')
}
