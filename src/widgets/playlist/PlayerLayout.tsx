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
    isMuted,
  } = usePlaylist()
  const bundleInfo = useOutletContext<BundleInfo>()

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  return (
    <>
      <Outlet context={{ ...bundleInfo, playerRef }} />

      {videoId && (
        <YoutubePlayer
          videoId={videoId}
          startSeconds={currentTime}
          isMuted={isMuted}
          currentTrackIndex={currentTrackIndex}
          onReady={(event) => {
            playerRef.current = event.target
            if (!isPlaying) playerRef.current.pauseVideo()
          }}
          onStateChange={handlePlayerStateChange}
          onError={handlePlayerError}
        />
      )}
    </>
  )
}

export default PlayerLayout
