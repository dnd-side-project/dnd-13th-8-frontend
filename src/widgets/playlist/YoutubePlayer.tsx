import { useEffect, useRef, useState } from 'react'


interface YoutubePlayerProps {
  videoId: string | null
  startSeconds?: number
  currentTrackIndex?: number
  onReady: (event: { target: YT.Player }) => void
  onStateChange: (event: YT.OnStateChangeEvent) => void
  onError?: (event: YT.OnErrorEvent) => void
  isMuted: boolean
}

const YoutubePlayer = ({
  videoId,
  startSeconds = 0,
  currentTrackIndex = 0,
  onReady,
  onStateChange,
  onError,
  isMuted,
}: YoutubePlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [apiReady, setApiReady] = useState<boolean>(!!window.YT?.Player)
  const playerReadyRef = useRef<boolean>(false) // 플레이어 초기화 완료 여부
  const prevTrackRef = useRef<{
    videoId: string | null
    index: number | null
  }>({
    videoId: null,
    index: null,
  })

  // YouTube IFrame API 로드
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(script)

    window.onYouTubeIframeAPIReady = () => setApiReady(true)
  }, [])

  // 플레이어 생성 (한 번만)
  useEffect(() => {
    if (!apiReady || !containerRef.current || playerReadyRef.current) return

    const playerContainer = document.createElement('div')
    containerRef.current.appendChild(playerContainer)

    playerRef.current = new window.YT.Player(playerContainer, {
      videoId: videoId || '',
      playerVars: {
        autoplay: 1,
        mute: isMuted ? 1 : 0,
        playsinline: 1,
      },
      events: {
        onReady: (e: { target: YT.Player }) => {
          playerReadyRef.current = true
          prevTrackRef.current = {
            videoId: videoId || null,
            index: currentTrackIndex,
          }
          onReady(e)
        },
        onStateChange,
        onError,
      },
    })
  }, [apiReady, onReady, onStateChange, onError])

  // 트랙 변경 시
  useEffect(() => {
    if (!playerRef.current || !videoId || !playerReadyRef.current) return

    const isSameTrack =
      prevTrackRef.current.videoId === videoId && prevTrackRef.current.index === currentTrackIndex

    if (isSameTrack) return

    prevTrackRef.current = {
      videoId,
      index: currentTrackIndex,
    }

    playerRef.current.loadVideoById({
      videoId,
      startSeconds,
    })
  }, [videoId, currentTrackIndex, startSeconds])

  useEffect(() => {
    if (!playerRef.current || !playerReadyRef.current) return

    if (isMuted) {
      playerRef.current.mute()
    } else {
      playerRef.current.unMute()
    }
  }, [isMuted])

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo()
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: 0,
        height: 0,
        overflow: 'hidden',
        position: 'absolute',
      }}
    />
  )
}

export default YoutubePlayer
