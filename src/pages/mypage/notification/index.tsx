import styled from 'styled-components'

import { NoData } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { SubHeader } from '@/shared/ui'

const Notification = () => {
  return (
    <>
      <SubHeader title="알림" />
      <NotificationContainer>
        <NoData width={120} height={120} />
        <p>
          아직 새로운 알림이 없어요.
          <br />
          새로운 활동이 있으면 바로 알려드릴게요.
        </p>
      </NotificationContainer>
    </>
  )
}

export default Notification

const NotificationContainer = styled.div`
  ${flexColCenter}
  gap: 16px;
  width: 100%;
  height: calc(100dvh - 60px);

  & > p {
    text-align: center;
    color: ${({ theme }) => theme.COLOR['gray-10']};
    ${({ theme }) => theme.FONT['body1-normal']};
  }
`
