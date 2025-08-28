import { useEffect, useState, useCallback } from 'react'

import { type EmblaCarouselType } from 'embla-carousel'
import styled, { css } from 'styled-components'

interface DotButtonProps {
  selected?: boolean
  onClick: () => void
}

export const DotButton = ({ selected, onClick }: DotButtonProps) => {
  return <StyledDotButton type="button" onClick={onClick} $selected={selected} />
}

export const useDotButton = (emblaApi: EmblaCarouselType | undefined) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}

const selectedStyles = css`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.COLOR['primary-soft']};
`

const normalStyles = css`
  width: 6px;
  height: 6px;
  background-color: ${({ theme }) => theme.COLOR['gray-200']};
`

const StyledDotButton = styled.button<{ $selected?: boolean }>`
  border-radius: 50%;
  transition: all 0.5s ease;

  ${({ $selected }) => ($selected ? selectedStyles : normalStyles)}
`
