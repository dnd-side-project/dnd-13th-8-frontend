import { useRef, useEffect, useCallback, useState } from 'react'

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
  const [isMuted, setIsMuted] = useState<boolean | null>(null) // 빌드용 임시 코드

  useEffect(() => {
    if (!currentPlaylist) {
      // 기존 currentTime이 있으면 그대로 사용
      // setPlaylist(playlistData, currentTrackIndex, currentTime)

      // playlistData를 PlaylistInfo 형식으로 변환 (빌드용 임시 코드)
      const convertedPlaylist = {
        cardId: playlistData.id,
        position: 0,
        shareUrl: '',
        totalTime: '0:00',
        creator: {
          creatorId: playlistData.userId.toString(),
          creatorNickname: playlistData.username,
        },
        playlistId: playlistData.id,
        playlistName: playlistData.title,
        genre: playlistData.genre,
        songs: playlistData.tracks,
        representative: false,
      }

      setPlaylist(convertedPlaylist, currentTrackIndex, currentTime)
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
    ? // ? getVideoId(currentPlaylist.tracks[currentTrackIndex]?.youtubeUrl)
      getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
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
          playerRef={playerRef}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
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
