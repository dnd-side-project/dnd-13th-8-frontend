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
  getAccTime: () => number
  seekToTotal: (accSeconds: number) => void
}

const BackgroundPlayer = forwardRef<BackgroundPlayerHandle, BackgroundPlayerProps>(
  ({ tracks, playlistId, isActive, onStateChange }, ref) => {
    const playerRef = useRef<YT.Player | null>(null)
    const currentTrackIndexRef = useRef(0)
    const currentTracksRef = useRef(tracks)
    const currentPlaylistIdRef = useRef(playlistId)
    const accTimeRef = useRef(0) // 누적 재생 시간
    const playerDivId = `yt-player`
    const trackStartTimesRef = useRef<number[]>([])

    // 트랙 누적 시간 계산
    const calculateTrackStartTimes = (tracks: Track[]) => {
      const startTimes: number[] = []
      tracks.reduce((acc, t) => {
        startTimes.push(acc)
        return acc + t.duration
      }, 0)
      trackStartTimesRef.current = startTimes
    }

    useEffect(() => {
      calculateTrackStartTimes(tracks)
    }, [tracks])

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
                accTimeRef.current +=
                  currentTracksRef.current[currentTrackIndexRef.current].duration
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
      accTimeRef.current = 0
      calculateTrackStartTimes(tracks)
      playerRef.current?.loadVideoById(getVideoId(tracks[0].link))
    }

    const getAccTime = () => {
      return accTimeRef.current + (playerRef.current?.getCurrentTime() ?? 0)
    }

    // 전체 누적 시간 기준으로 트랙 + 트랙 내 시간 계산
    const seekToTotal = (accSeconds: number) => {
      const startTimes = trackStartTimesRef.current
      let trackIndex = 0
      for (let i = startTimes.length - 1; i >= 0; i--) {
        if (accSeconds >= startTimes[i]) {
          trackIndex = i
          break
        }
      }
      const timeInTrack = accSeconds - startTimes[trackIndex]
      currentTrackIndexRef.current = trackIndex
      playerRef.current?.loadVideoById(getVideoId(currentTracksRef.current[trackIndex].link))
      playerRef.current?.seekTo(timeInTrack, true)
      accTimeRef.current = startTimes[trackIndex] // 누적 시간 갱신
    }

    // 부모에서 사용할 수 있게 ref 전달
    useImperativeHandle(ref, () => ({
      play,
      pause,
      togglePlayPause,
      seekTo,
      nextTrack,
      prevTrack,
      loadTracks,
      getAccTime,
      seekToTotal,
    }))

    useEffect(() => {
      if (!playerRef.current) return
      if (isActive) play()
      else pause()
    }, [isActive])

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
