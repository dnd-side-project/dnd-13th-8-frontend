
import { useNavigate } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { Play } from '@/assets/icons'
import type { CdCustomData } from '@/entities/playlist'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Cd, SvgButton } from '@/shared/ui'

interface SplitCardProps {
  title: string
  stickers?: CdCustomData[]
}

const SplitCard = ({ title, stickers }: SplitCardProps) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const handlePlayClick = () => {
    navigate('/curation') // TODO: 경로 수정
  }
  return (
    <CardWrapper>
      <CdContainer>
        <Main>
          <Cd variant="splitCard_lg" bgColor="dark" stickers={stickers} />
        </Main>
        <Cd variant="splitCard_sm" bgColor="dark" stickers={stickers} />
        <Cd variant="splitCard_sm" bgColor="dark" stickers={stickers} />
      </CdContainer>
      <Content>
        <Title>{title}</Title>
        <PlayButton onClick={handlePlayClick}>
          <SvgButton width={24} height={24} icon={Play} fill={theme.COLOR['gray-900']} />
        </PlayButton>
      </Content>
    </CardWrapper>
  )
}

export default SplitCard

const CardWrapper = styled.div`
  width: 240px;
  max-height: 232px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-right: 12px;
`

const Title = styled.h2`
  ${({ theme }) => theme.FONT.headline2};
  width: 136px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  max-height: 2.8em;
`

const PlayButton = styled.button`
  width: 42px;
  height: 32px;
  ${flexRowCenter}
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 80px;
  flex-shrink: 0;
`
