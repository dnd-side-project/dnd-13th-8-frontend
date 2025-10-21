import { useEffect, useState, useCallback, type Key } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

import type { CdCustomData } from '@/entities/playlist'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd } from '@/shared/ui'

interface CarouselPlaylist {
  playlistId: number
  playlistName: string
  onlyCdResponse: { cdItems: CdCustomData[] }
}

interface LoopCarouselProps {
  data: CarouselPlaylist[]
  onCenterChange?: (playlist: { playlistId: number; playlistName: string }) => void
}

const LoopCarousel = ({ data, onCenterChange }: LoopCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSelect = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    setActiveIndex(index)

    const center = data[index]
    if (center && onCenterChange) {
      onCenterChange({
        playlistId: center.playlistId,
        playlistName: center.playlistName,
      })
    }
  }, [emblaApi, data, onCenterChange])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', handleSelect)
    handleSelect()

    return () => {
      emblaApi.off('select', handleSelect) // 언마운트 시 이벤트 해제
    }
  }, [emblaApi, handleSelect])

  return (
    <div ref={emblaRef}>
      <EmblaContainer $single={data.length === 1}>
        {data.map((slide, index: Key) => (
          <EmblaSlide key={index}>
            <Slide $active={activeIndex === index}>
              <Cd
                variant="carousel"
                bgColor="none"
                stickers={activeIndex === index ? slide.onlyCdResponse.cdItems : []}
              />
            </Slide>
          </EmblaSlide>
        ))}
      </EmblaContainer>
    </div>
  )
}

export default LoopCarousel

const EmblaContainer = styled.div<{ $single?: boolean }>`
  display: flex;
  touch-action: pan-y pinch-zoom;
  padding: 16px 0;
  justify-content: ${({ $single }) => ($single ? 'center' : 'flex-start')};
`

const EmblaSlide = styled.div`
  flex: 0 0 50%;
  ${flexRowCenter}
`

const Slide = styled.div<{ $active?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: 24px;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`
