import YouTube from 'react-youtube'
import type { YouTubeProps, YouTubeEvent, YouTubePlayer } from 'react-youtube' //

import { useDevice } from '@/shared/lib/useDevice'

interface YoutubePlayerProps {
  videoId: string
  onReady: (event: YouTubeEvent<YouTubePlayer>) => void
  onStateChange: (event: YouTubeEvent<YouTubePlayer>) => void
}

function YoutubePlayer({ videoId, onReady, onStateChange }: YoutubePlayerProps) {
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  const playerOpts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1,
      mute: isMobile ? 1 : 0,
      playsinline: 1, // 모바일 인라인 재생
    },
  }

  return (
    <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
      <YouTube
        videoId={videoId}
        opts={playerOpts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  )
}

export default YoutubePlayer
