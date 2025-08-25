import { useRef, useEffect, useCallback } from 'react'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { getVideoId } from '@/shared/lib'
import { PlaylistLayout, YoutubePlayer } from '@/widgets/playlist'

import playlistData from './myPlaylist.json'

const MyCdPage = () => {
  const {
    setPlaylist,
    isPlaying,
    currentPlaylist,
    currentTrackIndex,
    nextTrack,
    prevTrack,
    play,
    pause,
    currentTime,
    updateCurrentTime,
  } = usePlaylist()
  const playerRef = useRef<YT.Player | null>(null)

  useEffect(() => {
    if (!currentPlaylist) {
      // 기존 currentTime이 있으면 그대로 사용
      setPlaylist(playlistData, currentTrackIndex, currentTime)
    }
  }, [currentPlaylist, setPlaylist, currentTrackIndex, currentTime])

  // 현재 재생 시간 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerRef.current) {
        updateCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [updateCurrentTime])

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) playerRef.current.playVideo()
      else playerRef.current.pauseVideo()
    }
  }, [isPlaying])

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) nextTrack()
    },
    [nextTrack]
  )

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.tracks[currentTrackIndex]?.link)
    : null

  const handlePlayPause = () => {
    if (isPlaying) pause()
    else play()
  }

  return (
    <div>
      {currentPlaylist && (
        <PlaylistLayout
          data={currentPlaylist}
          currentPlaylist={currentPlaylist}
          currentTrackIndex={currentTrackIndex}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={nextTrack}
          onPrev={prevTrack}
          onSelectTrack={(trackIndex, time) => {
            setPlaylist(currentPlaylist, trackIndex, time)
            if (time !== undefined) playerRef.current?.seekTo(time, true)
            if (!isPlaying) play()
          }}
          type="My"
        />
      )}

      {videoId && (
        <YoutubePlayer
          key="my-cd"
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
    </div>
  )
}

export default MyCdPage
