import { PlaylistLayout } from '@/widgets/playlist'

import Data from './mockData.json'

const DiscoverPage = () => {
  return <PlaylistLayout playlistData={Data} listenerNum={Data.listeners} />
}

export default DiscoverPage
