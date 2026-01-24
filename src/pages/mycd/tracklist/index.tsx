import { useParams } from 'react-router-dom'

import { useMyPlaylistDetail } from '@/entities/playlist'
import PlaylistInfo from '@/widgets/playlist/PlaylistInfo'

const MyCdInfoPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useMyPlaylistDetail(Number(id))

  return <PlaylistInfo playlistData={data} isLoading={isLoading} isError={isError} />
}

export default MyCdInfoPage
