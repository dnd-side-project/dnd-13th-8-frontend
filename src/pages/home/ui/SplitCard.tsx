import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { CdCustomData, Playlist } from '@/entities/playlist'
import { flexColCenter } from '@/shared/styles/mixins'
import { Cd } from '@/shared/ui'

interface SplitCardProps {
  id: number
  title: string
  playlists: Playlist[]
}

const SplitCard = ({ id, title, playlists }: SplitCardProps) => {
  const navigate = useNavigate()

  const stickersList: CdCustomData[][] = playlists.map(
    (playlist) => playlist.cdResponse?.cdItems ?? []
  )

  return (
    <CardButton onClick={() => navigate(`curation/${id}`)}>
      <CdContainer>
        <Main>
          <Cd variant="splitCard_lg" bgColor="dark" stickers={stickersList[0]} />
        </Main>
        <Cd variant="splitCard_sm" bgColor="dark" stickers={stickersList[1]} />
        <Cd variant="splitCard_sm" bgColor="dark" stickers={stickersList[2]} />
      </CdContainer>
      <Content>
        <Title>{title}</Title>
      </Content>
    </CardButton>
  )
}

export default SplitCard

const CardButton = styled.button`
  width: 240px;
  height: 232px;
  padding: 16px;
  background: linear-gradient(144.41deg, #2a2f39 1.79%, #181920 100.08%);
  border-radius: 14px;
  ${flexColCenter}
  gap: 16px;
`

const CdContainer = styled.div`
  display: grid;
  grid-template-columns: 136px 64px;
  grid-template-rows: 64px 64px;
  gap: 8px;
  width: 100%;
`

const Main = styled.div`
  grid-row: span 2;
`

const Content = styled.div`
  width: 100%;
`

const Title = styled.h2`
  ${({ theme }) => theme.FONT.headline2};
  width: 136px;
  min-height: 48px;
  font-weight: 600;
  text-align: left;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`
