import styled from 'styled-components'

import { User } from '@/assets/icons'

interface LiveInfoProps {
  isOnAir: boolean
  listenerCount: number
  isOwner: boolean
  onToggleOnAir?: () => void
}

const LiveInfo = ({ isOnAir, listenerCount, isOwner, onToggleOnAir }: LiveInfoProps) => {
  return (
    <Wrapper>
      <OnAirBadge
        disabled={!isOwner}
        $isOnAir={isOnAir}
        onClick={isOwner ? onToggleOnAir : undefined}
      >
        ON AIR
      </OnAirBadge>

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
  ${({ theme }) => theme.FONT.caption1};
`

const OnAirBadge = styled.button<{ $isOnAir: boolean }>`
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  color: ${({ theme, $isOnAir }) =>
    $isOnAir ? theme.COLOR['primary-normal'] : theme.COLOR['gray-300']};
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 6px;
  ${({ theme }) => theme.FONT.label};

  &:disabled {
    cursor: default;
  }
`

const ListenerCount = styled.span`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.COLOR['gray-10']};
`
