import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

import { getVideoId } from '@/shared/lib'

interface Track {
  title: string
  link: string
  duration: number
}

interface BackgroundPlayerProps {
  tracks: Track[]
  playlistId: number
  isActive: boolean
  onStateChange: (state: YT.PlayerState) => void
}

export interface BackgroundPlayerHandle {
  play: () => void
  pause: () => void
  togglePlayPause: () => void
  seekTo: (seconds: number) => void
  nextTrack: () => void
  prevTrack: () => void
  loadTracks: (tracks: Track[], playlistId: number) => void
  getCurrentTime: () => number
}

const BackgroundPlayer = forwardRef<BackgroundPlayerHandle, BackgroundPlayerProps>(
  ({ tracks, playlistId, isActive, onStateChange }, ref) => {
    const playerRef = useRef<YT.Player | null>(null)
    const currentTrackIndexRef = useRef(0)
    const currentTracksRef = useRef(tracks)
    const currentPlaylistIdRef = useRef(playlistId)
    const playerDivId = `yt-player`

    // 유튜브 API 로드
    useEffect(() => {
      if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }

      window.onYouTubeIframeAPIReady = () => {
        if (!document.getElementById(playerDivId)) return

        playerRef.current = new window.YT.Player(playerDivId, {
          height: '0',
          width: '0',
          videoId: getVideoId(currentTracksRef.current[0].link),
          playerVars: { autoplay: 1, mute: 0 },
          events: {
            onStateChange: (event: YT.OnStateChangeEvent) => {
              // 상태 변경 시 부모 컴포넌트의 콜백 함수 호출
              onStateChange(event.data)
              if (event.data === window.YT.PlayerState.ENDED) {
                nextTrack()
              }
            },
          },
        })
      }
    }, [onStateChange])

    // 플레이어 컨트롤 함수들
    const play = () => playerRef.current?.playVideo()
    const pause = () => playerRef.current?.pauseVideo()
    const togglePlayPause = () => {
      const state = playerRef.current?.getPlayerState()
      if (state === window.YT.PlayerState.PLAYING) pause()
      else play()
    }

    const seekTo = (seconds: number) => playerRef.current?.seekTo(seconds, true)
    const nextTrack = () => {
      currentTrackIndexRef.current =
        (currentTrackIndexRef.current + 1) % currentTracksRef.current.length
      playerRef.current?.loadVideoById(
        getVideoId(currentTracksRef.current[currentTrackIndexRef.current].link)
      )
    }
    const prevTrack = () => {
      currentTrackIndexRef.current =
        (currentTrackIndexRef.current - 1 + currentTracksRef.current.length) %
        currentTracksRef.current.length
      playerRef.current?.loadVideoById(
        getVideoId(currentTracksRef.current[currentTrackIndexRef.current].link)
      )
    }

    const loadTracks = (tracks: Track[], playlistId: number) => {
      currentTracksRef.current = tracks
      currentPlaylistIdRef.current = playlistId
      currentTrackIndexRef.current = 0
      playerRef.current?.loadVideoById(getVideoId(tracks[0].link))
    }

    const getCurrentTime = () => playerRef.current?.getCurrentTime() ?? 0

    // 부모에서 사용할 수 있게 ref 전달
    useImperativeHandle(ref, () => ({
      play,
      pause,
      togglePlayPause,
      seekTo,
      nextTrack,
      prevTrack,
      loadTracks,
      getCurrentTime,
    }))

    //  isActive에 따라 재생/정지
    useEffect(() => {
      if (!playerRef.current) return
      if (isActive) play()
      else pause()
    }, [isActive])

    // 언마운트 시 플레이어 제거
    useEffect(() => {
      return () => {
        if (playerRef.current) {
          playerRef.current.destroy()
          playerRef.current = null
        }
      }
    }, [])

    return <div id={playerDivId} />
  }
)
BackgroundPlayer.displayName = 'BackgroundPlayer'

export default BackgroundPlayer
