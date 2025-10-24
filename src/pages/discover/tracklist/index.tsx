import { useParams } from 'react-router-dom'

import { usePlaylistDetail } from '@/entities/playlist'
import { PlaylistInfo } from '@/widgets/playlist'

const PlaylistInfoPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = usePlaylistDetail(Number(id))

  return <PlaylistInfo playlistData={data} isLoading={isLoading} isError={isError} />
}

export default PlaylistInfoPage
