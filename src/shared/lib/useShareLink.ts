import { useCallback } from 'react'

import { useToast } from '@/app/providers'

import { useCopyLink, type CopyType } from './useCopyLink'
import { useDevice } from './useDevice'

type ShareLinkParams = {
  copyType: CopyType
  copyValue: string | number
  title: string
  url: string
}

export const useShareLink = () => {
  const { toast } = useToast()
  const { copyLink } = useCopyLink()
  const { isMobile } = useDevice()

  const shareLink = useCallback(
    async ({ copyType, copyValue, title, url }: ShareLinkParams) => {
      // 디바이스 타입, 브라우저 지원 여부 및 https 체크 (미지원 시 함수로 별도 copy 처리)
      if (!isMobile || typeof window === 'undefined' || !navigator.share) {
        await copyLink(copyType, copyValue)
        return
      }

      try {
        await navigator.share({ title, url })
        toast('LINK')
      } catch (error) {
        // 사용자가 공유를 취소한 경우 외의 에러 케이스
        if ((error as Error).name !== 'AbortError') {
          console.error('링크 공유 중 에러 발생: ', error)
        }
      }
    },
    [isMobile, copyLink, toast]
  )

  return { shareLink }
}
