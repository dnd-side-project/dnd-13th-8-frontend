import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'

import PlaylistProvider, { usePlaylist } from '@/app/providers/PlayerProvider'
import { DiscoverCoachMark } from '@/pages/discover/ui'
import { getVideoId } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { YoutubePlayer, VolumeButton } from '@/widgets/playlist'

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
  } = usePlaylist()

  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

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
      <Outlet />

      {videoId && (
        <YoutubePlayer
          videoId={videoId}
          onReady={(event) => {
            playerRef.current = event.target
            playerRef.current?.seekTo(currentTime, true)
            if (!isPlaying) playerRef.current?.pauseVideo()

            if (isMobile) {
              setIsMuted(event.target.isMuted())
            }
          }}
          onStateChange={handlePlayerStateChange}
          setIsMuted={setIsMuted}
        />
      )}

      {isMobile && isMuted && (
        <ButtonWrapper>
          <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
        </ButtonWrapper>
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

const ButtonWrapper = styled.div`
  position: absolute;
  top: 62px;
  z-index: 999; // TODO: 레이어 정리 후 theme z-index 리팩토링 필요
`
