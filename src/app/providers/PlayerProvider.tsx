import { createContext, useState, useContext, type ReactNode } from 'react'

type Track = {
  title: string
  duration: number
  link: string
}

type Playlist = {
  id: number
  title: string
  tracks: Track[]
}

type PlaylistContextType = {
  currentPlaylist: Playlist | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  setPlaylist: (playlist: Playlist, trackIndex?: number) => void
  play: () => void
  pause: () => void
  nextTrack: () => void
  prevTrack: () => void
  updateCurrentTime: (time: number) => void
}

interface PlaylistProviderProps {
  children: ReactNode
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)

  const setPlaylist = (playlist: Playlist, trackIndex = 0) => {
    setCurrentPlaylist(playlist)
    setCurrentTrackIndex(trackIndex)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)

  const nextTrack = () => {
    if (currentPlaylist && currentTrackIndex < currentPlaylist.tracks.length - 1) {
      setCurrentTrackIndex((prevIndex) => prevIndex + 1)
      setCurrentTime(0)
    }
  }

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prevIndex) => prevIndex - 1)
      setCurrentTime(0)
    }
  }

  const updateCurrentTime = (time: number) => {
    setCurrentTime(time)
  }

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
  }

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export default PlaylistProvider

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}
