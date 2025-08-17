import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { SvgButton, Cd, Badge } from '@shared/ui'

import { Plus } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'

// TODO: api 연동 후 실 데이터로 수정
const PlaylistGrid = ({
  currentPlaylist,
  currentTab,
}: {
  currentPlaylist: {
    id: number
    title: string
    username: string
    isPrimary?: boolean
  }[]
  currentTab: 'album' | 'like'
}) => {
  const navigate = useNavigate()

  return (
    <ListGrid>
      {/* TODO: 추후 develop merge 후 수정된 CD 컴포넌트로 교체 */}
      <CdContainer>
        <CdBackground>
          <SvgButton
            icon={Plus}
            width={40}
            height={40}
            onClick={() => navigate('/mypage/create')}
          />
        </CdBackground>
        <CdAddLabel>추가하기</CdAddLabel>
      </CdContainer>
      {currentPlaylist?.map((item) => (
        <CdContainer key={item.id}>
          <CdBackground>
            <Cd variant="md" />
            {currentTab === 'album' && item?.isPrimary && <Badge size="small" text="대표" />}
          </CdBackground>
          <p>
            <CdTitle>{item.title}</CdTitle>
            <CdCreator>{item.username}</CdCreator>
          </p>
        </CdContainer>
      ))}
    </ListGrid>
  )
}

export default PlaylistGrid

const ListGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 11.5px;
  margin: 14px 0;
  width: 100%;
`

const CdContainer = styled.li`
  gap: 12px;
  width: 104px;
`

const CdBackground = styled.div`
  position: relative;
  ${flexRowCenter}
  margin-bottom: 10px;
  width: 100%;
  height: 104px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};

  & > button {
    width: 100%;
    height: 100%;
  }

  & > span {
    position: absolute;
    top: 6px;
    left: 6px;
  }
`

const CdAddLabel = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.COLOR['gray-200']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const CdTitle = styled.span`
  display: -webkit-box;
  width: 100%;
  max-height: 40px;
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body2-normal']}
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const CdCreator = styled.span`
  display: -webkit-box;
  margin-top: 4px;
  width: 100%;
  max-height: 32px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['caption1']}
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
