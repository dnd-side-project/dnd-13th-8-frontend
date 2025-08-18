import { PlaylistLayout } from '@/widgets/playlist'

import Data from './mockData.json'

const DiscoverPage = () => {
  return <PlaylistLayout playlistData={Data} listenerNum={Data.listeners} isOnAir={Data.isOnAir} />
}

export default DiscoverPage
