import { useState } from 'react'

import styled from 'styled-components'

import { SwipeCarousel } from '@/features/swipe'
import { PlaylistLayout } from '@/widgets/playlist'

import PlaylistData from './playlistData.json'

const DiscoverPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <SwipeCarousel data={PlaylistData} onSelectIndexChange={setActiveIndex}>
      {PlaylistData.map((data, index) => (
        <Slide key={data.id}>
          <PlaylistLayout
            playlistData={data}
            listenerNum={data.listeners}
            isOnAir={data.isOnAir}
            isActive={index === activeIndex}
          />
        </Slide>
      ))}
    </SwipeCarousel>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
`
