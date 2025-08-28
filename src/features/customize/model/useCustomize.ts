import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  postYouTubeVideoInfo,
  postTempPlaylist,
  getUserStickers,
  postUserSticker,
  postFinalPlaylist,
} from '@/features/customize/api/customize'
import type {
  YoutubeVideoInfoPayload,
  PlaylistMetaInfo,
  UserStickerPayload,
  FinalPlaylistPayload,
} from '@/features/customize/types/customize'

export const useTempSavePlaylist = () => {
  return useMutation({
    mutationKey: ['tempSavePlaylist'],
    mutationFn: async ({
      videoPayload,
      metaInfo,
    }: {
      videoPayload: YoutubeVideoInfoPayload
      metaInfo: PlaylistMetaInfo
    }) => {
      const { videoLinks } = videoPayload
      const videoResArr = await postYouTubeVideoInfo(videoLinks)

      if (!videoResArr?.length) {
        throw new Error('유튜브 영상 정보를 가져오지 못했습니다.') // onError 던짐
      }

      // res.link는 payload의 링크와 동일하므로 null일 수 없음
      const videoResMap = new Map(videoResArr.map((res) => [res.link, res]))
      const youTubeVideoInfo = videoLinks.flatMap((link) => {
        const videoData = videoResMap.get(link)
        return videoData?.title
          ? [
              {
                link: videoData.link,
                title: videoData.title,
                thumbnailUrl: videoData.thumbnailUrl,
                duration: videoData.duration,
              },
            ]
          : []
      })

      await postTempPlaylist({
        ...metaInfo,
        youTubeVideoInfo,
      })
    },
  })
}

export const useUserSticker = () => {
  const queryClient = useQueryClient()

  // 조회
  const {
    data: userStickerList,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
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

  // 최종 저장
  const finalSaveMutation = useMutation({
    mutationKey: ['postFinalPlaylist'],
    mutationFn: (payload: FinalPlaylistPayload) => {
      return postFinalPlaylist(payload)
    },
  })

  return {
    userStickerList,
    isLoading,
    isError,
    isSuccess,
    uploadSticker: uploadMutation.mutate,
    finalSave: finalSaveMutation,
  }
}
