import { useMutation } from '@tanstack/react-query'

import { postYouTubeVideoInfo, postTempPlaylist } from '@/features/customize/api/customize'
import type {
  YoutubeVideoInfoPayload,
  PlaylistMetaInfo,
} from '@/features/customize/types/customize'

export const useTempSavePlaylist = () => {
  return useMutation({
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
