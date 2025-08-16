import styled, { useTheme } from 'styled-components'

import { Like } from '@/assets/icons'
import Cd from '@/shared/ui/Cd'
import SvgButton from '@/shared/ui/SvgButton'

interface PlaylistProps {
  title: string
  username: string
  liked?: boolean
  onClick?: () => void
}

const Playlist = ({ title, username, liked, onClick }: PlaylistProps) => {
  const theme = useTheme()

  return (
    <Wrapper>
      <CdBox>
        <Cd variant="xl" />
        <LikeButton $opacity={liked ? 1 : 0.2}>
          <SvgButton
            icon={Like}
            onClick={onClick}
            width={20}
            height={20}
            fill={liked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
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
