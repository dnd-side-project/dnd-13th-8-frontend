import type {
  CreateBundlePayload,
  CreateBundleResponse,
  AllBundleResponse,
} from '@/features/bundle'
import { api } from '@/shared/api/httpClient'

// 모음집 생성
export const postCreateBundle = (payload: CreateBundlePayload) => {
  return api.post<CreateBundleResponse>('/main/bundle', payload)
}

// 모음집 전체 조회
export const getAllBundles = () => {
  return api.get<AllBundleResponse>('/main/bundle')
}
