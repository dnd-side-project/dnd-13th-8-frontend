import styled from 'styled-components'

import Cd from '@/shared/ui/Cd'
import Link from '@/shared/ui/Link'

interface PlaylistWithSongProps {
  title: string
  username: string
  songs: { thumbnail?: string | null; title: string }[]
}

const PlaylistWithSong = ({ title, username, songs }: PlaylistWithSongProps) => {
  return (
    <Wrapper>
      <TopContainer>
        <CdBox>
          <Cd variant="sm" />
        </CdBox>
        <InfoBox>
          <Title>{title}</Title>
          <UserName>{username}</UserName>
        </InfoBox>
      </TopContainer>
      <SongsBox>
        {songs.map((song, idx) => (
          <Link key={idx} variant="small" data={song} />
        ))}
      </SongsBox>
    </Wrapper>
  )
}

export default PlaylistWithSong

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 15px;
  width: 240px;
  border-radius: 14px;

  border: 1px solid transparent;
  border-radius: 14px;
  background:
    linear-gradient(
        to bottom right,
        ${({ theme }) => theme.COLOR['gray-600']},
        ${({ theme }) => theme.COLOR['gray-800']}
      )
      padding-box,
    linear-gradient(
        to bottom right,
        ${({ theme }) => theme.COLOR['gray-600']},
        ${({ theme }) => theme.COLOR['gray-800']}
      )
      border-box;
`

const CdBox = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};

  display: flex;
  justify-content: center;
  align-items: center;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 110px;
`

const Title = styled.h3`
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body1-normal']};
  font-weight: 600;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`

const TopContainer = styled.div`
  display: flex;
  gap: 10px;
`

const UserName = styled.p`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT.caption1};
`

const SongsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
