import { useRef, useState } from 'react'

import { toPng } from 'html-to-image'
import styled from 'styled-components'

import { useToast } from '@/app/providers/ToastProvider'
import { Share } from '@/assets/icons'
import ShareImage from '@/features/share/ui/ShareImage'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, Button, SvgButton } from '@/shared/ui'

interface ShareButtonProps {
  playlistId: number
}

const ShareButton = ({ playlistId }: ShareButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { toast } = useToast()
  const shareRef = useRef<HTMLDivElement>(null)

  const handleShare = () => {
    setIsBottomSheetOpen(true)
  }

  const handleSaveImage = async () => {
    if (!shareRef.current) return
    try {
      const dataUrl = await toPng(shareRef.current)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `playlist-${playlistId}.png`
      link.click()
      toast('IMAGE')
    } catch (e) {
      console.error(e)
    }
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text)
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
      return Promise.resolve()
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/discover/${playlistId}`
    copyToClipboard(link).then(() => {
      console.log(link)
      toast('LINK')
      console.log('copied', link)
    })
  }

  return (
    <>
      <SvgButton icon={Share} width={24} height={24} onClick={handleShare} />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="fit-content"
      >
        <BottomSheetWrapper>
          <div ref={shareRef}>
            <ShareImage />
          </div>
          <ButtonBar>
            <Button onClick={handleSaveImage} size="M" state="secondary">
              이미지로 저장
            </Button>
            <Button onClick={handleCopyLink} size="M" state="secondary">
              링크 복사
            </Button>
          </ButtonBar>
        </BottomSheetWrapper>
      </BottomSheet>
    </>
  )
}

export default ShareButton

const BottomSheetWrapper = styled.div`
  ${flexColCenter}
  gap: 24px;
`

const ButtonBar = styled.div`
  ${flexRowCenter}
  gap: 10px;
  width: 100%;

  & button {
    flex: 1;
  }
`
