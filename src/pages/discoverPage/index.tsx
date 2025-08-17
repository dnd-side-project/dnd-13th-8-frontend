import styled from 'styled-components'

import { flexColCenter } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatInput } from '@/widgets/chat'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

import PlaylistData from './mockData.json'

const DiscoverPage = () => {
  const trackLengths = PlaylistData.tracks.map((t) => t.duration)
  const totalTime = trackLengths.reduce((sum, t) => sum + t, 0)

  // TODO: 실제 전송 로직으로 교체
  const handleSendMessage = () => {}

  return (
    <div>
      <Header
        center={
          <>
            <span>{PlaylistData.title}</span>
            <span>{PlaylistData.tracks[0].title}</span>
            {/* TODO: 실제 재생 중 인덱스의 타이틀로 표시 */}
          </>
        }
      />

      <LiveInfo isOnAir listenerCount={550} />
      <Wrapper>
        <Cd variant="xxl" bgColor="none" />
        <ActionBar playlistId={PlaylistData.id} />
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
