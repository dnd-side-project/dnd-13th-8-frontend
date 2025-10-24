import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { MemberCharacter } from '@/assets/images'
import { usePlaylistDetail } from '@/entities/playlist'
import { useMyCdList, useMyLikedCdList } from '@/entities/playlist/model/useMyCd'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { HeaderTab, PlaylistCarousel } from '@/pages/mycd/ui'
import { getVideoId } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Button, LiveInfo } from '@/shared/ui'
import { ActionBar, ControlBar, ProgressBar, VolumeButton, YoutubePlayer } from '@/widgets/playlist'

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
  const [selectedTab, setSelectedTab] = useState<'MY' | 'LIKE'>('MY')
  const { userInfo } = useAuthStore()
  const navigate = useNavigate()
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  const handleTabSelect = (tab: 'MY' | 'LIKE') => {
    setSelectedTab(tab)
  }

  const myCdPlaylist = useMyCdList('RECENT')
  const likedCdPlaylist = useMyLikedCdList('RECENT')

  const playlistQuery = selectedTab === 'MY' ? myCdPlaylist : likedCdPlaylist
  const playlistData = playlistQuery.data
  const isError = playlistQuery.isError

  const [centerPlaylist, setCenterPlaylist] = useState<{
    playlistId: number | null
    playlistName: string
  }>({ playlistId: null, playlistName: '' })

  useEffect(() => {
    if (playlistData && playlistData.length > 0 && centerPlaylist.playlistId === null) {
      const first = playlistData[0]
      setCenterPlaylist({
        playlistId: first.playlistId,
        playlistName: first.playlistName,
      })
    }
  }, [playlistData, centerPlaylist.playlistId])

  // LoopCarousel 센터 컨텐츠 변경 핸들러
  const handleCenterChange = useCallback(
    (playlist: { playlistId: number; playlistName: string }) => {
      if (playlist) {
        setCenterPlaylist({
          playlistId: playlist.playlistId,
          playlistName: playlist.playlistName,
        })
      }
    },
    []
  )

  const { data: playlistDetail } = usePlaylistDetail(centerPlaylist.playlistId)

  useEffect(() => {
    if (playlistDetail && userInfo) {
      // 이미 같은 playlist면 재설정 안함
      if (currentPlaylist?.playlistId === playlistDetail.playlistId) return

      const convertedPlaylist = {
        creator: {
          creatorId: userInfo.userId,
          creatorNickname: userInfo.username,
        },
        playlistId: playlistDetail.playlistId,
        playlistName: playlistDetail.playlistName,
        genre: playlistDetail.genre,
        songs: playlistDetail.songs,
        representative: false,
        cdItems: playlistDetail.cdResponse?.cdItems || [],
      }

      setPlaylist(convertedPlaylist, 0, 0)
    }
  }, [playlistDetail, userInfo, setPlaylist, currentPlaylist])

  const isActive = currentPlaylist?.playlistId === playlistDetail?.playlistId
  const { participantCount: listenersNum } = useChatSocket(
    isActive && centerPlaylist.playlistId ? String(centerPlaylist.playlistId) : ''
  )

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) nextTrack()
    },
    [nextTrack]
  )

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      if (!currentPlaylist) return
      setPlaylist(currentPlaylist, trackIndex, seconds)
      if (seconds !== undefined) playerRef.current?.seekTo(seconds, true)
      if (!isPlaying) play()
    },
    [currentPlaylist, setPlaylist, playerRef, isPlaying, play]
  )

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  if (isError) {
    navigate('/error')
    return null
  }

  const isEmpty = playlistData && playlistData.length === 0

  if (isEmpty) {
    return (
      <ViewContainer>
        <img src={MemberCharacter} alt="Guest Character" width={160} height={160} />
        <NavigateBtn onClick={() => navigate('/mypage/customize')}>
          새로운 CD에 취향 담기
        </NavigateBtn>
      </ViewContainer>
    )
  }

  return (
    <div>
      {currentPlaylist && (
        <>
          <HeaderTab selectedTab={selectedTab} onSelect={handleTabSelect} />
          <Container>
            {isMobile && isMuted && (
              <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
            )}
            <LiveInfo isOnAir={listenersNum > 0} listenerCount={listenersNum} isOwner={false} />
            {selectedTab === 'MY' && (
              <Button
                size="S"
                state="primary"
                onClick={() =>
                  navigate(`/mypage/customize?playlistId=${currentPlaylist?.playlistId}`)
                }
              >
                편집
              </Button>
            )}
          </Container>

          <PlaylistCarousel data={playlistData ?? []} onCenterChange={handleCenterChange} />

          <ActionBar
            playlistId={centerPlaylist.playlistId ?? 0}
            creatorId={currentPlaylist.creator.creatorId}
            stickers={playlistDetail?.cdResponse?.cdItems || []}
            type="MY"
            selectedTab={selectedTab}
          />

          <Title>{centerPlaylist.playlistName}</Title>

          <BottomWrapper>
            <ProgressBar
              trackLengths={currentPlaylist.songs.map((t) => t.youtubeLength) || []}
              currentIndex={currentTrackIndex}
              onClick={handleProgressClick}
            />

            <ControlBar
              isPlaying={isPlaying}
              onTogglePlay={isPlaying ? pause : play}
              onNext={nextTrack}
              onPrev={prevTrack}
            />
          </BottomWrapper>
        </>
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

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
`

const Title = styled.p`
  ${({ theme }) => theme.FONT.headline1};
  padding-top: 40px;
`

const BottomWrapper = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const ViewContainer = styled.div`
  ${flexColCenter}
  height: 100%;
  gap: 16px;
`

const NavigateBtn = styled.button`
  ${flexRowCenter}
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 99px;
  color: ${({ theme }) => theme.COLOR['gray-800']};
  padding: 6px 20px;
  height: 32px;
  ${({ theme }) => theme.FONT['body2-normal']};
`
