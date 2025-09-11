import type {
  MyCdListResponse,
  MyFollowingListResponse,
  CdCustomDataResponse,
  MyPlaylistResponse,
  PlaylistDetailResponse,
  PlaylistParams,
  PlaylistResponse,
  MyRepresentResponse,
} from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

// 나의 CD 리스트 조회
export const getMyCdList = (sort: string) => {
  return api.get<MyCdListResponse>(`/main/playlist/mypage/me?sort=${sort}`)
}

// 나의 팔로잉 리스트 조회
export const getMyFollowingList = (sort: string) => {
  return api.get<MyFollowingListResponse>(`/main/playlist/mypage/me/follows?sort=${sort}`)
}

// 단일 cd 커스텀 데이터 조회
export const getCdCustomData = (playlistId: number) => {
  return api.get<CdCustomDataResponse>(`/main/cd/${playlistId}`)
}

// 마이페이지 플레이리스트 조회
export const getMyPagePlaylist = (playlistId: number) => {
  return api.get<MyPlaylistResponse>(`/main/playlist/mypage/me/${playlistId}`)
}

// 마이페이지 플레이리스트 삭제
export const deleteMyPagePlaylist = (playlistId: number) => {
  return api.delete<string | null>(`/main/playlist/${playlistId}`)
}

// 대표 플레이리스트 설정
export const setPrimaryPlaylist = (playlistId: number) => {
  return api.patch<string | null>(`/main/playlist/mypage/me/${playlistId}/representative`)
}

// 셔플된 플레이리스트 목록 조회
export const getShufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/playlist/browse', { params })
}

// 플레이리스트 상세 조회 + 재생 기록 저장
export const getPlaylistDetail = (playlistId: number) => {
  return api.get<PlaylistDetailResponse>(`/main/playlist/${playlistId}`)
}

// 하트비트 시작
export const postPlaylistStart = (playlistId: number) => {
  return api.post(`/main/playlist/browse/start`, null, { params: { playlistId } })
}

// 하트비트 확정
export const postPlaylistConfirm = (playlistId: number) => {
  return api.post(`/main/playlist/browse/confirm`, null, { params: { playlistId } })
}

// 플리 조회수 단건 조회
export const getPlaylistViewCounts = (playlistId: number) => {
  return api.get(`/main/playlist/browse/view-counts/${playlistId}`)
}

// 내 대표 플레이리스트 조회
export const getMyRepresentativePlaylist = () => {
  return api.get<MyRepresentResponse>('/main/playlist/mypage/me/representative')
}
