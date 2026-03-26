import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { CdCustomData, Playlist } from '@/entities/playlist'
import { flexColCenter } from '@/shared/styles/mixins'
import { Cd } from '@/shared/ui'

interface SplitCardProps {
  id: number
  title: string
  playlists: Playlist[]
  sectionTitle: string
}

const SplitCard = ({ id, title, playlists, sectionTitle }: SplitCardProps) => {
  const navigate = useNavigate()

  const stickersList: CdCustomData[][] = playlists.map(
    (playlist) => playlist.cdResponse?.cdItems ?? []
  )

  return (
    <CardButton
      onClick={() => navigate(`/curation/${id}`, { state: { sectionTitle: sectionTitle } })}
    >
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
  border-radius: 14px;
  ${flexColCenter}
  gap: 16px;
  border: 0.5px solid transparent;
  border-radius: 16px;
  background:
    linear-gradient(144.41deg, #2a2f39, #191b22) padding-box,
    linear-gradient(135deg, rgba(74, 77, 97, 0.8), #1f2027 70%) border-box;
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
  width: 180px;
  min-height: 48px;
  font-weight: 600;
  text-align: left;
  padding-left: 4px;
  color: ${({ theme }) => theme.COLOR['gray-100']};
  white-space: pre-line;
`
