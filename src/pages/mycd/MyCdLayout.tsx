import { Outlet } from 'react-router-dom'

import PlaylistProvider from '@/app/providers/PlayerProvider'

const MyCdLayout = () => {
  return (
    <PlaylistProvider key="my-cd">
      <Outlet />
    </PlaylistProvider>
  )
}
export default MyCdLayout
