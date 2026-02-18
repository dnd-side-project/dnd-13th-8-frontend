import { NavLink, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { flexRowCenter } from '@/shared/styles/mixins'

const FollowTab = () => {
  const { userId } = useParams()

  return (
    <TabContainer>
      <TabButton to={`/${userId}/following`}>팔로잉</TabButton>

      <TabButton to={`/${userId}/followers`}>팔로워</TabButton>
    </TabContainer>
  )
}

export default FollowTab

const TabContainer = styled.div`
  ${flexRowCenter}
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
  margin: 0 -20px;
  max-height: 56px;
  padding: 12px 20px 0 20px;
`

const TabButton = styled(NavLink)`
  ${flexRowCenter}
  ${({ theme }) => theme.FONT['body2-normal']};
  width: 100%;
  padding: 12px 0;
  cursor: pointer;

  color: ${({ theme }) => theme.COLOR['gray-400']};

  &.active {
    color: ${({ theme }) => theme.COLOR['gray-10']};
    font-weight: 500;
    border-bottom: 2px solid ${({ theme }) => theme.COLOR['gray-100']};
  }
`
