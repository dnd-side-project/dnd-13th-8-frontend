import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/model/types'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatInput } from '@/widgets/chat'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

interface PlaylistLayoutProps {
  playlistData: PlaylistData
  isOwner?: boolean
  listenerNum: number
  isOnAir: boolean
  isLiked: boolean
}

const PlaylistLayout = ({
  playlistData,
  isOwner = false,
  listenerNum,
  isOnAir,
}: PlaylistLayoutProps) => {
  const navigate = useNavigate()
  const trackLengths = playlistData.tracks.map((t) => t.duration)
  const totalTime = trackLengths.reduce((sum, t) => sum + t, 0)

  // TODO: 실제 전송 로직으로 교체
  const handleSendMessage = () => {}

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
      <ProgressBar currentTime={300} duration={totalTime} trackLengths={trackLengths} />
      <ControlBar />
      <ChatInput onSend={handleSendMessage} openBottomSheetOnFocus />
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
