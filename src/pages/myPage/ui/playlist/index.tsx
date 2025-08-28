import { useParams } from 'react-router-dom'

const MyPagePlaylist = () => {
  const { id: playlistId } = useParams()
  console.log(playlistId)

  return <div>Playlist</div>
}

export default MyPagePlaylist
