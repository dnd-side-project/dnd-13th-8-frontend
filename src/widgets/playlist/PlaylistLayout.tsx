import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/types/playlist'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ActionBar, ProgressBar } from '@/widgets/playlist'
import ControlBar from '@/widgets/playlist/ControlBar'

interface PlaylistSlideProps {
  data: PlaylistData
  currentPlaylist: PlaylistData | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  onSelectTrack: (trackIndex: number, time?: number) => void
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
  type = 'Discover',
}: PlaylistSlideProps) => {
  const navigate = useNavigate()
  // 누적 시간 계산
  const accumulatedTime = useMemo(() => {
    if (!currentPlaylist) return 0
    return (
      currentPlaylist.tracks
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
            <span>{data.title}</span>
            <span>{currentPlaylist?.tracks[currentTrackIndex]?.title}</span>
          </>
        }
      />
      <Container>
        <LiveInfo isOnAir={data.isOnAir} listenerCount={data.listeners} isOwner={false} />

        {type === 'My' && (
          <Button size="S" state="primary" onClick={() => navigate('/mypage/customize')}>
            꾸미기
          </Button>
        )}
      </Container>
      <Wrapper>
        <Cd variant="xxl" bgColor="none" />
        <ActionBar
          playlistId={data.id}
          isFollowing={false}
          userId={data.userId}
          userName={data.username}
          showFollow={type !== 'My'}
        />
      </Wrapper>

      <ProgressBar
        trackLengths={currentPlaylist?.tracks.map((t) => t.youtubeLength) || []}
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
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
