import styled from 'styled-components'

import { Badge } from '@/shared/ui'
import Cd from '@/shared/ui/Cd'

interface PlaylistHorizontalProps {
  genre: string
  title: string
  username: string
}

const PlaylistHorizontal = ({ title, username, genre }: PlaylistHorizontalProps) => {
  return (
    <Wrapper>
      <div>
        <Cd variant="lg" bgColor="default" />
      </div>
      <InfoBox>
        <Badge text={genre} />
        <Title>{title}</Title>
        <UserName>{username}</UserName>
      </InfoBox>
    </Wrapper>
  )
}

export default PlaylistHorizontal

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`

const Title = styled.h3`
  color: ${({ theme }) => theme.COLOR['gray-10']};
  ${({ theme }) => theme.FONT.headline1};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`

const UserName = styled.p`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`
