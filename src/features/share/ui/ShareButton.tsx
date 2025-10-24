import { useRef, useState } from 'react'

import { toPng } from 'html-to-image'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Share } from '@/assets/icons'
import GuestCharacter from '@/assets/images/img_character_guest.png'
import MemberCharacter from '@/assets/images/img_character_member.png'
import type { CdCustomData } from '@/entities/playlist'
import ShareImage from '@/features/share/ui/ShareImage'
import { useCopyCdShareUrl } from '@/shared/lib/useCopyCdShareUrl'
import { flexRowCenter, myCdButton } from '@/shared/styles/mixins'
import { BottomSheet, Button, Cd, ScrollCarousel, SvgButton } from '@/shared/ui'

interface ShareButtonProps {
  playlistId: number
  stickers?: CdCustomData[]
  type?: 'MY' | 'DISCOVER'
}

const ShareButton = ({ playlistId, stickers, type = 'DISCOVER' }: ShareButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toast } = useToast()
  const { copyCdShareUrl } = useCopyCdShareUrl()
  const shareRefs = useRef<(HTMLDivElement | null)[]>([])

  const slides = [
    { id: 'cd', content: <Cd variant="share" bgColor="none" stickers={stickers} /> },
    {
      id: 'member',
      content: <img src={MemberCharacter} alt="Member Character" width={220} height={220} />,
    },
    {
      id: 'guest',
      content: <img src={GuestCharacter} alt="Guest Character" width={220} height={220} />,
    },
  ]

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

  return (
    <>
      <ButtonWrapper $isMy={type === 'MY'} onClick={handleShare}>
        <SvgButton icon={Share} width={type === 'MY' ? 16 : 24} height={type === 'MY' ? 16 : 24} />
        {type === 'MY' && <p>공유</p>}
      </ButtonWrapper>

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
            <Button onClick={() => copyCdShareUrl(playlistId)} size="M" state="secondary">
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

const ButtonWrapper = styled.div<{ $isMy: boolean }>`
  ${({ $isMy }) => $isMy && myCdButton};
`
