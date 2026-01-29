import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'

import PlaylistProvider, { usePlaylist } from '@/app/providers/PlayerProvider'
import { getVideoId } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { VolumeButton, YoutubePlayer } from '@/widgets/playlist'

const MyCdLayout = () => {
  return (
    <PlaylistProvider key="my-cd">
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
  const [isMuted, setIsMuted] = useState<boolean | null>(null)
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  return (
    <>
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
          onError={handlePlayerError}
        />
      )}

      {isMobile && isMuted && currentTrackIndex !== 0 && (
        <ButtonWrapper>
          <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
        </ButtonWrapper>
      )}
    </>
  )
}
export default MyCdLayout

const ButtonWrapper = styled.div`
  position: absolute;
  top: 62px;
  z-index: 999; // TODO: 레이어 정리 후 theme z-index 리팩토링 필요
`
