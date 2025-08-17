import styled from 'styled-components'

import { flexColCenter } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo } from '@/shared/ui'
import { ChatInput } from '@/widgets/chat'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'


const DiscoverPage = () => {
  // TODO: 실제 전송 로직으로 교체
  const handleSendMessage = () => {}

  return (
    <div>
      <Header
        center={
          <>
            <span>플레이리스트명</span>
            <span>두번쨰 곡</span>
          </>
        }
      />

      <LiveInfo isOnAir listenerCount={550} />
      <Wrapper>
        <Cd variant="xxl" bgColor="none" />
        <ActionBar playlistId="1" />
      </Wrapper>
      <ProgressBar currentTime={300} duration={1000} />
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
