import type {
  CdListResponse,
  CdListParams,
  CdMetaResponse,
  PlaylistDetail,
  PlaylistParams,
  PlaylistResponse,
} from '@/entities/playlist/types/playlist'
import { api } from '@/shared/api/httpClient'

// 피드 CD 리스트 조회
export const getCdList = (params: CdListParams) => {
  return api.get<CdListResponse>(`/main/playlist/feed/${params.shareCode}`, { params })
}

// 피드 좋아요 한 CD 리스트 조회
export const getLikedCdList = (params: CdListParams) => {
  return api.get<CdListResponse>(`/main/playlist/feed/${params.shareCode}/likes`, { params })
}

// 나의 CD 리스트 조회
export const getMyCdList = (sort: string) => {
  return api.get<CdMetaResponse>(`/main/playlist/mypage/me?sort=${sort}`)
}

// 좋아요한 CD 리스트 조회
export const getMyLikedCdList = (sort: string) => {
  return api.get<CdMetaResponse>(`/main/playlist/mypage/me/likes?sort=${sort}`)
}

// 나의 CD 트랙리스트 조회
export const getTracklist = (cdId: number) => {
  return api.get<PlaylistDetail>(`/main/playlist/mypage/me/${cdId}`)
}

// 나의 CD 공개여부 토글
export const patchMyCdPublic = (cdId: number) => {
  return api.patch<null>(`/main/playlist/mypage/me/${cdId}/public`)
}

// 나의 CD 삭제
export const deleteMyCd = (cdId: number) => {
  return api.delete<null>(`/main/playlist/${cdId}`)
}

// 셔플된 플레이리스트 목록 조회
export const getShufflePlaylists = (params: PlaylistParams) => {
  return api.get<PlaylistResponse>('/main/playlist/browse/v2', { params })
}

// 트랙리스트 상세 조회
export const getPlaylistDetail = (cdId: number) => {
  return api.get<PlaylistDetail>(`/main/playlist/${cdId}`)
}

// 내 트랙리스트 상세 조회
export const getMyPlaylistDetail = (cdId: number) => {
  return api.get<PlaylistDetail>(`/main/playlist/mypage/me/${cdId}`)
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
