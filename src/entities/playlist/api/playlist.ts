import type {
  MyCdListResponse,
  MyFollowingListResponse,
  CdCustomDataResponse,
} from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

// 나의 CD 리스트 조회
export const getMyCdList = (sort: string) => {
  return api.get<MyCdListResponse>(`/main/mypage/playlists/me?sort=${sort}`)
}

// 나의 팔로잉 리스트 조회
export const getMyFollowingList = (sort: string) => {
  return api.get<MyFollowingListResponse>(`/main/mypage/playlists/follows?sort=${sort}`)
}

// 단일 cd 커스텀 데이터 조회
export const getCdCustomData = (playlistId: number) => {
  return api.get<CdCustomDataResponse>(`/main/cd/${playlistId}`)
}
