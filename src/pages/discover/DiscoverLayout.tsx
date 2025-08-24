import { Outlet } from 'react-router-dom'

import PlaylistProvider from '@/app/providers/PlayerProvider'

const DiscoverLayout = () => (
  <PlaylistProvider>
    <Outlet />
  </PlaylistProvider>
)

export default DiscoverLayout
