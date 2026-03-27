import { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

import PlaylistProvider, { usePlaylist } from '@/app/providers/PlayerProvider'
import type { BundleInfo } from '@/entities/bundle'
import { getVideoId } from '@/shared/lib'
import { YoutubePlayer } from '@/widgets/playlist'

const PlayerLayout = () => {
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
  const [isMuted, setIsMuted] = useState<boolean | null>(null)
  const bundleInfo = useOutletContext<BundleInfo>()

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  return (
    <>
      <Outlet context={{ ...bundleInfo, isMuted, setIsMuted, playerRef }} />

      {videoId && (
        <YoutubePlayer
          videoId={videoId}
          onReady={(event) => {
            playerRef.current = event.target
            if (currentPlaylist) {
              if (currentTime !== undefined) playerRef.current.seekTo(currentTime, true)
              if (isPlaying) playerRef.current.playVideo()
              else playerRef.current.pauseVideo()
            }
            if (setIsMuted) setIsMuted(event.target.isMuted())
          }}
          onStateChange={handlePlayerStateChange}
          onError={handlePlayerError}
        />
      )}
    </>
  )
}

export default PlayerLayout
