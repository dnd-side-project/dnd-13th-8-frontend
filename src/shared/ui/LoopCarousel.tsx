import React, { useEffect } from 'react'

import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

interface LoopCarouselProps {
  children: React.ReactNode
  onSelectIndex?: (index: number) => void
  onReady?: (api: EmblaCarouselType) => void
}

const LoopCarousel = ({ children, onSelectIndex, onReady }: LoopCarouselProps) => {
  const count = React.Children.count(children)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: count >= 3, // 3개 이상일 때만 loop 활성화
    containScroll: count < 3 ? false : 'trimSnaps',
  })

  useEffect(() => {
    if (!emblaApi) return
    onReady?.(emblaApi) // 상위에 전달

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap()
      onSelectIndex?.(index)
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelectIndex, onReady])

  return (
    <div ref={emblaRef}>
      <EmblaContainer>{children}</EmblaContainer>
    </div>
  )
}

export default LoopCarousel

const EmblaContainer = styled.div`
  display: flex;
  touch-action: pan-y pinch-zoom;
`
