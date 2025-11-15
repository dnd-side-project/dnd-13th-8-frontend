import styled from 'styled-components'

import { User } from '@/assets/icons'

interface LiveInfoProps {
  isOnAir: boolean
  listenerCount: number
}

const LiveInfo = ({ isOnAir, listenerCount }: LiveInfoProps) => {
  return (
    <Wrapper>
      <OnAirBadge $isOnAir={isOnAir}>ON AIR</OnAirBadge>

      <ListenerCount>
        <User /> {listenerCount}
      </ListenerCount>
    </Wrapper>
  )
}

export default LiveInfo

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`

const OnAirBadge = styled.div<{ $isOnAir: boolean }>`
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  color: ${({ theme, $isOnAir }) =>
    $isOnAir ? theme.COLOR['primary-normal'] : theme.COLOR['gray-300']};
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  ${({ theme }) => theme.FONT.caption2};

  &:disabled {
    cursor: default;
  }
`

const ListenerCount = styled.span`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.COLOR['gray-10']};
  ${({ theme }) => theme.FONT.caption1};
`
