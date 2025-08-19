import { getVideoId } from '@/shared/lib'

interface BackgroundPlayerProps {
  link: string
  playlistId: number
}

const BackgroundPlayer = ({ link, playlistId }: BackgroundPlayerProps) => {
  const videoId = getVideoId(link)

  return (
    <iframe
      key={`${playlistId}-${videoId}`}
      width="0"
      height="0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
      title="Background Audio"
      allow="autoplay"
      style={{ display: 'none' }}
    />
  )
}

export default BackgroundPlayer
