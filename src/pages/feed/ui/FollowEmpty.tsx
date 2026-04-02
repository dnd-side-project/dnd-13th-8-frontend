import styled from 'styled-components'

import { NoLike } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { StatusText } from '@/shared/styles/status'

type PageType = 'FOLLOWING' | 'FOLLOWERS'

interface FollowEmptyProps {
  type: PageType
}

const FollowEmpty = ({ type }: FollowEmptyProps) => {
  return (
    <Page>
      <NoLike width={120} height={120} />
      <StatusText>
        {type === 'FOLLOWING' ? (
          <>
            아직 팔로우한 유저가 없어요.
            <br />
            취향이 맞는 유저를 찾아보세요.
          </>
        ) : (
          <>
            아직 회원님을 팔로우하는 유저가 없어요.
            <br />첫 팔로워를 기다리고 있어요.
          </>
        )}
      </StatusText>
    </Page>
  )
}

export default FollowEmpty

const Page = styled.div`
  ${flexColCenter}
  width: 100%;
  height: 100%;
  gap: 16px;
`
