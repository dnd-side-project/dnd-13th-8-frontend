import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'

import PlaylistProvider, { usePlaylist } from '@/app/providers/PlayerProvider'
import { DiscoverCoachMark } from '@/pages/discover/ui'
import { getVideoId } from '@/shared/lib'
import { YoutubePlayer } from '@/widgets/playlist'

const DiscoverLayout = () => {
  return (
    <PlaylistProvider>
      <Content />
    </PlaylistProvider>
  )
}

const Content = () => {
  const {
    playerRef,
    currentPlaylist,
    currentTrackIndex,
    currentTime,
    isPlaying,
    handlePlayerStateChange,
    handlePlayerError,
  } = usePlaylist()

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  const [showCoachmark, setShowCoachmark] = useState(false)
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenDiscoverCoachmark')
    if (!seen) setShowCoachmark(true)
  }, [])

  const handleCloseCoachmark = () => {
    localStorage.setItem('hasSeenDiscoverCoachmark', 'true')
    setShowCoachmark(false)
  }

  const [isMuted, setIsMuted] = useState<boolean | null>(null)

  return (
    <Page>
      {showCoachmark && <DiscoverCoachMark onClose={handleCloseCoachmark} />}
      <Outlet context={{ isMuted, setIsMuted }} />

      {videoId && (
        <YoutubePlayer
          videoId={videoId}
          onReady={(event) => {
            playerRef.current = event.target
            playerRef.current?.seekTo(currentTime, true)
            if (!isPlaying) playerRef.current?.pauseVideo()
          }}
          onStateChange={handlePlayerStateChange}
          setIsMuted={setIsMuted}
          onError={handlePlayerError}
        />
      )}
    </Page>
  )
}

export default DiscoverLayout

const Page = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
