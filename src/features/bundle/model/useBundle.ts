import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { postCreateBundle, getAllBundles } from '@/features/bundle'
import type { CreateBundlePayload } from '@/features/bundle'

export const useBundle = () => {
  const queryClient = useQueryClient()

  // 모음집 전체 조회
  const { data: bundleList } = useQuery({
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

  return {
    bundleList,
    createBundle,
  }
}
