import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/model/types'
import CommentMockData from '@/pages/discoverPage/commentData.json'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatBottomSheet, ChatInput } from '@/widgets/chat'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

interface PlaylistLayoutProps {
  playlistData: PlaylistData
  isOwner?: boolean
  listenerNum: number
  isOnAir: boolean
}

const PlaylistLayout = ({
  playlistData,
  isOwner = false,
  listenerNum,
  isOnAir,
}: PlaylistLayoutProps) => {
  const navigate = useNavigate()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const [currentTrackIndex] = useState(0)
  const [currentTime] = useState(0)

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
