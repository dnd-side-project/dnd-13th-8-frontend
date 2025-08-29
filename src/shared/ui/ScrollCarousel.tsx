import React from 'react'
import { useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

interface ScrollCarouselProps {
  children: React.ReactNode
  gap: number
  onSelectIndex?: (index: number) => void
  options?: Partial<Parameters<typeof useEmblaCarousel>[0]> // Embla 옵션 오버라이드용
}

const ScrollCarousel = ({ children, gap, onSelectIndex, options }: ScrollCarouselProps) => {
  const defaultOptions = { dragFree: true }
  const emblaOptions = { ...defaultOptions, ...options }
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)
  const [, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap()
      setActiveIndex(index)
      onSelectIndex?.(index) // 상위로 index 전달
    }
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect) // 언마운트 시 이벤트 해제
    }
  }, [emblaApi])

  return (
    <div ref={emblaRef}>
      <EmblaContainer $gap={gap}>
        {React.Children.map(children, (child, index) => (
          <EmblaSlide key={index}>{child}</EmblaSlide>
        ))}
      </EmblaContainer>
    </div>
  )
}

export default ScrollCarousel

const EmblaContainer = styled.div<{ $gap: number }>`
  display: flex;
  touch-action: pan-y pinch-zoom;
  gap: ${({ $gap }) => $gap}px;
`

const EmblaSlide = styled.div`
  flex: 0 0 auto;
`
