import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Plus } from '@/assets/icons'
import { useMyCdList } from '@/entities/playlist/model/useMyPlaylist'
import { useAuthStore } from '@/features/auth/store/authStore'
import { CdNameInfo } from '@/pages/mypage/ui/main/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { Loading, Error, ContentHeader, Cd } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'

const MyCdList = () => {
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()

  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')

  const { data: myCdList, isLoading, isError, isSuccess } = useMyCdList(currentSort)

  if (isLoading) return <Loading isLoading={isLoading} />
  if (isError || !isSuccess) return <Error />

  return (
    <>
      <ContentHeader
        totalCount={myCdList?.length ?? 0}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
      />
      <CdListWrap>
        <CdAddContainer>
          <button type="button" onClick={() => navigate('/mypage/customize')}>
            <Plus />
          </button>
          <span>CD 생성하기</span>
        </CdAddContainer>
        {myCdList?.map((item) => (
          <li key={item.playlistId}>
            <CdButton
              type="button"
              onClick={() => navigate(`/mypage/${item.playlistId}/tracklist`)}
            >
              <Cd variant="responsive" stickers={item?.cdResponse?.cdItems} />
            </CdButton>
            <CdNameInfo title={item?.playlistName || ''} creator={userInfo?.username || ''} />
          </li>
        ))}
      </CdListWrap>
    </>
  )
}

export default MyCdList

const CD_LIST_GAP = 11.5

const CdListWrap = styled.ul`
  margin: 14px 0;
  width: 100%;
  display: flex;
  gap: ${CD_LIST_GAP}px;

  & > li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: calc((100% - ${CD_LIST_GAP * 2}px) / 3);
  }
`

const CdAddContainer = styled.li`
  width: 100%;

  & > button {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.COLOR['gray-600']};
  }

  & > span {
    width: 100%;
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme }) => theme.COLOR['gray-200']};
    text-align: center;
  }
`

const CdButton = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
`
