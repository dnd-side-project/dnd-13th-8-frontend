import type {
  AllBundleResponse,
  CreateBundlePayload,
  CreateBundleResponse,
  AllCdsResponse,
  AddCdsToBundlePayload,
  BundleInfo,
} from '@/entities/bundle'
import { api } from '@/shared/api/httpClient'

// 모음집 전체 조회
export const getAllBundles = () => {
  return api.get<AllBundleResponse>('/main/bundle')
}

// 모음집 생성
export const postCreateBundle = (payload: CreateBundlePayload) => {
  return api.post<CreateBundleResponse>('/main/bundle', payload)
}

// 모음집 삭제
export const deleteBundle = (bundleId: number) => {
  return api.delete(`/main/bundle/${bundleId}`)
}

// CD 전체 조회
export const getAllCds = () => {
  return api.get<AllCdsResponse>('/main/bundle/playlist')
}

// 모음집에 cd 추가
export const postAddCdsToBundle = (payload: AddCdsToBundlePayload) => {
  const { bundleId, playlists } = payload
  return api.post(`/main/bundle/${bundleId}`, { playlists })
}

// 큐레이션 조회
export const getBundlePlaylist = (bundleId: number) => {
  return api.get<BundleInfo>(`/main/bundle/${bundleId}`)
}
