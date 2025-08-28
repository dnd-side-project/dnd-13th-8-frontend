import { useNavigate } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { Play } from '@/assets/icons'
import type { Track } from '@/entities/playlist/model/types'
import { flexRowCenter } from '@/shared/styles/mixins'
import Cd from '@/shared/ui/Cd'
import Link from '@/shared/ui/Link'
import SvgButton from '@/shared/ui/SvgButton'

interface PlaylistWithSongProps {
  title: string
  id: number
  username: string
  songs: Track[]
}

const PlaylistWithSong = ({ id, title, username, songs }: PlaylistWithSongProps) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const handlePlayClick = () => {
    navigate(`/discover/${id}`)
  }

  return (
    <Wrapper>
      <TopContainer>
        <Cd variant="sm" bgColor="dark" />
        <InfoBox>
          <InfoText>
            <Title>{title}</Title>
            <UserName>{username}</UserName>
          </InfoText>
          <PlayButton onClick={handlePlayClick}>
            <SvgButton width={16} height={16} icon={Play} fill={theme.COLOR['gray-900']} />
            PLAY
          </PlayButton>
        </InfoBox>
      </TopContainer>
      <SongsBox>
        {songs.slice(0, 3).map((song) => (
          <Link key={song.id} variant="small" data={song} />
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

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h3`
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body1-normal']};
  font-weight: 600;

  display: inline-block;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const PlayButton = styled.button`
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${flexRowCenter}
  gap: 4px;
  padding: 5px 12px 5px 8px;
  border-radius: 99px;
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-900']};
  max-width: 73px;
`
