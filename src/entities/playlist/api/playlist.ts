import type {
  MyCdListResponse,
  MyFollowingListResponse,
  CdCustomDataResponse,
  MyPlaylistResponse,
  PlaylistDetailResponse,
  PlaylistParams,
  PlaylistResponse,
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

// 마이페이지 플레이리스트 조회
export const getMyPagePlaylist = (playlistId: number) => {
  return api.get<MyPlaylistResponse>(`/main/mypage/playlists/me/${playlistId}`)
}

// 마이페이지 플레이리스트 삭제
export const deleteMyPagePlaylist = (playlistId: number) => {
  return api.delete<string | null>(`/main/mypage/playlists/me/${playlistId}`)
}

// 대표 플레이리스트 설정
export const setPrimaryPlaylist = (playlistId: number) => {
  return api.patch<string | null>(`/main/mypage/playlists/me/${playlistId}/representative`)
}

export const getShufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/browse/playlists', { params })
}

export const getPlaylistDetail = (playlistId: number) => {
  return api.get<PlaylistDetailResponse>(`/main/playlists/${playlistId}`)
}

export const postPlaylistStart = (playlistId: number) => {
  return api.post(`/main/browse/playlists/start`, null, { params: { playlistId } })
}

export const postPlaylistConfirm = (playlistId: number) => {
  return api.post(`/main/browse/playlists/confirm`, null, { params: { playlistId } })
}

export const getPlaylistViewCounts = (playlistId: number) => {
  return api.get(`/main/browse/playlists/view-counts/${playlistId}`)
}
