import styled from 'styled-components'

import { User } from '@/assets/icons'

interface LiveInfoProps {
  isOnAir: boolean
  listenerCount: number
}

const LiveInfo = ({ isOnAir, listenerCount }: LiveInfoProps) => {
  return (
    <Wrapper>
      {isOnAir && <OnAirBadge>ON AIR</OnAirBadge>}
      <ListenerCount>
        <User /> {listenerCount}
      </ListenerCount>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) => theme.FONT.caption1};
`

const OnAirBadge = styled.span`
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 6px;
`

const ListenerCount = styled.span`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.COLOR['gray-10']};
`

export default LiveInfo
