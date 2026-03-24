import { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'

import { ChatProvider } from '@/app/providers/ChatProvider'
import { usePlaylist } from '@/app/providers/PlayerProvider'
import type { CdMetaResponse, PlaylistDetail } from '@/entities/playlist'
import { SwipeCarousel } from '@/features/swipe'
import { useDevice } from '@/shared/lib/useDevice'
import { cdSpinner, flexRowCenter } from '@/shared/styles/mixins'
import { LiveInfo, Cd } from '@/shared/ui'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

interface PlaylistCarouselProps {
  playlistData: CdMetaResponse
  playlistDetail: PlaylistDetail
  basePath: string
  onCenterChange: (playlist: { playlistId: number }) => void
}

const PlaylistCarousel = ({
  playlistData,
  playlistDetail,
  basePath,
  onCenterChange,
}: PlaylistCarouselProps) => {
  const { id: playlistId } = useParams()
  const { isMobile } = useDevice()
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
    playerRef,
    unmuteOnce,
  } = usePlaylist()

  useEffect(() => {
    if (!playlistId || !playlistData.length) return
    const index = playlistData.findIndex((p) => p.playlistId === Number(playlistId))
    if (index >= 0) setActiveIndex(index)
  }, [playlistId, playlistData])

  useEffect(() => {
    if (!playlistDetail) return
    if (currentPlaylist?.playlistId === playlistDetail.playlistId) return
    setPlaylist(playlistDetail, 0, 0, !isMobile)
  }, [playlistDetail, currentPlaylist, isMobile, setPlaylist])

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
      setPlaylist(currentPlaylist, trackIndex, seconds)
      if (!isPlaying) play()
    },
    [currentPlaylist, setPlaylist, playerRef, isPlaying, play]
  )

  const handleTogglePlay = () => {
    if (isMobile && !isPlaying) {
      unmuteOnce()
    }

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

        <TitleWrapper>
          {!playlistDetail?.isPublic && <PrivateLabel>비공개</PrivateLabel>}
          <Title $isMobile={isMobile}>{playlistDetail.playlistName}</Title>
          <Creator>{playlistDetail.creatorNickname}</Creator>
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
  padding: ${({ $isMobile }) => ($isMobile ? '6px 0 0 0' : '16px 0')};
`

const Slide = styled.div<{ $active?: boolean; $isMobile?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: ${({ $isMobile }) => ($isMobile ? '0 24px 16px 24px' : '32px 24px 24px 24px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

const CdSpinner = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  ${cdSpinner}
`

const TitleWrapper = styled.div`
  padding-top: 60px;
`

const Title = styled.p<{ $isMobile?: boolean }>`
  ${({ theme }) => theme.FONT.headline1};
  padding-top: 8px;
  @media (min-height: 899px) {
    padding-top: 56px;
  }
`

const Creator = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-300']};
  margin-top: 2px;
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
  ${({ theme }) => theme.FONT.caption1};
  color: ${({ theme }) => theme.COLOR['gray-300']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 99px;
`
