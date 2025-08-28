import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { flexColCenter } from '@shared/styles/mixins'
import { SvgButton, Cd, Badge } from '@shared/ui'

import { Plus } from '@/assets/icons'
import type { MyCdListResponse } from '@/entities/playlist/types/playlist'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { MyPageTabType } from '@/pages/myPage/types/mypage'

const CdGrid = ({
  currentPlaylist,
  currentTab,
}: {
  currentPlaylist: MyCdListResponse
  currentTab: MyPageTabType
}) => {
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()

  return (
    <CdGridWrap>
      <CdAddContainer>
        <SvgButton
          icon={Plus}
          width={40}
          height={40}
          onClick={() =>
            navigate('/mypage/customize', {
              // 최초 생성일 경우 대표 플리 지정
              state: { isPrimary: !currentPlaylist?.length },
            })
          }
        />
        <CdAddLabel>추가하기</CdAddLabel>
      </CdAddContainer>
      {currentPlaylist?.map((item) => (
        <CdContainer
          key={item.paylistId}
          as="button"
          type="button"
          onClick={() => navigate(`/mypage/${item.paylistId}/playlist`)}
        >
          <Cd variant="md" />
          {currentTab === 'cd' && item?.isRepresentative && <Badge size="small" text="대표" />}
          <p>
            <CdTitle>{item.playlistName}</CdTitle>
            <CdCreator>{userInfo.username}</CdCreator>
          </p>
        </CdContainer>
      ))}
    </CdGridWrap>
  )
}

export default CdGrid

const CD_CONTAINER_WIDTH = 104

const CdGridWrap = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, auto));
  gap: 24px 11px;
  justify-content: space-around;
  margin: 14px auto;
  width: 100%;
`

const CdAddContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  & > button {
    width: ${CD_CONTAINER_WIDTH}px;
    height: ${CD_CONTAINER_WIDTH}px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.COLOR['gray-600']};
  }
`

const CdAddLabel = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.COLOR['gray-200']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const CdContainer = styled.li`
  position: relative;
  ${flexColCenter}
  cursor: pointer;

  & > button {
    width: 100%;
    height: 100%;
  }

  & > span {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 20;
  }
`

const CdTitle = styled.span`
  display: -webkit-box;
  margin-top: 10px;
  width: ${CD_CONTAINER_WIDTH}px;
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
  width: ${CD_CONTAINER_WIDTH}px;
  max-height: 32px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['caption1']}
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
