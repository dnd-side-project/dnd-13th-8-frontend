import { useRef, useState } from 'react'

import { toBlob } from 'html-to-image'
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

// 이미지 로드 완료를 명시적으로 보장하고 총 개수를 반환하는 함수
const isImagesLoaded = (element: HTMLElement): Promise<number> => {
  const images = element.querySelectorAll('img')
  const loadingPromises: Promise<void>[] = []

  images.forEach((img) => {
    if (img.complete) return

    loadingPromises.push(
      new Promise((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject()
        if (img.complete) resolve()
      })
    )
  })

  return Promise.all(loadingPromises).then(() => images.length)
}

const buildBlobWithRetry = async (element: HTMLElement, maxAttempts: number) => {
  let bestBlob: Blob | null = null
  let bestSize = 0
  let attempt = 0

  let lastSize = 0
  let count = 0

  while (attempt < maxAttempts) {
    let currentBlob: Blob | null = null

    try {
      currentBlob = await toBlob(element, {
        cacheBust: true,
        pixelRatio: 3,
      })
    } catch (e) {
      console.error(e)
      currentBlob = null
    }

    if (currentBlob) {
      const currentSize = currentBlob.size

      // 최대 크기 추적
      if (currentSize > bestSize) {
        bestSize = currentSize
        bestBlob = currentBlob
      }

      // 연속 동일 크기 확인 로직
      if (currentSize === lastSize && currentSize > 0) {
        count += 1
      } else {
        count = 1
      }
      lastSize = currentSize

      // 연속 3회 동일 크기 도달 시 조기 종료
      if (count >= 3) {
        break
      }
    } else {
      count = 0 // blob 생성 실패 시 연속 횟수 초기화
    }

    attempt += 1
    // 500ms 대기 후 재시도
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return bestBlob
}

const ShareButton = ({ playlistId, stickers, type = 'DISCOVER' }: ShareButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toast } = useToast()
  const { copyCdShareUrl } = useCopyCdShareUrl()
  const shareRefs = useRef<(HTMLDivElement | null)[]>([])

  const slides = [
    { id: 'cd', content: <Cd variant="customize" bgColor="none" stickers={stickers} /> },
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
      // 이미지 로딩을 기다리고 총 개수를 얻음
      const totalImages = await isImagesLoaded(currentRef)

      // 렌더링 안정화를 위해 100ms 대기
      await new Promise((resolve) => setTimeout(resolve, 100))

      // 최대 시도 횟수 계산
      const maxAttempts = totalImages + 2

      // 로딩 완료 후, 최대 횟수까지 재시도 및 가장 큰 Blob 선택
      const blob = await buildBlobWithRetry(currentRef, maxAttempts)

      if (blob) {
        const fileName = `playlist-${playlistId}-${slides[selectedIndex].id}.png`

        // 다운로드
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast('IMAGE')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <ButtonWrapper $isMy={type === 'MY'} onClick={handleShare}>
        <SvgButton icon={Share} width={type === 'MY' ? 16 : 24} height={type === 'MY' ? 16 : 24} />
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
