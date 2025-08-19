import styled from 'styled-components'

import { SwipeCarousel } from '@/features/swipe'
import { PlaylistLayout } from '@/widgets/playlist'

import PlaylistData from './playlistData.json'

const DiscoverPage = () => {
  return (
    <SwipeCarousel data={PlaylistData}>
      {PlaylistData.map((data) => (
        <Slide key={data.id}>
          <PlaylistLayout playlistData={data} listenerNum={data.listeners} isOnAir={data.isOnAir} />
        </Slide>
      ))}
    </SwipeCarousel>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
`
