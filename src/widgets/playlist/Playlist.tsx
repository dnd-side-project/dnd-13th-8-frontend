import { useNavigate } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { Like } from '@/assets/icons'
import type { CdCustomData } from '@/entities/playlist'
import Cd from '@/shared/ui/Cd'
import SvgButton from '@/shared/ui/SvgButton'

interface PlaylistProps {
  title: string
  username: string
  id: number
  stickers?: CdCustomData[]
  isLiked: boolean
}

const Playlist = ({ id, title, username, stickers, isLiked }: PlaylistProps) => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/discover/${id}`)
  }

  return (
    <Wrapper onClick={handleClick}>
      <CdBox>
        <Cd variant="xl" stickers={stickers} />
        <LikeButton $opacity={isLiked ? 1 : 0.2}>
          <SvgButton
            icon={Like}
            width={20}
            height={20}
            fill={isLiked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
          />
        </LikeButton>
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

const LikeButton = styled.div<{ $opacity?: number }>`
  position: absolute;
  top: 6px;
  right: 6px;

  opacity: ${({ $opacity }) => $opacity};
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
