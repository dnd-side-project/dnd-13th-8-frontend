import { useEffect, useCallback, useState } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { ChatProvider } from '@/app/providers/ChatProvider'
import { usePlaylist } from '@/app/providers/PlayerProvider'
import type { CdMetaResponse, PlaylistDetail } from '@/entities/playlist'
import { SwipeCarousel } from '@/features/swipe'
import { useDevice, useMarquee } from '@/shared/lib'
import { cdSpinner, flexRowCenter, marquee } from '@/shared/styles/mixins'
import { LiveInfo, Cd } from '@/shared/ui'
import { ActionBar, ControlBar, ProgressBar, VolumeButton } from '@/widgets/playlist'

interface PlaylistCarouselProps {
  playlistData: CdMetaResponse
  playlistDetail: PlaylistDetail
  showCreator?: boolean
  basePath: string
  onCenterChange: (playlist: { playlistId: number }) => void
}

interface OutletContextType {
  playerRef: React.RefObject<YT.Player | null>
}

const PlaylistCarousel = ({
  playlistData,
  playlistDetail,
  showCreator = true,
  basePath,
  onCenterChange,
}: PlaylistCarouselProps) => {
  const { id: playlistId } = useParams()
  const { isMobile } = useDevice()
  const { playerRef } = useOutletContext<OutletContextType>()
  const navigate = useNavigate()

  const isSmall = isMobile && window.innerHeight < 633
  const [activeIndex, setActiveIndex] = useState(0)

  const {
    setPlaylist,
    isPlaying,
    currentPlaylist,
    currentTrackIndex,
    nextTrack,
    prevTrack,
    play,
    pause,
    updateCurrentTime,
    isMuted,
    setIsMuted,
  } = usePlaylist()

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
  } = useMarquee(playlistDetail.playlistName, isPlaying)

  useEffect(() => {
    if (!playlistId || !playlistData.length) return
    const index = playlistData.findIndex((p) => p.playlistId === Number(playlistId))
    if (index >= 0) setActiveIndex(index)
  }, [playlistId, playlistData])

  useEffect(() => {
    if (!playlistDetail) return
    if (currentPlaylist?.playlistId === playlistDetail.playlistId) return
    setPlaylist(playlistDetail, 0, 0)
  }, [playlistDetail, currentPlaylist, setPlaylist])

  const handleSelectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index)
      const center = playlistData[index]
      if (center) {
        onCenterChange({
          playlistId: center.playlistId,
        })
      }
    },
    [playlistData, onCenterChange]
  )

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      if (!currentPlaylist) return

      const isSameTrack = currentTrackIndex === trackIndex

      if (isSameTrack) {
        updateCurrentTime(seconds)
        if (playerRef.current) {
          playerRef.current.seekTo(seconds, true)
        }
      } else {
        setPlaylist(currentPlaylist, trackIndex, seconds)
      }

      if (!isPlaying) play()
    },
    [currentPlaylist, currentTrackIndex, updateCurrentTime, playerRef, setPlaylist, isPlaying, play]
  )

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  if (!currentPlaylist || !playlistData.length) return null

  return (
    <ChatProvider roomId={String(currentPlaylist.playlistId)}>
      <Container>
        <LiveInfo />
      </Container>

      <CenterWrapper>
        <SwipeCarousel
          key={playlistDetail.playlistId}
          data={playlistData}
          onSelectIndexChange={handleSelectIndex}
          axis="x"
          basePath={basePath}
        >
          {playlistData.map((slide, index) => (
            <EmblaSlide key={slide.playlistId} $isMobile={isMobile}>
              <Slide $active={activeIndex === index} $isMobile={isMobile}>
                <CdSpinner
                  $isPlaying={slide.playlistId === currentPlaylist.playlistId && isPlaying}
                >
                  <Cd
                    variant={isSmall ? 'customize' : isMobile ? 'mycd_mo' : 'mycd'}
                    bgColor="none"
                    stickers={slide.cdResponse?.cdItems || []}
                  />
                </CdSpinner>
              </Slide>
            </EmblaSlide>
          ))}
        </SwipeCarousel>
        <ActionBar
          playlistData={playlistData}
          activeIndex={activeIndex}
          playlistId={playlistDetail.playlistId}
          creatorId={currentPlaylist.creatorId}
          stickers={playlistDetail.cdResponse?.cdItems || []}
          type="MY"
        />

        <TitleWrapper $isMobile={isMobile} $hasPrivate={!playlistDetail?.isPublic}>
          {!playlistDetail?.isPublic && <PrivateLabel>비공개</PrivateLabel>}

          <Title
            ref={titleRef}
            $isMobile={isMobile}
            $isOverflow={isOverflow}
            $isHovered={isHovered}
            $isAutoRunning={isAutoRunning}
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
            onTouchStart={handleTitleTouchStart}
            onTouchEnd={handleTitleTouchEnd}
            onAnimationEnd={handleAnimationEnd}
          >
            {playlistDetail.playlistName}
          </Title>

          {showCreator && (
            <Creator
              type="button"
              disabled={!showCreator || !playlistDetail.creatorShareCode}
              onClick={() => navigate(`/${playlistDetail.creatorShareCode}`)}
            >
              {playlistDetail.creatorNickname}
            </Creator>
          )}
        </TitleWrapper>

        <BottomWrapper>
          <ProgressBar
            trackLengths={currentPlaylist.songs.map((t) => t.youtubeLength) || []}
            currentIndex={currentTrackIndex}
            onClick={handleProgressClick}
          />
          <ControlBar
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={nextTrack}
            onPrev={prevTrack}
          />
        </BottomWrapper>

        {isMuted && setIsMuted && (
          <VolumeButtonWrapper>
            <VolumeButton playerRef={playerRef} isMuted={isMuted} setIsMuted={setIsMuted} />
          </VolumeButtonWrapper>
        )}
      </CenterWrapper>
    </ChatProvider>
  )
}

export default PlaylistCarousel

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
`

const EmblaSlide = styled.div<{ $isMobile?: boolean }>`
  flex: 0 0 50%;
  ${flexRowCenter}
  padding: ${({ $isMobile }) => ($isMobile ? '0 0 16px 0' : '16px 0 48px 0')};
`

const Slide = styled.div<{ $active?: boolean; $isMobile?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: ${({ $isMobile }) => ($isMobile ? '0 12px' : '0 24px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

const CdSpinner = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  ${cdSpinner}
`

const TitleWrapper = styled.div<{
  $isMobile?: boolean
  $hasPrivate?: boolean
}>`
  padding-top: ${({ $isMobile, $hasPrivate }) =>
    $isMobile ? ($hasPrivate ? '16px' : '28px') : '60px'};
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`

const Title = styled.p<{
  $isMobile?: boolean
  $isOverflow?: boolean
  $isAutoRunning?: boolean
  $isHovered?: boolean
}>`
  ${({ theme }) => theme.FONT.headline1};

  ${marquee}
`

const Creator = styled.button`
  width: fit-content;
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-300']};
  margin-top: 2px;
  text-align: left;
`

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0;
  @media (min-height: 899px) {
    margin-top: 80px;
  }
`

const BottomWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PrivateLabel = styled.span`
  padding: 4px 8px;
  width: fit-content;
  margin-bottom: 8px;
  ${({ theme }) => theme.FONT.caption1};
  color: ${({ theme }) => theme.COLOR['gray-300']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 99px;
`

const VolumeButtonWrapper = styled.div`
  position: absolute;
  top: 62px;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`
