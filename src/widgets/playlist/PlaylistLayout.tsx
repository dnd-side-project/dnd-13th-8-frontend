import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistInfo } from '@/entities/playlist'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { useFollowStatus } from '@/features/follow/model/useFollow'
import { getTrackOrderLabel } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ActionBar, ProgressBar } from '@/widgets/playlist'
import ControlBar from '@/widgets/playlist/ControlBar'
import VolumeButton from '@/widgets/playlist/VolumeButton'

interface PlaylistSlideProps {
  data: PlaylistInfo
  currentPlaylist: PlaylistInfo | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  onSelectTrack: (trackIndex: number, time?: number) => void
  playerRef: React.RefObject<YT.Player | null>
  isMuted: boolean | null
  setIsMuted: React.Dispatch<React.SetStateAction<boolean | null>>
  type?: 'My' | 'Discover'
}

const PlaylistLayout = ({
  data,
  currentPlaylist,
  currentTrackIndex,
  currentTime,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onSelectTrack,
  playerRef,
  isMuted,
  setIsMuted,
  type = 'Discover',
}: PlaylistSlideProps) => {
  const navigate = useNavigate()
  const isActive = currentPlaylist?.playlistId === data.playlistId
  const { participantCount: listenersNum } = useChatSocket(isActive ? String(data.playlistId) : '')
  const { data: isFollowing } = useFollowStatus(data.playlistId, {
    enabled: currentPlaylist?.playlistId === data.playlistId, // active playlist만 호출
  })

  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

  // 누적 시간 계산
  const accumulatedTime = useMemo(() => {
    if (!currentPlaylist) return 0
    return (
      currentPlaylist.songs
        .slice(0, currentTrackIndex)
        .reduce((acc, track) => acc + track.youtubeLength, 0) + currentTime
    )
  }, [currentPlaylist, currentTrackIndex, currentTime])

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      onSelectTrack(trackIndex, seconds)
    },
    [onSelectTrack]
  )

  return (
    <>
      <Header
        center={
          <>
            <span>{data.playlistName}</span>
            <span>{getTrackOrderLabel(Number(currentTrackIndex))}</span>
          </>
        }
      />
      <Container>
        <LiveInfo isOnAir={listenersNum > 0} listenerCount={listenersNum} isOwner={false} />
        {type === 'My' && (
          <Button size="S" state="primary" onClick={() => navigate('/mypage/customize')}>
            꾸미기
          </Button>
        )}
      </Container>
      <Wrapper>
        <CdWrapper>
          {isMobile && (
            <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
          )}
          <Cd variant="xxl" bgColor="none" stickers={data?.cdItems} />
        </CdWrapper>
        <ActionBar
          playlistId={data.playlistId}
          isFollowing={!!isFollowing}
          userName={data.creator.creatorNickname}
          showFollow={type !== 'My'}
        />
      </Wrapper>

      <ProgressBar
        trackLengths={currentPlaylist?.songs.map((t) => t.youtubeLength) || []}
        currentTime={accumulatedTime}
        onClick={handleProgressClick}
      />

      <ControlBar
        isPlaying={isPlaying}
        onTogglePlay={onPlayPause}
        onNext={onNext}
        onPrev={onPrev}
      />
    </>
  )
}

export default PlaylistLayout

const Wrapper = styled.div`
  ${flexColCenter}
  padding: 16px 0;
  gap: 24px;
  position: relative;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const CdWrapper = styled.div`
  position: relative;
`
