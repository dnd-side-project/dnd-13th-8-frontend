import { useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import styled, { css } from 'styled-components'

import { DotButton, useDotButton } from './DotButton'

type PropType = {
  slides: number[]
}

const TopCarousel = ({ slides }: PropType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap())

    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  return (
    <Embla>
      <div ref={emblaRef}>
        <EmblaContainer>
          {slides.map((index) => (
            <EmblaSlide key={index}>
              <EmblaSlideNumber active={index === activeIndex}>{index + 1}</EmblaSlideNumber>
            </EmblaSlide>
          ))}
        </EmblaContainer>
      </div>

      <EmblaControls>
        <EmblaDots>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index === selectedIndex}
            />
          ))}
        </EmblaDots>
      </EmblaControls>
    </Embla>
  )
}

export default TopCarousel

const Embla = styled.div`
  overflow: hidden;
`

const EmblaContainer = styled.div`
  display: flex;
  touch-action: pan-y pinch-zoom;
`

const EmblaSlide = styled.div`
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmblaSlideNumber = styled.div<{ active: boolean }>`
  border-radius: 20px;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  transition: transform 0.8s ease;
  transform: scale(0.8);

  ${(props) =>
    props.active &&
    css`
      border: 0.8px solid transparent;
      transform: scale(1);
      background:
        linear-gradient(
            to bottom right,
            ${props.theme.COLOR['gray-600']},
            ${props.theme.COLOR['gray-800']}
          )
          padding-box,
        linear-gradient(
            to bottom right,
            rgba(230, 255, 248, 0.5),
            ${`${props.theme.COLOR['gray-800']}80`}
          )
          border-box;
    `}
`

const EmblaControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const EmblaDots = styled.div`
  gap: 8px;
  display: flex;
  align-items: center;
`
