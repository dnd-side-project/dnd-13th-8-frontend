import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'

import { SwipeCarousel } from '@/features/swipe'
import { PlaylistLayout, BackgroundPlayer } from '@/widgets/playlist'
import type { BackgroundPlayerHandle } from '@/widgets/playlist/BackgroundPlayer'

import PlaylistData from './playlistData.json'


const DiscoverPage = () => {
  const { id } = useParams()
  const initialIndex = PlaylistData.findIndex((p) => p.id === Number(id))
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const playerRef = useRef<BackgroundPlayerHandle>(null)

  useEffect(() => {
    // 슬라이드 변경 시 BackgroundPlayer에 트랙 로드
    const currentData = PlaylistData[activeIndex]

    playerRef.current?.loadTracks(currentData.tracks, currentData.id)
  }, [activeIndex])

  return (
    <div>
      <BackgroundPlayer
        ref={playerRef}
        tracks={PlaylistData[activeIndex].tracks}
        playlistId={PlaylistData[activeIndex].id}
        isActive
      />
      <SwipeCarousel data={PlaylistData} onSelectIndexChange={setActiveIndex}>
        {PlaylistData.map((data) => (
          <Slide key={data.id}>
            <PlaylistLayout
              playlistData={data}
              listenerNum={data.listeners}
              isOnAir={data.isOnAir}
              playerRef={playerRef}
            />
          </Slide>
        ))}
      </SwipeCarousel>
    </div>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
`
