import { useEffect, useRef, useState } from 'react'

import { useDevice } from '@/shared/lib/useDevice'

interface YoutubePlayerProps {
  videoId: string | null
  onReady: (event: { target: YT.Player }) => void
  onStateChange: (event: YT.OnStateChangeEvent) => void
  onError?: (event: YT.OnErrorEvent) => void
  setIsMuted?: (muted: boolean) => void
}

const YoutubePlayer = ({
  videoId,
  onReady,
  onStateChange,
  onError,
  setIsMuted,
}: YoutubePlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'
  const [apiReady, setApiReady] = useState<boolean>(!!window.YT?.Player)
  const prevVideoId = useRef<string | null>(null)

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

  // 플레이어 생성
  useEffect(() => {
    if (!apiReady || !containerRef.current || !videoId) return

    if (prevVideoId.current === videoId) return

    // 기존 플레이어 정리 (중복 생성 방지)
    if (playerRef.current) {
      try {
        playerRef.current.destroy()
      } catch (err) {
        console.warn(err)
      }
      playerRef.current = null
      containerRef.current.innerHTML = ''
    }

    const playerContainer = document.createElement('div')
    containerRef.current.appendChild(playerContainer)

    playerRef.current = new window.YT.Player(playerContainer, {
      videoId,
      playerVars: {
        autoplay: 1,
        mute: isMobile ? 1 : 0,
        playsinline: 1,
      },
      events: {
        onReady: (e: { target: YT.Player }) => {
          if (isMobile && setIsMuted) setIsMuted(e.target.isMuted())
          onReady(e)
        },
        onStateChange,
        onError,
      },
    })

    prevVideoId.current = videoId
  }, [apiReady, videoId, isMobile, onReady, onStateChange, setIsMuted])

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (err) {
          console.warn(err)
        }
        playerRef.current = null
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = ''
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
