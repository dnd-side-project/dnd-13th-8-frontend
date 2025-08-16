import { useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'
import styled, { css } from 'styled-components'

import CharacterImg from '@/assets/images/img_character.png'
import { BUTTON_TEXT } from '@/pages/homePage/config/messages'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'

import { DotButton, useDotButton } from './DotButton'

interface SlideData {
  title: string
  genre: string
}

interface LoopCarouselProps {
  data: SlideData[]
  isAuth: boolean
}

const LoopCarousel = ({ data, isAuth }: LoopCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect) // 언마운트 시 이벤트 해제
    }
  }, [emblaApi])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  return (
    <Embla>
      <div ref={emblaRef}>
        <EmblaContainer>
          <EmblaSlide key="image">
            <Slide $active={activeIndex === 0}>
              <FirstContent>
                <Image src={CharacterImg} alt="Deulak character" width={160} height={160} />
                <Button size="S" state="primary">
                  {isAuth ? BUTTON_TEXT.MEMBER : BUTTON_TEXT.GUEST}
                </Button>
              </FirstContent>
            </Slide>
          </EmblaSlide>

          {data.map((slide, index) => (
            <EmblaSlide key={index}>
              <Slide $active={activeIndex === index + 1}>
                <SlideOverlay $active={activeIndex === index + 1}>
                  <Badge size="large" text={slide.genre} />
                  <Title>{slide.title}</Title>
                </SlideOverlay>
              </Slide>
            </EmblaSlide>
          ))}
        </EmblaContainer>
      </div>

      <EmblaControls>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </EmblaControls>
    </Embla>
  )
}

export default LoopCarousel

const Embla = styled.div`
  overflow: hidden;
`

const EmblaContainer = styled.div`
  display: flex;
  touch-action: pan-y pinch-zoom;
`

const EmblaSlide = styled.div`
  flex: 0 0 50%;
  ${flexRowCenter}
`

const Slide = styled.div<{ $active: boolean }>`
  position: relative;
  border-radius: 20px;
  width: 240px;
  height: 240px;
  ${flexRowCenter}
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  transition: transform 0.8s ease;
  transform: scale(0.78);
  overflow: hidden;

  ${({ $active }) =>
    $active &&
    css`
      border: 0.8px solid transparent;
      border-radius: 24px;
      transform: scale(1);
      background:
        linear-gradient(
            to bottom right,
            ${({ theme }) => theme.COLOR['gray-600']},
            ${({ theme }) => theme.COLOR['gray-800']}
          )
          padding-box,
        linear-gradient(to bottom right, rgba(230, 255, 248, 0.5), rgb(24, 25, 32, 0.8)) border-box;
    `}
`

const Image = styled.img`
  object-fit: cover;
`

const EmblaControls = styled.div`
  ${flexRowCenter}
  margin-top: 20px;
  gap: 8px;
`

const Title = styled.p`
  color: ${({ theme }) => theme.COLOR['common-white']};
  ${({ theme }) => theme.FONT['body1-normal']};
  font-weight: 600;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`

const SlideOverlay = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 6px 16px 12px 16px;

  background: rgba(124, 124, 124, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 0px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);

  transition: all 0.5s ease;

  ${({ $active }) =>
    $active &&
    css`
      padding: 10px 20px 16px 20px;
    `}
`

const FirstContent = styled.div`
  ${flexColCenter}
  gap: 12px;
`
