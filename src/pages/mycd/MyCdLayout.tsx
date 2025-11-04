import { Outlet } from 'react-router-dom'

import PlaylistProvider, { usePlaylist } from '@/app/providers/PlayerProvider'
import { getVideoId } from '@/shared/lib'
import { YoutubePlayer } from '@/widgets/playlist'

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
  } = usePlaylist()

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
            if (isPlaying) playerRef.current?.playVideo()
            else playerRef.current?.pauseVideo()
          }}
          onStateChange={handlePlayerStateChange}
        />
      )}
    </>
  )
}
export default MyCdLayout
