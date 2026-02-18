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
import type { CdSavePayload, UserStickerPayload } from '@/features/customize/types/customize'

export const useFinalCdCustom = (cdId: number) => {
  return useQuery({
    queryKey: ['finalCdCustom', cdId],
    queryFn: () => getFinalCdCustom(cdId),
    enabled: Number.isInteger(cdId) && cdId >= 0,
    staleTime: 0,
  })
}

export const useTracklistValidate = () => {
  return useMutation({
    mutationKey: ['tracklistValidate'],
    mutationFn: (youtubeLinkList: string[]) => {
      return postYouTubeVideoInfo(youtubeLinkList)
    },
  })
}

export const useCdSave = () => {
  return useMutation({
    mutationKey: ['cdSave'],
    mutationFn: async ({
      payload,
      isEditMode,
      playlistId,
    }: {
      payload: CdSavePayload
      isEditMode: boolean
      playlistId?: number | null
    }) => {
      // 1. cd 임시 저장 후 id값 리턴
      const draftId = await postCdTempSave(payload)

      // 2. 리턴받은 id값을 이용해 최종 저장
      if (isEditMode && playlistId) {
        return postCdFinalUpdate(payload, draftId, playlistId)
      }
      return await postCdFinalCreate(payload, draftId)
    },
  })
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
