import React, { useEffect, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

import type { PlaylistInfo } from '@/entities/playlist'

interface SwipeCarouselProps {
  children: React.ReactNode
  data: PlaylistInfo[]
  axis: 'x' | 'y'
  onSelectIndexChange?: (activeIndex: number) => void
  basePath: string
}

const SwipeCarousel = ({
  children,
  data,
  axis,
  onSelectIndexChange,
  basePath,
}: SwipeCarouselProps) => {
  const navigate = useNavigate()
  const { id: playlistId } = useParams()
  const location = useLocation()

  const initialIndex =
    !isNaN(Number(playlistId)) && Number(playlistId) > 0
      ? data.findIndex((p) => p.playlistId === Number(playlistId))
      : 0

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis,
    loop: axis === 'x',
    startIndex: initialIndex > 0 ? initialIndex : 0, // 매치 실패 시 0번으로
    containScroll: axis === 'x' && data.length <= 3 ? false : 'trimSnaps',
  })
  // 슬라이드 선택 시 URL 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi || data.length === 0) return

    const selectedIndex = emblaApi.selectedScrollSnap()
    onSelectIndexChange?.(selectedIndex) // 부모에 알림

    const newId = data[selectedIndex]?.playlistId
    if (newId != null && playlistId !== String(newId)) {
      navigate(`${basePath}/${newId}${location.search}`, { replace: true })
    }
  }, [emblaApi, data, navigate, playlistId, onSelectIndexChange, basePath, location.search])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <>
      {axis === 'x' ? (
        <div ref={emblaRef}>
          <HorizontalContainer>{children}</HorizontalContainer>
        </div>
      ) : (
        <EmblaViewport ref={emblaRef}>
          <VerticalContainer>{children}</VerticalContainer>
        </EmblaViewport>
      )}
    </>
  )
}

export default SwipeCarousel

const EmblaViewport = styled.div`
  height: 100vh;
  overflow: hidden;
`

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const HorizontalContainer = styled.div`
  display: flex;
  touch-action: pan-x pinch-zoom;
`
