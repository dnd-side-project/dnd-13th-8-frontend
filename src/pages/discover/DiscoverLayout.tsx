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
    isMuted,
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

  return (
    <Page>
      {showCoachmark && <DiscoverCoachMark onClose={handleCloseCoachmark} />}
      <Outlet />

      {videoId && (
        <YoutubePlayer
          videoId={videoId}
          startSeconds={currentTime}
          isMuted={isMuted}
          currentTrackIndex={currentTrackIndex}
          onReady={(event) => {
            playerRef.current = event.target
            if (!isPlaying) playerRef.current?.pauseVideo()
          }}
          onStateChange={handlePlayerStateChange}
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
