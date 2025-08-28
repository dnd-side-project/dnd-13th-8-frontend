import { useRef, useState } from 'react'

import { toPng } from 'html-to-image'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Share } from '@/assets/icons'
import GuestCharacter from '@/assets/images/img_character_guest.png'
import MemberCharacter from '@/assets/images/img_character_member.png'
import ShareImage from '@/features/share/ui/ShareImage'
import { flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, Button, Cd, ScrollCarousel, SvgButton } from '@/shared/ui'


interface ShareButtonProps {
  playlistId: number
}

const slides = [
  { id: 'cd', content: <Cd variant="share" bgColor="none" /> },
  {
    id: 'member',
    content: <img src={MemberCharacter} alt="Member Character" width={220} height={220} />,
  },
  {
    id: 'guest',
    content: <img src={GuestCharacter} alt="Guest Character" width={220} height={220} />,
  },
]

const ShareButton = ({ playlistId }: ShareButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toast } = useToast()
  const shareRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleShare = () => setIsBottomSheetOpen(true)

  const handleSaveImage = async () => {
    const currentRef = shareRefs.current[selectedIndex]
    if (!currentRef) return
    try {
      const dataUrl = await toPng(currentRef)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `playlist-${playlistId}-${slides[selectedIndex].id}.png`
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
      toast('LINK')
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
          <ScrollCarousel
            gap={20}
            onSelectIndex={setSelectedIndex}
            options={{ dragFree: false, containScroll: false }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                ref={(el: HTMLDivElement | null) => {
                  shareRefs.current[idx] = el
                }}
              >
                <ShareImage>{slide.content}</ShareImage>
              </div>
            ))}
          </ScrollCarousel>

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
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
`

const ButtonBar = styled.div`
  ${flexRowCenter}
  gap: 10px;
  width: 100%;

  & button {
    flex: 1;
  }
`
