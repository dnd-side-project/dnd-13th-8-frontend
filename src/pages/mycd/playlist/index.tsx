import { useLocation } from 'react-router-dom'

import { usePlaylistDetail } from '@/entities/playlist'
import PlaylistInfo from '@/widgets/playlist/PlaylistInfo'

const MyCdInfoPage = () => {
  const location = useLocation()
  const { playlistId } = location.state as { playlistId: number }
  const { data, isLoading, isError } = usePlaylistDetail(Number(playlistId))

  return <PlaylistInfo playlistData={data} isLoading={isLoading} isError={isError} />
}

export default MyCdInfoPage
