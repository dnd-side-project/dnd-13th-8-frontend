import type { MyCdListResponse, MyFollowingListResponse } from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

// 나의 CD 리스트 조회
export const getMyCdList = (sort: string) => {
  return api.get<MyCdListResponse>(`/main/mypage/playlists/me?sort=${sort}`)
}

// 나의 팔로잉 리스트 조회
export const getMyFollowingList = (sort: string) => {
  return api.get<MyFollowingListResponse>(`/main/mypage/playlists/follows?sort=${sort}`)
}
