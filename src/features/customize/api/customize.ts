import type {
  TempPlaylistPayload,
  UserEachStickerResponse,
  UserStickerListResponse,
  UserStickerPayload,
  YouTubeVideoInfo,
  FinalPlaylistPayload,
  FinalPlaylistResponse,
} from '@/features/customize/types/customize'
import { api } from '@/shared/api/httpClient'

// 유튜브 영상 정보 조회
export const postYouTubeVideoInfo = (payload: string[]) => {
  return api.post<YouTubeVideoInfo[]>('/api/playlist/songs', payload)
}

// 임시 플레이리스트 저장: 플레이리스트 최종 생성 전 본문 세션에 임시 저장
export const postTempPlaylist = (payload: TempPlaylistPayload) => {
  return api.post<null>('/main/mypage/playlists/temp', payload)
}

// cd 유저 커스텀 스티커 리스트 조회
export const getUserStickers = () => {
  return api.get<UserStickerListResponse>('/main/prop/list')
}

// cd 유저 커스텀 스티커 업로드
export const postUserSticker = (payload: UserStickerPayload) => {
  const formData = new FormData()
  formData.append('theme', payload.theme)
  formData.append('file', payload.file)
  return api.post<UserEachStickerResponse>('/main/prop/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 플레이리스트 생성: 세션 임시본 사용 + cd 요청
export const postFinalPlaylist = (payload: FinalPlaylistPayload) => {
  return api.post<FinalPlaylistResponse>('/main/mypage/playlists/final', payload)
}
