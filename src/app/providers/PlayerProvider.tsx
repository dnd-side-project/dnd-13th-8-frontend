import { createContext, useState, useContext, useRef, useCallback, type ReactNode } from 'react'

import type { PlaylistDetail } from '@/entities/playlist'
import { useDevice } from '@/shared/lib'

import { useToast } from './ToastProvider'

type PlaylistContextType = {
  currentPlaylist: PlaylistDetail | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  setPlaylist: (
    playlist: PlaylistDetail,
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
  handlePlayerError: (event: YT.OnErrorEvent) => void
  isMuted: boolean
  setIsMuted: (value: boolean) => void
}

interface PlaylistProviderProps {
  children: ReactNode
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistDetail | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isMobile } = useDevice()
  const [isMuted, setIsMuted] = useState(isMobile)

  const { toast } = useToast()

  const playerRef = useRef<YT.Player | null>(null)

  const setPlaylist = (
    playlist: PlaylistDetail,
    trackIndex?: number,
    time?: number,
    autoPlay = true
  ) => {
    setCurrentPlaylist(playlist)
    if (trackIndex !== undefined) setCurrentTrackIndex(trackIndex)
    if (time !== undefined) setCurrentTime(time)

    const isSamePlaylist = currentPlaylist?.playlistId === playlist.playlistId
    setIsPlaying((prev) => (isSamePlaylist ? prev : autoPlay))

    // 상태만 업데이트
    // 플레이어 로드는 상위에서 videoId 변경으로 처리됨
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
      if (playerRef.current) {
        playerRef.current.seekTo(0, true)
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

  const handlePlayerError = useCallback(() => {
    toast('PLAY_NEXT')
    nextTrack()
  }, [nextTrack, toast])

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
    isMuted,
    setIsMuted,
    handlePlayerError,
  }

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export default PlaylistProvider

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider')
  return context
}
