import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'

import type { CdCustomData, PlaylistInfo } from '@/entities/playlist'
import { SwipeCarousel } from '@/features/swipe'
import { useDevice } from '@/shared/lib/useDevice'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd } from '@/shared/ui'

interface CarouselPlaylist {
  playlistId: number
  playlistName: string
  cdResponse: { cdItems: CdCustomData[] }
}

interface PlaylistCarouselProps {
  data: CarouselPlaylist[]
  onCenterChange?: (playlist: { playlistId: number; playlistName: string }) => void
}

const PlaylistCarousel = ({ data, onCenterChange }: PlaylistCarouselProps) => {
  const { id: playlistId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  // url 기준으로 active index 동기화
  useEffect(() => {
    if (!playlistId) return

    const index = data.findIndex((p) => p.playlistId === Number(playlistId))

    if (index >= 0) setActiveIndex(index)
  }, [playlistId, data])

  const handleSelectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index)
      const center = data[index]
      if (center && onCenterChange) {
        onCenterChange({
          playlistId: center.playlistId,
          playlistName: center.playlistName,
        })
      }
    },
    [data, onCenterChange]
  )

  const playlistInfoData: PlaylistInfo[] = data.map((p) => ({
    playlistId: p.playlistId,
    playlistName: p.playlistName,
    creator: { creatorId: '0', creatorNickname: '' },
    genre: '',
    songs: [],
    isPublic: true,
  }))

  return (
    <SwipeCarousel
      data={playlistInfoData}
      onSelectIndexChange={handleSelectIndex}
      axis="x"
      basePath="/mycd"
    >
      {data.map((slide, index) => (
        <EmblaSlide key={slide.playlistId} $isMobile={isMobile}>
          <Slide $active={activeIndex === index}>
            <Cd
              variant={isMobile ? 'mycd_mo' : 'mycd'}
              bgColor="none"
              stickers={slide.cdResponse.cdItems}
            />
          </Slide>
        </EmblaSlide>
      ))}
    </SwipeCarousel>
  )
}

export default PlaylistCarousel

const EmblaSlide = styled.div<{ $isMobile?: boolean }>`
  flex: 0 0 50%;
  ${flexRowCenter}
  padding: ${({ $isMobile }) => ($isMobile ? '0' : '16px 0')};
`

const Slide = styled.div<{ $active?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: 24px;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`
