import {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

import type { PlaylistInfo } from '@/entities/playlist'

type PlaylistContextType = {
  currentPlaylist: PlaylistInfo | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  setPlaylist: (playlist: PlaylistInfo, trackIndex?: number, time?: number) => void
  play: () => void
  pause: () => void
  nextTrack: () => void
  prevTrack: () => void
  updateCurrentTime: (time: number) => void
  playerRef: React.MutableRefObject<YT.Player | null>
  handlePlayerStateChange: (event: YT.OnStateChangeEvent) => void
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

  const playerRef = useRef<YT.Player | null>(null)

  // 1초마다 재생 시간 자동 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerRef.current) setCurrentTime(playerRef.current.getCurrentTime())
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const setPlaylist = (playlist: PlaylistInfo, trackIndex?: number, time?: number) => {
    setCurrentPlaylist(playlist)
    if (trackIndex !== undefined) setCurrentTrackIndex(trackIndex)
    if (time !== undefined) setCurrentTime(time)
    setIsPlaying(true)

    if (playerRef.current) {
      if (time !== undefined) playerRef.current.seekTo(time, true)
      playerRef.current.playVideo()
    }
  }

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
      if (playerRef.current) playerRef.current.seekTo(0, true)
    }
  }, [currentPlaylist, currentTrackIndex])

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
      if (event.data === window.YT.PlayerState.ENDED) nextTrack()
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
  }

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export default PlaylistProvider

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider')
  return context
}
