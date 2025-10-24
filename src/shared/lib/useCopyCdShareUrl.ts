import { useCallback } from 'react'

import { useToast } from '@/app/providers'

export const useCopyCdShareUrl = () => {
  const { toast } = useToast()

  const copyCdShareUrl = useCallback(
    async (cdId: number) => {
      const text = `${window.location.origin}/discover/${cdId}`

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // 사파리 or 모바일 브라우저
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (e) {
          console.error(e)
        }
        document.body.removeChild(textarea)
      }

      toast('LINK')
    },
    [toast]
  )

  return { copyCdShareUrl }
}
