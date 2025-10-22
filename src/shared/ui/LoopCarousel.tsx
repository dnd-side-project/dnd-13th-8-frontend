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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

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

  const isSingle = React.Children.count(children) === 1

  return (
    <div ref={emblaRef}>
      <EmblaContainer $single={isSingle}>{children}</EmblaContainer>
    </div>
  )
}

export default LoopCarousel

const EmblaContainer = styled.div<{ $single?: boolean }>`
  display: flex;
  touch-action: pan-y pinch-zoom;
  justify-content: ${({ $single }) => ($single ? 'center' : 'flex-start')};
`
