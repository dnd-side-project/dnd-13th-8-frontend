import { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useEmblaCarousel from 'embla-carousel-react'
import styled from 'styled-components'

import { PlaylistLayout } from '@/widgets/playlist'

import mockPlaylists from './mockData.json'

const DiscoverPage = () => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const playlistId = Number(params?.id)

  const initialIndex =
    !isNaN(playlistId) && playlistId > 0 ? mockPlaylists.findIndex((p) => p.id === playlistId) : 0

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    loop: false,
    startIndex: initialIndex,
  })

  // 슬라이드 선택 시 url 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi) return

    const selectedIndex = emblaApi.selectedScrollSnap()
    const newId = mockPlaylists[selectedIndex]?.id

    if (newId && playlistId !== newId) {
      navigate(`/discover/${newId}`, { replace: true })
    }
  }, [emblaApi, navigate, playlistId])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <EmblaViewport ref={emblaRef}>
      <EmblaContainer>
        {mockPlaylists.map((data) => (
          <EmblaSlide key={data.id}>
            <PlaylistLayout
              playlistData={data}
              listenerNum={data.listeners}
              isOnAir={data.isOnAir}
              isLiked={data.liked}
            />
          </EmblaSlide>
        ))}
      </EmblaContainer>
    </EmblaViewport>
  )
}

export default DiscoverPage

const EmblaViewport = styled.div`
  height: 100vh;
  overflow: hidden;
`

const EmblaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const EmblaSlide = styled.div`
  flex: 0 0 100%;
`
