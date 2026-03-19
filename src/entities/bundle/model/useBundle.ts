import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getAllBundles,
  postCreateBundle,
  deleteBundle,
  postAddCdsToBundle,
  getAllCds,
} from '@/entities/bundle'
import type { CreateBundlePayload, AddCdsToBundlePayload } from '@/entities/bundle'

export const useBundle = () => {
  const queryClient = useQueryClient()

  // 모음집 전체 조회
  const { data: allBundleList } = useQuery({
    queryKey: ['getAllBundles'],
    queryFn: () => getAllBundles(),
  })

  // 모음집 생성
  const createBundle = useMutation({
    mutationKey: ['createBundle'],
    mutationFn: (payload: CreateBundlePayload) => postCreateBundle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBundles'] })
    },
  })

  // 모음집 삭제
  const removeBundle = useMutation({
    mutationKey: ['deleteBundle'],
    mutationFn: (bundleId: number) => deleteBundle(bundleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBundles'] })
    },
  })

  // 모음집에 CD 추가
  const addCdsToBundle = useMutation({
    mutationKey: ['addCdsToBundle'],
    mutationFn: (payload: AddCdsToBundlePayload) => postAddCdsToBundle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBundles'] })
    },
  })

  return {
    allBundleList,
    createBundle,
    removeBundle,
    addCdsToBundle,
  }
}

export const useBundleCds = () => {
  return useQuery({
    queryKey: ['getAllCds'],
    queryFn: () => getAllCds(),
  })
}
