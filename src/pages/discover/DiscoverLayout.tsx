import { Outlet, useParams } from 'react-router-dom'

import PlaylistProvider from '@/app/providers/PlayerProvider'

const DiscoverLayout = () => {
  const { id } = useParams()

  return (
    <PlaylistProvider key={id}>
      <Outlet />
    </PlaylistProvider>
  )
}
export default DiscoverLayout
