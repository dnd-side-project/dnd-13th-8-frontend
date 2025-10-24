import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { NoLike } from '@/assets/icons'
import { useMyLikedCdList } from '@/entities/playlist/model/useMyCd'
import { CdNameInfo } from '@/pages/mypage/ui/main/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexColCenter } from '@/shared/styles/mixins'
import { Loading, Error, ContentHeader, Cd } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'

const MyLikedCdList = () => {
  const navigate = useNavigate()

  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')

  const { data: myLikedCdList, isLoading, isError, isSuccess } = useMyLikedCdList(currentSort)

  if (isLoading) return <Loading isLoading={isLoading} />
  if (isError || !isSuccess) return <Error />

  return (
    <>
      <ContentHeader
        totalCount={myLikedCdList?.length ?? 0}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
      />
      <CdListWrap>
        {isSuccess && !myLikedCdList?.length ? (
          <NoLikedWrapper>
            <NoLike width={100} height={100} />
            <p>
              아직 좋아요한 CD가 없어요.
              <br />
              마음에 드는 CD를 찾아 좋아요를 눌러보세요.
            </p>
          </NoLikedWrapper>
        ) : (
          myLikedCdList?.map((item) => (
            <li key={item.playlistId}>
              {/* TODO: 나의CD 이동 후 좋아요한 CD 재생은 각 브랜치 병합 이후 작업 */}
              <CdButton type="button" onClick={() => navigate('/mycd')}>
                {/* TODO: CD 컴포넌트 좋아요는 각 브랜치 병합 이후 작업 (10/20~) */}
                <Cd
                  variant="responsive"
                  stickers={item?.cdResponse?.cdItems}
                  isPublic={item?.isPublic}
                />
              </CdButton>
              <CdNameInfo title={item?.playlistName || ''} creator={item?.creatorNickname || ''} />
            </li>
          ))
        )}
      </CdListWrap>
    </>
  )
}

export default MyLikedCdList

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

const CdButton = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
`

const NoLikedWrapper = styled.div`
  ${flexColCenter}
  gap: 12px;
  width: 100%;
  aspect-ratio: 1 / 0.6;
  text-align: center;

  & > p {
    ${({ theme }) => theme.FONT['body1-normal']}
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`
