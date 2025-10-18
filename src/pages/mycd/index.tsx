import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { MemberCharacter } from '@/assets/images'
import { useMyRepresentativePlaylist } from '@/entities/playlist/model/useMyCd'
import { useAuthStore } from '@/features/auth/store/authStore'
import { BUTTON_TEXT } from '@/pages/home/config/messages'
import { getVideoId } from '@/shared/lib'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button } from '@/shared/ui'
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
    playerRef,
  } = usePlaylist()
  const [isMuted, setIsMuted] = useState<boolean | null>(null)
  const { userInfo } = useAuthStore()
  const navigate = useNavigate()

  const { data: playlistData, isError } = useMyRepresentativePlaylist()

  useEffect(() => {
    if (!currentPlaylist && playlistData && userInfo) {
      const convertedPlaylist = {
        creator: {
          creatorId: userInfo.userId,
          creatorNickname: userInfo.username,
        },
        playlistId: playlistData.playlistId,
        playlistName: playlistData.playlistName,
        genre: playlistData.genre,
        songs: playlistData.songs,
        representative: false,
        cdItems: playlistData.onlyCdResponse?.cdItems || [],
      }

      setPlaylist(convertedPlaylist, currentTrackIndex, currentTime)
    }
  }, [currentPlaylist, playlistData, userInfo, setPlaylist, currentTrackIndex, currentTime])

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) nextTrack()
    },
    [nextTrack]
  )

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  const isCurrentlyPlaying = (() => {
    if (!window.YT || !playerRef.current) return false
    return isPlaying && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING
  })()

  if (isError) {
    return (
      <ErrorContainer>
        <img src={MemberCharacter} alt="Guest Character" width={160} height={160} />

        <Button size="S" state="primary" onClick={() => navigate('/mypage/customize')}>
          {BUTTON_TEXT.MEMBER}
        </Button>
      </ErrorContainer>
    )
  }

  return (
    <div>
      {currentPlaylist && (
        <PlaylistLayout
          data={currentPlaylist}
          currentPlaylist={currentPlaylist}
          currentTrackIndex={currentTrackIndex}
          currentTime={currentTime}
          isPlaying={isCurrentlyPlaying}
          onPlayPause={() => (isPlaying ? pause() : play())}
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

const ErrorContainer = styled.div`
  ${flexColCenter}
  height: 100dvh;
  gap: 12px;
`
