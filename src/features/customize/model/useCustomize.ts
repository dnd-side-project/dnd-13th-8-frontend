import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getFinalCdCustom,
  postYouTubeVideoInfo,
  postCdTempSave,
  postCdFinalCreate,
  postCdFinalUpdate,
  getUserStickers,
  postUserSticker,
} from '@/features/customize/api/customize'
import type {
  CdTempSavePayload,
  UserStickerPayload,
  CdFinalCreatePayload,
  CdFinalUpdatePayload,
} from '@/features/customize/types/customize'

export const useFinalCdCustom = (cdId: number) => {
  return useQuery({
    queryKey: ['finalCdCustom', cdId],
    queryFn: () => getFinalCdCustom(cdId),
    enabled: Number.isInteger(cdId) && cdId >= 0,
    staleTime: 0,
  })
}

export const useCdTempSave = () => {
  return useMutation({
    mutationKey: ['cdTempSave'],
    mutationFn: async ({
      youtubeLinkList,
      tempSaveMap,
    }: {
      youtubeLinkList: string[]
      tempSaveMap: CdTempSavePayload
    }) => {
      const videoResArr = await postYouTubeVideoInfo(youtubeLinkList)
      if (!videoResArr?.length) {
        throw new Error('유튜브 영상 정보를 가져오지 못했습니다.')
      }

      const newVideoInfoList = tempSaveMap.youTubeVideoInfo.map((e) => {
        const resMap = videoResArr.find((res) => e.link === res.link)
        if (!resMap) throw new Error('일치하는 유튜브 영상 정보를 찾지 못했습니다.')
        const { duration, thumbnailUrl, title } = resMap
        return {
          ...e,
          duration,
          thumbnailUrl,
          title,
        }
      })

      const tempSavePayload = {
        ...tempSaveMap,
        youTubeVideoInfo: newVideoInfoList,
      }
      await postCdTempSave(tempSavePayload)
    },
  })
}

export const useCdFinalSave = () => {
  // 생성
  const createMutation = useMutation({
    mutationKey: ['cdFinalCreate'],
    mutationFn: (payload: CdFinalCreatePayload) => {
      return postCdFinalCreate(payload)
    },
  })

  // 수정
  const updateMutation = useMutation({
    mutationKey: ['cdFinalUpdate'],
    mutationFn: (payload: CdFinalUpdatePayload) => {
      return postCdFinalUpdate(payload)
    },
  })

  return {
    createMutation,
    updateMutation,
  }
}

export const useUserSticker = () => {
  const queryClient = useQueryClient()

  // 조회
  const { data: userStickerList } = useQuery({
    queryKey: ['getUserStickers'],
    queryFn: () => getUserStickers(),
  })

  // 업로드
  const uploadMutation = useMutation({
    mutationKey: ['postUserSticker'],
    mutationFn: ({ theme, file }: UserStickerPayload) => {
      return postUserSticker({ theme, file })
    },
    onSuccess: () => {
      // 캐시 무효화하여 유저 스티커 리스트 재조회
      queryClient.invalidateQueries({ queryKey: ['getUserStickers'] })
    },
    onError: (error) => {
      console.error('스티커 업로드 실패', error)
    },
  })

  return {
    userStickerList,
    uploadSticker: uploadMutation,
    uploadLoading: uploadMutation.isPending,
  }
}
