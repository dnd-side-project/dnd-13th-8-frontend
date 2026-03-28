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
  const { isMobile } = useDevice()
  const [apiReady, setApiReady] = useState<boolean>(!!window.YT?.Player)
  const playerCreatedRef = useRef<boolean>(false) // 플레이어 중복 생성 방지
  const playerReadyRef = useRef<boolean>(false) // 플레이어 초기화 완료 여부

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
    if (!apiReady || !containerRef.current || playerCreatedRef.current) return

    const playerContainer = document.createElement('div')
    containerRef.current.appendChild(playerContainer)

    playerRef.current = new window.YT.Player(playerContainer, {
      videoId: videoId || '',
      playerVars: {
        autoplay: 1,
        mute: isMobile ? 1 : 0,
        playsinline: 1,
      },
      events: {
        onReady: (e: { target: YT.Player }) => {
          playerReadyRef.current = true // 플레이어 준비 완료
          // 모바일에서만 현재 muted 상태를 state에 저장
          if (isMobile && setIsMuted) setIsMuted(e.target.isMuted())
          onReady(e)
        },
        onStateChange,
        onError,
      },
    })

    playerCreatedRef.current = true
  }, [apiReady, isMobile, onReady, onStateChange, onError, setIsMuted])

  // 비디오 ID 변경 시
  useEffect(() => {
    if (!playerRef.current || !videoId || !playerReadyRef.current) return

    playerRef.current.unMute()
    playerRef.current.loadVideoById(videoId)
  }, [videoId])

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
