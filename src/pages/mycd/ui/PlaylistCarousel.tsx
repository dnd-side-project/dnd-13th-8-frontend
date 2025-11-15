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
  currentPlaylistId?: number | null
  isPlaying?: boolean
}

const PlaylistCarousel = ({
  data,
  onCenterChange,
  currentPlaylistId,
  isPlaying,
}: PlaylistCarouselProps) => {
  const { id: playlistId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'
  console.log(window.innerHeight)
  const isSmall = isMobile && window.innerHeight < 633

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
      {data.map((slide, index) => {
        const isNowPlaying = slide.playlistId === currentPlaylistId && isPlaying

        return (
          <EmblaSlide key={slide.playlistId} $isMobile={isMobile}>
            <Slide $active={activeIndex === index} $isMobile={isMobile}>
              <CdSpinner $isNowPlaying={!!isNowPlaying}>
                <Cd
                  variant={isSmall ? 'customize' : isMobile ? 'mycd_mo' : 'mycd'}
                  bgColor="none"
                  stickers={slide.cdResponse.cdItems}
                />
              </CdSpinner>
            </Slide>
          </EmblaSlide>
        )
      })}
    </SwipeCarousel>
  )
}

export default PlaylistCarousel

const EmblaSlide = styled.div<{ $isMobile?: boolean }>`
  flex: 0 0 50%;
  ${flexRowCenter}
  padding: ${({ $isMobile }) => ($isMobile ? '0' : '16px 0')};
`

const Slide = styled.div<{ $active?: boolean; $isMobile?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: ${({ $isMobile }) => ($isMobile ? '0 24px 16px 24px' : '32px 24px 24px 24px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

const CdSpinner = styled.div<{ $isNowPlaying: boolean }>`
  position: relative;
  animation: spin 40s linear infinite;
  animation-play-state: ${(props) => (props.$isNowPlaying ? 'running' : 'paused')};
  transform-origin: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
