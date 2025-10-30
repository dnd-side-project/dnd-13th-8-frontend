import { useEffect, useCallback, useState, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { NoLike } from '@/assets/icons'
import { MemberCharacter } from '@/assets/images'
import { useMyCdActions, useMyCdList, useMyLikedCdList } from '@/entities/playlist/model/useMyCd'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { HeaderTab, PlaylistCarousel } from '@/pages/mycd/ui'
import type { MyCdTab } from '@/pages/mycd/ui/HeaderTab'
import { getVideoId } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Button, LiveInfo, Loading } from '@/shared/ui'
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
  const { userInfo } = useAuthStore()
  const navigate = useNavigate()
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  const { id: routePlaylistId } = useParams<{ id?: string }>()
  const { search } = useLocation()
  const typeParam = new URLSearchParams(search).get('type')
  const [selectedTab, setSelectedTab] = useState<MyCdTab>(typeParam === 'LIKE' ? 'LIKE' : 'MY')

  const myCdPlaylist = useMyCdList('RECENT')
  const likedCdPlaylist = useMyLikedCdList('RECENT')

  const playlistQuery = selectedTab === 'MY' ? myCdPlaylist : likedCdPlaylist
  const playlistData = useMemo(() => playlistQuery.data ?? [], [playlistQuery.data])
  const isLoading = playlistQuery.isLoading
  const isError = playlistQuery.isError
  const isMyEmpty = !myCdPlaylist.isLoading && (myCdPlaylist.data?.length ?? 0) === 0
  const isLikedEmpty = !likedCdPlaylist.isLoading && (likedCdPlaylist.data?.length ?? 0) === 0

  const [centerItem, setCenterItem] = useState<{
    playlistId: number | null
    playlistName: string
  }>({ playlistId: null, playlistName: '' })

  useEffect(() => {
    if (playlistQuery.isLoading || !playlistData) return

    const routeId = routePlaylistId ? Number(routePlaylistId) : null
    const found = routeId ? playlistData.find((p) => p.playlistId === routeId) : null

    if (found) {
      setCenterItem({
        playlistId: found.playlistId,
        playlistName: found.playlistName,
      })
    } else if (playlistData.length > 0) {
      const first = playlistData[0]
      setCenterItem({
        playlistId: first.playlistId,
        playlistName: first.playlistName,
      })

      const path =
        selectedTab === 'LIKE' ? `/mycd/${first.playlistId}?type=LIKE` : `/mycd/${first.playlistId}`

      navigate(path, { replace: true })
    }
  }, [playlistData, playlistQuery.isLoading, routePlaylistId, navigate, selectedTab])

  /* 좋아요 탭 선택 시 url query param 반영 */
  const handleTabSelect = (tab: MyCdTab) => {
    setSelectedTab(tab)

    const basePath = centerItem.playlistId ? `/mycd/${centerItem.playlistId}` : '/mycd'

    const path = tab === 'LIKE' ? `${basePath}?type=LIKE` : basePath

    navigate(path, { replace: true })
  }

  /* 캐러셀 드래그 시 URL 갱신 */
  const handleCenterChange = useCallback(
    (playlist: { playlistId: number; playlistName: string }) => {
      if (playlist) {
        setCenterItem({
          playlistId: playlist.playlistId,
          playlistName: playlist.playlistName,
        })

        const path =
          selectedTab === 'LIKE'
            ? `/mycd/${playlist.playlistId}?type=LIKE`
            : `/mycd/${playlist.playlistId}`

        navigate(path, { replace: true })
      }
    },
    [navigate, selectedTab]
  )

  /* 플레이리스트 세팅 */
  const { tracklist: playlistDetail } = useMyCdActions(Number(centerItem.playlistId), {
    enabled: !!centerItem.playlistId,
  })
  useEffect(() => {
    if (playlistDetail && userInfo) {
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
        isPublic: playlistDetail.isPublic,
        cdItems: playlistDetail.cdResponse?.cdItems || [],
      }

      setPlaylist(convertedPlaylist, 0, 0)
    }
  }, [playlistDetail, userInfo, setPlaylist, currentPlaylist])

  const isActive = currentPlaylist?.playlistId === playlistDetail?.playlistId
  const { participantCount: listenersNum } = useChatSocket(
    isActive && centerItem.playlistId ? String(centerItem.playlistId) : ''
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

  if (isLoading) {
    return <Loading isLoading />
  }

  if (isError) {
    navigate('/error')
    return null
  }

  if (selectedTab === 'MY' && isMyEmpty) {
    return (
      <EmptyPage>
        <HeaderTab selectedTab={selectedTab} onSelect={handleTabSelect} />
        <CenterContent>
          <img src={MemberCharacter} alt="Guest Character" width={160} height={160} />
          <NavigateBtn onClick={() => navigate('/mypage/customize')}>
            새로운 CD에 취향 담기
          </NavigateBtn>
        </CenterContent>
      </EmptyPage>
    )
  }

  if (selectedTab === 'LIKE' && isLikedEmpty) {
    return (
      <EmptyPage>
        <HeaderTab selectedTab={selectedTab} onSelect={handleTabSelect} />
        <CenterContent>
          <NoLike width={160} height={160} />
          <SubText>
            아직 좋아요한 CD가 없어요. <br /> 새로운 음악을 찾아볼까요?
          </SubText>
          <NavigateBtn onClick={() => navigate('/discover')}>둘러보기로 가기</NavigateBtn>
        </CenterContent>
      </EmptyPage>
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
                  navigate(`/mypage/customize`, {
                    state: { cdId: currentPlaylist?.playlistId },
                  })
                }
              >
                편집
              </Button>
            )}
          </Container>
          <PlaylistCarousel data={playlistData ?? []} onCenterChange={handleCenterChange} />
          <ActionBar
            playlistId={centerItem.playlistId ?? 0}
            creatorId={currentPlaylist.creator.creatorId}
            stickers={playlistDetail?.cdResponse?.cdItems || []}
            type="MY"
            selectedTab={selectedTab}
          />
          <Title $isMobile={isMobile}> {centerItem.playlistName}</Title>
          {selectedTab === 'LIKE' && playlistDetail?.creatorNickname && (
            <Creator>{playlistDetail.creatorNickname}</Creator>
          )}

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

const Title = styled.p<{ $isMobile?: boolean }>`
  ${({ theme }) => theme.FONT.headline1};
  padding-top: ${({ $isMobile }) => ($isMobile ? '24px' : '40px')};
`

const BottomWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const NavigateBtn = styled.button`
  ${flexRowCenter}
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 99px;
  color: ${({ theme }) => theme.COLOR['gray-800']};
  padding: 6px 20px;
  height: 32px;
  ${({ theme }) => theme.FONT['body2-normal']};
  margin-top: 16px;
`
const Creator = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const SubText = styled.p`
  ${({ theme }) => theme.FONT['body1-normal']}
  color: ${({ theme }) => theme.COLOR['gray-50']};
`

const EmptyPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
`

const CenterContent = styled.div`
  flex: 1;
  ${flexColCenter};
  text-align: center;
`
