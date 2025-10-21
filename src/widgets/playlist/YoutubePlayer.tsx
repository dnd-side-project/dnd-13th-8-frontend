import { useRef } from 'react'
import YouTube from 'react-youtube'
import type { YouTubeProps, YouTubeEvent, YouTubePlayer } from 'react-youtube'

interface YoutubePlayerProps {
  videoId: string
  onReady: (event: YouTubeEvent<YouTubePlayer>) => void
  onStateChange: (event: YouTubeEvent<YouTubePlayer>) => void
}

function YoutubePlayer({ videoId, onReady, onStateChange }: YoutubePlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const playerOpts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1,
      mute: 0,
      playsinline: 1, // 모바일 인라인 재생
    },
  }

  return (
    <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
      <YouTube
        videoId={videoId}
        opts={playerOpts}
        onReady={(e) => {
          playerRef.current = e.target
          onReady(e)
        }}
        onStateChange={onStateChange}
      />
    </div>
  )
}

export default YoutubePlayer
