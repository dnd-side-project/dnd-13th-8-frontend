import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistInfo } from '@/entities/playlist'
import { useChatSocket } from '@/features/chat/model/sendMessage'
import { useDevice } from '@/shared/lib/useDevice'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ActionBar, PlayButton, ProgressBar } from '@/widgets/playlist'

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
  isMuted?: boolean | null
  setIsMuted?: React.Dispatch<React.SetStateAction<boolean | null>>
  type?: 'My' | 'Discover'
}

const PlaylistLayout = ({
  data,
  currentPlaylist,
  currentTrackIndex,
  isPlaying,
  onPlayPause,
  onSelectTrack,
  type = 'Discover',
}: PlaylistSlideProps) => {
  const [showPlayButton, setShowPlayButton] = useState(false)
  const navigate = useNavigate()
  const isActive = currentPlaylist?.playlistId === data.playlistId
  const { participantCount: listenersNum } = useChatSocket(isActive ? String(data.playlistId) : '')

  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'

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
    console.log(duration)
    setTimeout(() => setShowPlayButton(false), duration)
  }

  return (
    <>
      <Overlay onClick={handleOverlayClick} />
      <Header center={<span>둘러보기</span>} />
      <Container>
        <LiveInfo isOnAir={listenersNum > 0} listenerCount={listenersNum} isOwner={false} />
        {type === 'My' && (
          <Button size="S" state="primary" onClick={() => navigate('/mypage/customize')}>
            꾸미기
          </Button>
        )}
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
              stickers={data?.cdResponse?.cdItems ?? data?.cdItems ?? []}
            />
          </CdSpinner>
        </CdContainer>
        <ActionBarContainer $isMobile={isMobile}>
          <ActionBar
            playlistId={data.playlistId}
            creatorId={data.creator.creatorId}
            stickers={data?.cdResponse?.cdItems ?? data?.cdItems ?? []}
            type="DISCOVER"
          />
        </ActionBarContainer>
      </Wrapper>

      <Title>{data.playlistName}</Title>
      <Creator>{data.creator.creatorNickname}</Creator>

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

const Title = styled.p`
  ${({ theme }) => theme.FONT.headline1};
`

const Creator = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-300']};
`
const ActionBarContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: flex-end;
  margin: ${({ $isMobile }) => ($isMobile ? '-105px 0 0 auto' : '-40px 0 0 auto')};
  position: relative;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`

const CdContainer = styled.div`
  position: relative;
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
