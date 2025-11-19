import styled from 'styled-components'

import { Downtime as DowntimeIcon } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'

const DowntimePage = () => {
  return (
    <DowntimeWrapper>
      <DowntimeIcon width={120} height={120} />
      <TextBox>
        <TextHead>들락은 잠시 쉬는 중!</TextHead>
        <TextBody>
          새벽 3시~오전 7시까지 충전 시간을 가져요.
          <br />
          아침이면 다시 음악과 함께 찾아올게요!
        </TextBody>
      </TextBox>
    </DowntimeWrapper>
  )
}

export default DowntimePage

const DowntimeWrapper = styled.div`
  ${flexColCenter}
  gap: 8px;
  height: 100%;
`

const TextBox = styled.p`
  ${flexColCenter}
  gap: 5px;
  text-align: center;
`

const TextHead = styled.span`
  ${({ theme }) => theme.FONT.headline2};
  font-weight: 600;
`

const TextBody = styled.span`
  ${({ theme }) => theme.FONT['body2-normal']};
`
