import styled from 'styled-components'

import { flexColCenter } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatInput } from '@/widgets/chat'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

const DiscoverPage = () => {
  const trackLengths = playlist.tracks.map((t) => t.duration)
  const totalTime = trackLengths.reduce((sum, t) => sum + t, 0)

  // TODO: 실제 전송 로직으로 교체
  const handleSendMessage = () => {}

  return (
    <div>
      <Header
        center={
          <>
            <span>{playlist.title}</span>
            <span>{playlist.tracks[0].title}</span>
            {/* TODO: 실제 재생 중 인덱스의 타이틀로 표시 */}
          </>
        }
      />

      <LiveInfo isOnAir listenerCount={550} />
      <Wrapper>
        <Cd variant="xxl" bgColor="none" />
        <ActionBar playlistId={playlist.id} />
      </Wrapper>
      <ProgressBar currentTime={300} duration={totalTime} trackLengths={trackLengths} />
      <ControlBar />
      <ChatInput onSend={handleSendMessage} openBottomSheetOnFocus />
    </div>
  )
}

export default DiscoverPage

const Wrapper = styled.div`
  ${flexColCenter}
  padding: 16px 0;
  gap: 24px;
`

// mock data
const playlist = {
  id: 3232,
  title: '플레이리스트명',
  tracks: [
    { title: '첫 번째 곡', duration: 180 },
    { title: '두 번째 곡', duration: 240 },
    { title: '세 번째 곡', duration: 10 },
    { title: '네 번째 곡', duration: 150 },
    { title: '다섯 번째 곡', duration: 210 },
  ],
}
