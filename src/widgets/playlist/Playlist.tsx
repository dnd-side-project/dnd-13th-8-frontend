import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import Cd from '@/shared/ui/Cd'

interface PlaylistProps {
  title: string
  username: string
  id: number
}

const Playlist = ({ id, title, username }: PlaylistProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/discover/${id}`)
  }

  return (
    <Wrapper onClick={handleClick}>
      <CdBox>
        <Cd variant="xl" />
      </CdBox>
      <InfoBox>
        <Title>{title}</Title>
        <UserName>{username}</UserName>
      </InfoBox>
    </Wrapper>
  )
}

export default Playlist

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 140px;
  cursor: pointer;
`

const CdBox = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h3`
  font-weight: 500;
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body1-normal']};

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
  gap: 4px;
`
