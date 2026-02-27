import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled, { keyframes, css } from 'styled-components'

import type { PlaylistDetail } from '@/entities/playlist'
import { FollowButton } from '@/features/follow'
import { useDevice } from '@/shared/lib/useDevice'
import { flexColCenter } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo, Profile } from '@/shared/ui'
import { ActionBar, PlayButton, ProgressBar } from '@/widgets/playlist'

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
  setIsMuted?: React.Dispatch<React.SetStateAction<boolean | null>>
}

const PlaylistLayout = ({
  currentPlaylist,
  currentTrackIndex,
  isPlaying,
  onPlayPause,
  onSelectTrack,
}: PlaylistSlideProps) => {
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)

  const navigate = useNavigate()
  const { isMobile } = useDevice()

  const title = currentPlaylist?.playlistName ?? ''
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    setIsOverflow(el.scrollWidth > el.clientWidth)
  }, [title])

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
            <Cd
              variant="xxl"
              bgColor="none"
              stickers={currentPlaylist?.cdResponse?.cdItems ?? []}
            />
          </CdSpinner>
        </CdContainer>
        <ActionBarContainer $isMobile={isMobile}>
          <ActionBar
            playlistId={currentPlaylist?.playlistId ?? 0}
            creatorId={currentPlaylist?.creatorId ?? ''}
            stickers={currentPlaylist?.cdResponse?.cdItems ?? []}
            type="DISCOVER"
          />
        </ActionBarContainer>
      </Wrapper>
      <CreatorInfo>
        <CreatorButton onClick={() => navigate(`/${currentPlaylist?.creatorId}`)}>
          <Profile size="S" profileUrl={currentPlaylist?.creatorProfileImageUrl} />
          <Creator>{currentPlaylist?.creatorNickname ?? ''}</Creator>
        </CreatorButton>
        <FollowButton isFollowing={false} variant="small" />
      </CreatorInfo>

      <TitleContainer ref={containerRef}>
        <MarqueeTitle $animate={isOverflow}>
          <Title>{title}</Title>
          {isOverflow && <Title aria-hidden>{title}</Title>}
        </MarqueeTitle>
      </TitleContainer>

      <ProgressBarWrapper>
        <ProgressBar
          trackLengths={currentPlaylist?.songs.map((t) => t.youtubeLength) || []}
          currentIndex={currentTrackIndex}
          onClick={handleProgressClick}
        />
      </ProgressBarWrapper>
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
  animation: spin 40s linear infinite;
  animation-play-state: ${(props) => (props.$isPlaying ? 'running' : 'paused')};
  transform-origin: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const TitleContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 10px;
  position: relative;
`

const marqueeAnim = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

const MarqueeTitle = styled.div<{
  $animate: boolean
}>`
  display: flex;
  width: max-content;

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${marqueeAnim} 20s linear infinite;
    `}
`

const Title = styled.span`
  ${({ theme }) => theme.FONT.headline1};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  flex-shrink: 0;
  margin-right: 8px;
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
