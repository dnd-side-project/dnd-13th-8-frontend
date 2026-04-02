import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { CdCustomData } from '@/entities/playlist'
import { LikeButton } from '@/features/like'
import Cd from '@/shared/ui/Cd'
import type { CdProps } from '@/shared/ui/Cd'

interface PlaylistProps {
  title: string
  username: string
  id: number
  stickers?: CdCustomData[]
  cdVariant?: CdProps['variant']
}

const Playlist = ({ id, title, username, stickers, cdVariant = 'xl' }: PlaylistProps) => {
  const navigate = useNavigate()

  // 피드 페이지에서만 아래 옵션을 사용하고 있어 구분하기 위함
  const isFromFeedPage = cdVariant === 'responsive'

  const handleClick = () => {
    if (isFromFeedPage) return
    navigate(`/discover/${id}`)
  }

  return (
    <Wrapper onClick={handleClick} $isFromFeedPage={isFromFeedPage}>
      <CdBox $isFromFeedPage={isFromFeedPage}>
        <Cd variant={cdVariant} stickers={stickers} />
        <ButtonContainer>
          <LikeButton playlistId={id} type="HOME" />
        </ButtonContainer>
      </CdBox>
      <InfoBox>
        <Title>{title}</Title>
        <UserName>{username}</UserName>
      </InfoBox>
    </Wrapper>
  )
}

export default Playlist

const Wrapper = styled.div<{ $isFromFeedPage: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $isFromFeedPage }) => ($isFromFeedPage ? '100%' : '140px')};
`

const CdBox = styled.div<{ $isFromFeedPage: boolean }>`
  position: relative;
  width: ${({ $isFromFeedPage }) => ($isFromFeedPage ? '100%' : '140px')};
  aspect-ratio: 1 / 1;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonContainer = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
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
