import React, { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/model/types'

interface SwipeCarouselProps {
  children: React.ReactNode
  data: PlaylistData[]
}

const SwipeCarousel = ({ children, data }: SwipeCarouselProps) => {
  const navigate = useNavigate()
  const { id: playlistId } = useParams()

  const initialIndex =
    !isNaN(Number(playlistId)) && Number(playlistId) > 0
      ? data.findIndex((p) => p.id === Number(playlistId))
      : 0

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    loop: false,
    startIndex: initialIndex,
  })

  // 슬라이드 선택 시 URL 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi || !data) return

    const selectedIndex = emblaApi.selectedScrollSnap()
    const newId = data[selectedIndex]?.id

    if (newId && playlistId !== String(newId)) {
      navigate(`/discover/${newId}`, { replace: true })
    }
  }, [emblaApi, data, navigate, playlistId])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <EmblaViewport ref={emblaRef}>
      <EmblaContainer>{children}</EmblaContainer>
    </EmblaViewport>
  )
}

export default SwipeCarousel

const EmblaViewport = styled.div`
  height: 100vh;
  overflow: hidden;
`

const EmblaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
