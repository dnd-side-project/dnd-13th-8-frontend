import { useState, useCallback, type Key } from 'react'

import styled from 'styled-components'

import type { CdCustomData } from '@/entities/playlist'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd } from '@/shared/ui'
import LoopCarousel from '@/shared/ui/LoopCarousel'

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
  const [activeIndex, setActiveIndex] = useState(0)

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

  return (
    <LoopCarousel onSelectIndex={handleSelectIndex}>
      {data.map((slide, index: Key) => (
        <EmblaSlide key={index}>
          <Slide $active={activeIndex === index}>
            <Cd
              variant="mycd"
              bgColor="none"
              stickers={activeIndex === index ? slide.cdResponse.cdItems : []}
            />
          </Slide>
        </EmblaSlide>
      ))}
    </LoopCarousel>
  )
}

export default PlaylistCarousel

const EmblaSlide = styled.div`
  flex: 0 0 50%;
  ${flexRowCenter}
  padding: 16px 0;
`

const Slide = styled.div<{ $active?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: 24px;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`
