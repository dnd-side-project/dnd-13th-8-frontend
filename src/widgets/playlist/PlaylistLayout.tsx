import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/model/types'
import CommentMockData from '@/pages/discoverPage/commentData.json'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatBottomSheet, ChatInput } from '@/widgets/chat'
import { ActionBar, BackgroundPlayer, ControlBar, ProgressBar } from '@/widgets/playlist'

interface PlaylistLayoutProps {
  playlistData: PlaylistData
  isOwner?: boolean
  listenerNum: number
  isOnAir: boolean
  isActive: boolean
}

const PlaylistLayout = ({
  playlistData,
  isOwner = false,
  listenerNum,
  isOnAir,
  isActive,
}: PlaylistLayoutProps) => {
  const navigate = useNavigate()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  // const trackLengths = playlistData.tracks.map((t) => t.duration)
  // const totalTime = trackLengths.reduce((sum, t) => sum + t, 0)

  const [currentTrackIndex] = useState(0)
  const [currentTime] = useState(0)
  // const [isPlaying, setIsPlaying] = useState(false)

  // const togglePlayPause = () => setIsPlaying((prev) => !prev)
  // const playPrevTrack = () => setCurrentTrackIndex((i) => Math.max(i - 1, 0))
  // const playNextTrack = () =>
  //   setCurrentTrackIndex((i) => Math.min(i + 1, playlistData.tracks.length - 1))
  // const handleSeek = (time: number) => setCurrentTime(time)

  return (
    <div>
      <Header
        center={
          <>
            <span>{playlistData.title}</span>
            <span>{playlistData.tracks[0].title}</span>
          </>
        }
      />

      <Container>
        <LiveInfo isOnAir={isOnAir} listenerCount={listenerNum} isOwner={isOwner} />

        {isOwner && (
          <Button size="S" state="primary" onClick={() => navigate('/customize')}>
            꾸미기
          </Button>
        )}
      </Container>
      <Wrapper>
        {isActive && (
          <BackgroundPlayer
            playlistId={playlistData.id}
            link={playlistData.tracks[currentTrackIndex].link}
          />
        )}
        <Cd variant="xxl" bgColor="none" />
        <ActionBar playlistId={Number(playlistData.id)} isLiked={playlistData.liked} />
      </Wrapper>
      <ProgressBar
        currentTime={currentTime}
        duration={playlistData.tracks[currentTrackIndex].duration}
        trackLengths={playlistData.tracks.map((t) => t.duration)}
      />
      <ControlBar />

      <ChatInput onFocus={() => setIsBottomSheetOpen(true)} />

      {isBottomSheetOpen && (
        <ChatBottomSheet
          comments={CommentMockData}
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
        />
      )}
    </div>
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
