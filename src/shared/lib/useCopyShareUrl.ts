import { useCallback } from 'react'

import { useToast } from '@/app/providers'

type CopyType = 'cd' | 'feed'

export const useCopyShareUrl = () => {
  const { toast } = useToast()

  const copyShareUrl = useCallback(
    async (type: CopyType, id: number | string) => {
      // 조건에 따라 텍스트 설정
      const baseUrl = window.location.origin
      const text = type === 'cd' ? `${baseUrl}/discover/${id}` : `${baseUrl}/${id}`

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text)
          toast('LINK')
          return
        } catch (error) {
          console.warn('clipboard api 실패, fallback 시도: ', error)
        }
      }
      // 사파리 or 모바일 브라우저
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)

      textarea.focus()
      textarea.select()

      try {
        const result = document.execCommand('copy')
        if (result) toast('LINK')
      } catch (error) {
        console.error('copy 실패: ', error)
      } finally {
        document.body.removeChild(textarea)
      }
    },
    [toast]
  )

  return { copyShareUrl }
}
