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
  isPublic?: boolean
}

const Playlist = ({
  id,
  title,
  username,
  stickers,
  cdVariant = 'xl',
  isPublic = true,
}: PlaylistProps) => {
  const navigate = useNavigate()

  // 피드 페이지에서만 아래 옵션을 사용하고 있어 구분하기 위함
  const isFromMypage = cdVariant === 'responsive'

  const handleClick = () => {
    if (isFromMypage) return
    navigate(`/discover/${id}`)
  }

  return (
    <Wrapper onClick={handleClick} $cdVariant={cdVariant}>
      <CdBox $cdVariant={cdVariant}>
        <Cd variant={cdVariant} stickers={stickers} isPublic={isPublic} />
        <ButtonContainer>
          <LikeButton playlistId={id} type="HOME" />
        </ButtonContainer>
      </CdBox>
      {!isFromMypage && (
        <InfoBox>
          <Title>{title}</Title>
          <UserName>{username}</UserName>
        </InfoBox>
      )}
    </Wrapper>
  )
}

export default Playlist

const Wrapper = styled.div<{ $cdVariant: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: ${({ $cdVariant }) => ($cdVariant === 'responsive' ? '100%' : '140px')};
`

const CdBox = styled.div<{ $cdVariant: string }>`
  position: relative;
  width: ${({ $cdVariant }) => ($cdVariant === 'responsive' ? '100%' : '140px')};
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
