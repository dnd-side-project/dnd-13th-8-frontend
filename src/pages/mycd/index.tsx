import { useRef, useEffect, useCallback, useState } from 'react'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { useMyRepresentativePlaylist } from '@/entities/playlist/model/useMyPlaylist'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getVideoId } from '@/shared/lib'
import { PlaylistLayout, YoutubePlayer } from '@/widgets/playlist'

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
  const [isMuted, setIsMuted] = useState<boolean | null>(null) // TODO : 모바일 대응용 버튼으로 수정
  const { userInfo } = useAuthStore()

  const { data: playlistData } = useMyRepresentativePlaylist()

  useEffect(() => {
    if (!currentPlaylist && playlistData && userInfo) {
      const { playlistId, playlistName, songs, genre } = playlistData // 필수 값 체크

      if (playlistId && playlistName && songs) {
        const convertedPlaylist = {
          creator: {
            creatorId: userInfo.userId,
            creatorNickname: userInfo.username,
          },
          playlistId,
          playlistName,
          genre,
          songs,
          representative: false,
          cdItems: playlistData.onlyCdResponse?.cdItems || [],
        }

        setPlaylist(convertedPlaylist, currentTrackIndex, currentTime)
      }
    }
  }, [currentPlaylist, playlistData, userInfo, setPlaylist, currentTrackIndex, currentTime])

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
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  // 재생, 일시정지
  useEffect(() => {
    if (!playerRef.current) return
    if (isPlaying) playerRef.current.playVideo()
    else playerRef.current.pauseVideo()
  }, [isPlaying])

  const handlePlayPause = () => {
    if (isPlaying) pause()
    else play()
  }

  const isCurrentlyPlaying = (() => {
    if (!window.YT || !playerRef.current) return false
    return isPlaying && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING
  })()

  return (
    <div>
      {currentPlaylist && (
        <PlaylistLayout
          data={currentPlaylist}
          currentPlaylist={currentPlaylist}
          currentTrackIndex={currentTrackIndex}
          currentTime={currentTime}
          isPlaying={isCurrentlyPlaying}
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
