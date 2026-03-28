import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { EmblaCarouselType } from 'embla-carousel'
import styled, { css } from 'styled-components'

import { GuestCharacter, MemberCharacter } from '@/assets/images'
import type { CdCustomData } from '@/entities/playlist'
import { BUTTON_TEXT } from '@/pages/home/config/messages'
import { getGenreLabel } from '@/shared/lib'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Button, Badge, Cd, LoopCarousel } from '@/shared/ui'

import { DotButton, useDotButton } from './DotButton'

interface Slide {
  playlistId: number
  playlistName: string
  genre?: string
  cdItems?: CdCustomData[]
  creatorShareCode?: string
  cdResponse?: { cdItems?: CdCustomData[] }
}

interface HomeCarouselProps {
  data: Slide[]
  isLogin: boolean
}

const GENRES_WITHOUT_PUNCH_HOLE = ['WORKOUT', 'DRIVE']

const HomeCarousel = ({ data, isLogin }: HomeCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(undefined)

  const navigate = useNavigate()

  const { dotActiveIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  return (
    <Embla>
      <LoopCarousel
        onSelectIndex={(index) => setActiveIndex(index)}
        onReady={(api) => setEmblaApi(api)}
      >
        <EmblaSlide key="image">
          <Slide $active={activeIndex === 0}>
            <FirstContent>
              <img
                src={isLogin ? MemberCharacter : GuestCharacter}
                alt={isLogin ? 'Member Character' : 'Guest Character'}
                width={160}
                height={160}
              />
              <Button
                size="S"
                state="primary"
                onClick={() => (isLogin ? navigate('/customize') : navigate('/login'))}
              >
                {isLogin ? BUTTON_TEXT.MEMBER : BUTTON_TEXT.GUEST}
              </Button>
            </FirstContent>
          </Slide>
        </EmblaSlide>

        {data.map((slide, index) => (
          <EmblaSlide key={slide.playlistId}>
            <Slide
              $active={activeIndex === index + 1}
              onClick={() =>
                isLogin && slide.creatorShareCode
                  ? navigate(`/${slide.creatorShareCode}/cds/${slide.playlistId}`)
                  : navigate(`/discover/${slide.playlistId}`)
              }
            >
              <Cd
                variant="home"
                bgColor="none"
                stickers={slide.cdItems ?? slide.cdResponse?.cdItems ?? []}
              />
              <SlideOverlay
                $active={activeIndex === index + 1}
                $hasPunchHole={!GENRES_WITHOUT_PUNCH_HOLE.includes(slide?.genre ?? '')}
              >
                <Badge size="large" text={getGenreLabel(slide.genre ?? '')} />
                <Title>{slide.playlistName}</Title>
              </SlideOverlay>
            </Slide>
          </EmblaSlide>
        ))}
      </LoopCarousel>

      <EmblaControls>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === dotActiveIndex}
          />
        ))}
      </EmblaControls>
    </Embla>
  )
}

export default HomeCarousel

const Embla = styled.div`
  overflow: visible;
  margin-top: 20px;
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
      border: 0.5px solid transparent;
      border-radius: 24px;
      transform: scale(1);
      background:
        linear-gradient(
            to bottom right,
            ${({ theme }) => theme.COLOR['gray-600']},
            ${({ theme }) => theme.COLOR['gray-800']}
          )
          padding-box,
        linear-gradient(to top left, rgba(93, 100, 118, 0.1) 10%, rgba(93, 100, 118, 1) 100%)
          border-box;
    `}
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

const SlideOverlay = styled.div<{ $active: boolean; $hasPunchHole: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 6px 16px 12px 16px;
  border-radius: 0 0 20px 20px;
  background: rgba(124, 124, 124, 0.1);
  border-top: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 0px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  transition: all 0.5s ease;

  ${({ $hasPunchHole }) =>
    $hasPunchHole &&
    css`
      -webkit-mask-image: radial-gradient(circle 31px at 50% -20px, transparent 99%, #000 100%);
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-size: 100% 100%;

      mask-image: radial-gradient(circle 31px at 50% -20px, transparent 99%, #000 100%);
      mask-repeat: no-repeat;
      mask-size: 100% 100%;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: -20px;
        transform: translate(-50%, -50%);
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        pointer-events: none;
      }
    `}

  ${({ $active }) =>
    $active &&
    css`
      padding: 10px 20px 16px 20px;
    `}
`

const FirstContent = styled.div`
  ${flexColCenter}
  gap: 12px;

  button {
    font-weight: 500;
  }
`
