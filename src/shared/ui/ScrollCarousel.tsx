import React from 'react'
import { useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

interface ScrollCarouselProps {
  children: React.ReactNode
  gap: number
}
const ScrollCarousel = ({ children, gap }: ScrollCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true })
  const [, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect) // 언마운트 시 이벤트 해제
    }
  }, [emblaApi])

  return (
    <div ref={emblaRef}>
      <EmblaContainer gap={gap}>
        {React.Children.map(children, (child, index) => (
          <EmblaSlide key={index}>{child}</EmblaSlide>
        ))}
      </EmblaContainer>
    </div>
  )
}

export default ScrollCarousel

const EmblaContainer = styled.div<{ gap: number }>`
  display: flex;
  touch-action: pan-y pinch-zoom;
  gap: ${({ gap }) => gap}px;
`

const EmblaSlide = styled.div`
  flex: 0 0 auto;
`
