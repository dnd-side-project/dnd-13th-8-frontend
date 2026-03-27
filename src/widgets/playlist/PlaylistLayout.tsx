import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistDetail } from '@/entities/playlist'
import { FollowButton } from '@/features/follow'
import { useMarquee } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { cdSpinner, flexColCenter, marquee } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo, Profile } from '@/shared/ui'
import { ActionBar, PlayButton, ProgressBar, VolumeButton } from '@/widgets/playlist'

interface PlaylistSlideProps {
  currentPlaylist: PlaylistDetail | null
  currentTrackIndex: number
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  onSelectTrack: (trackIndex: number, time?: number) => void
  playerRef: React.RefObject<YT.Player | null>
  isMuted?: boolean | null
  setIsMuted?: (value: boolean) => void
}

const PlaylistLayout = ({
  currentPlaylist,
  currentTrackIndex,
  isPlaying,
  onPlayPause,
  onSelectTrack,
  playerRef,
  isMuted,
  setIsMuted,
}: PlaylistSlideProps) => {
  const [showPlayButton, setShowPlayButton] = useState(false)

  const navigate = useNavigate()
  const { isMobile } = useDevice()
  const title = currentPlaylist?.playlistName ?? ''

  const {
    isOverflow,
    isAutoRunning,
    isHovered,
    titleRef,
    handleTitleMouseEnter,
    handleTitleMouseLeave,
    handleAnimationEnd,
    handleTitleTouchStart,
    handleTitleTouchEnd,
  } = useMarquee(title, isPlaying)

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      onSelectTrack(trackIndex, seconds)
    },
    [onSelectTrack]
  )

  const handleOverlayClick = () => {
    onPlayPause()
    setShowPlayButton(true)
    const duration = isPlaying ? 1000 : 2000
    setTimeout(() => setShowPlayButton(false), duration)
  }

  if (!currentPlaylist) return null

  return (
    <>
      <Overlay onClick={handleOverlayClick} />
      <Header center={<span>둘러보기</span>} />
      <Container>
        <LiveInfo />
      </Container>
      <Wrapper>
        <CdContainer>
          {showPlayButton && (
            <PlayButton isPlaying={isPlaying} onPlayPause={onPlayPause} show={showPlayButton} />
          )}
          <CdSpinner $isPlaying={isPlaying}>
            <Cd variant="xxl" bgColor="none" stickers={currentPlaylist.cdResponse.cdItems} />
          </CdSpinner>
        </CdContainer>
        <ActionBarContainer $isMobile={isMobile}>
          <ActionBar
            playlistId={currentPlaylist.playlistId}
            creatorId={currentPlaylist.creatorId}
            stickers={currentPlaylist.cdResponse.cdItems}
            type="DISCOVER"
          />
        </ActionBarContainer>
      </Wrapper>
      <CreatorInfo>
        <CreatorButton
          onClick={() =>
            currentPlaylist.creatorShareCode && navigate(`/${currentPlaylist.creatorShareCode}`)
          }
        >
          <Profile size={32} profileUrl={currentPlaylist.creatorProfileImageUrl} />
          <Creator>{currentPlaylist.creatorNickname}</Creator>
        </CreatorButton>
        <FollowButton variant="small" shareCode={String(currentPlaylist.creatorShareCode)} />
      </CreatorInfo>

      <TitleContainer>
        <Title
          ref={titleRef}
          $isOverflow={isOverflow}
          $isHovered={isHovered}
          $isAutoRunning={isAutoRunning}
          onMouseEnter={handleTitleMouseEnter}
          onMouseLeave={handleTitleMouseLeave}
          onTouchStart={handleTitleTouchStart}
          onTouchEnd={handleTitleTouchEnd}
          onAnimationEnd={handleAnimationEnd}
        >
          {title}
        </Title>
      </TitleContainer>

      <ProgressBarWrapper>
        <ProgressBar
          trackLengths={currentPlaylist.songs.map((t) => t.youtubeLength)}
          currentIndex={currentTrackIndex}
          onClick={handleProgressClick}
        />
      </ProgressBarWrapper>

      {isMuted && setIsMuted && (
        <VolumeButtonWrapper>
          <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
        </VolumeButtonWrapper>
      )}
    </>
  )
}

export default PlaylistLayout

const Wrapper = styled.div`
  ${flexColCenter}
  padding-top: 16px;
  position: relative;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const CdSpinner = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  ${cdSpinner}
`

const TitleContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
  position: relative;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`

const Title = styled.span<{
  $isOverflow?: boolean
  $isHovered?: boolean
  $isAutoRunning?: boolean
}>`
  ${({ theme }) => theme.FONT.headline1};
  color: ${({ theme }) => theme.COLOR['gray-10']};

  ${marquee}
`

const Creator = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-100']};
`

const ActionBarContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: flex-end;
  margin: ${({ $isMobile }) => ($isMobile ? '-105px 0 0 auto' : '-40px 0 0 auto')};
  position: relative;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};

  @media (min-height: 899px) {
    margin: 0 0 0 auto;
  }
`

const CdContainer = styled.div`
  position: relative;

  @media (min-height: 899px) {
    margin-top: 128px;
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.Z_INDEX.overlay};
`

const ProgressBarWrapper = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
  padding-top: 32px;
`

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`

const CreatorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
`

const VolumeButtonWrapper = styled.div`
  position: absolute;
  top: 62px;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`
