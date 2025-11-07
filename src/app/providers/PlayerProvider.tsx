import { createContext, useState, useContext, useRef, useCallback, type ReactNode } from 'react'

import type { PlaylistInfo } from '@/entities/playlist'

type PlaylistContextType = {
  currentPlaylist: PlaylistInfo | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  setPlaylist: (
    playlist: PlaylistInfo,
    trackIndex?: number,
    time?: number,
    autoPlay?: boolean
  ) => void
  play: () => void
  pause: () => void
  nextTrack: () => void
  prevTrack: () => void
  updateCurrentTime: (time: number) => void
  playerRef: React.MutableRefObject<YT.Player | null>
  handlePlayerStateChange: (event: YT.OnStateChangeEvent) => void
  unmuteOnce: () => void
}

interface PlaylistProviderProps {
  children: ReactNode
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistInfo | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const hasUnmutedOnceRef = useRef(false) // 언뮤트 트리거 여부 저장

  const playerRef = useRef<YT.Player | null>(null)

  const setPlaylist = (
    playlist: PlaylistInfo,
    trackIndex?: number,
    time?: number,
    autoPlay = true
  ) => {
    setCurrentPlaylist(playlist)
    if (trackIndex !== undefined) setCurrentTrackIndex(trackIndex)
    if (time !== undefined) setCurrentTime(time)

    const isSamePlaylist = currentPlaylist?.playlistId === playlist.playlistId

    setIsPlaying((prev) => (isSamePlaylist ? prev : autoPlay))

    if (playerRef.current) {
      if (time !== undefined) playerRef.current.seekTo(time, true)

      // 언뮤트 유지
      if (hasUnmutedOnceRef.current && isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      }

      if (!isSamePlaylist && autoPlay) {
        playerRef.current.playVideo()
      }
    }
  }

  // 최초 언뮤트 트리거 함수
  const unmuteOnce = useCallback(() => {
    if (!playerRef.current) return
    playerRef.current.unMute()
    playerRef.current.playVideo()
    hasUnmutedOnceRef.current = true
    setIsMuted(false)
  }, [])

  const play = useCallback(() => {
    if (playerRef.current) playerRef.current.playVideo()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    if (playerRef.current) playerRef.current.pauseVideo()
    setIsPlaying(false)
  }, [])

  const nextTrack = useCallback(() => {
    if (currentPlaylist && currentTrackIndex < currentPlaylist.songs.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1)
      setCurrentTime(0)
      if (playerRef.current) {
        playerRef.current.seekTo(0, true)
        // 다음 트랙에서도 언뮤트 유지
        if (hasUnmutedOnceRef.current && isMuted) {
          playerRef.current.unMute()
          setIsMuted(false)
        }
      }
    }
  }, [currentPlaylist, currentTrackIndex, isMuted])

  const prevTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1)
      setCurrentTime(0)
      if (playerRef.current) playerRef.current.seekTo(0, true)
    }
  }, [currentTrackIndex])

  const updateCurrentTime = (time: number) => setCurrentTime(time)

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const state = event.data

      if (state === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true)
      } else if (state === window.YT.PlayerState.PAUSED) {
        setIsPlaying(false)
      } else if (state === window.YT.PlayerState.ENDED) {
        nextTrack()
      }
    },
    [nextTrack]
  )

  const value = {
    currentPlaylist,
    currentTrackIndex,
    currentTime,
    isPlaying,
    setPlaylist,
    play,
    pause,
    nextTrack,
    prevTrack,
    updateCurrentTime,
    playerRef,
    handlePlayerStateChange,
    unmuteOnce,
  }

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export default PlaylistProvider

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider')
  return context
}
