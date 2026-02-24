import type {
  YoutubeVideoInfo,
  CdSavePayload,
  UserStickerPayload,
  CdFinalSaveResponse,
  CdCustomResponse,
  UserEachStickerResponse,
} from '@/features/customize/types/customize'
import { api } from '@/shared/api/httpClient'

// 유튜브 영상 정보 조회
export const postYouTubeVideoInfo = (payload: string[]) => {
  return api.post<(YoutubeVideoInfo & { valid: boolean })[]>('/api/playlist/songs', payload)
}

// CD 임시 저장: CD 최종 생성 전 백엔드 세션에 임시 저장
export const postCdTempSave = (payload: CdSavePayload) => {
  return api.post<string>('/main/playlist/v2/temp', payload)
}

// CD 최초 저장
export const postCdFinalCreate = (payload: CdSavePayload, draftId: string) => {
  return api.post<CdFinalSaveResponse>(`/main/playlist/v2/final/${draftId}`, payload)
}

// CD 수정 저장
export const postCdFinalUpdate = (payload: CdSavePayload, draftId: string, playlistId: number) => {
  return api.patch<CdFinalSaveResponse>(
    `/main/playlist/v2/final/playlist/${playlistId}/draft/${draftId}`,
    payload
  )
}

// CD 저장 후 커스텀 데이터 조회
export const getFinalCdCustom = (cdId: number) => {
  return api.get<CdCustomResponse>(`/main/cd/${cdId}`)
}

// 유저 커스텀 스티커 업로드
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
