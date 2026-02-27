import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Plus } from '@/assets/icons'
import { useFeedCdList, type FEED_CD_LIST_TAB_TYPE } from '@/entities/playlist'
import type { ShareCode } from '@/features/auth'
import { FeedCdListLayout } from '@/pages/feed/ui'
import { CdButton } from '@/pages/feed/ui/layout/FeedCdListLayout'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { Cd } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { Playlist } from '@/widgets/playlist'

interface FeedCdListProps {
  shareCode: ShareCode
  feedView: FEED_CD_LIST_TAB_TYPE
  isMyFeed: boolean
}

const FeedCdList = ({ shareCode, feedView, isMyFeed }: FeedCdListProps) => {
  const navigate = useNavigate()

  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')
  const { data, isLoading, isFetching, isError } = useFeedCdList({
    shareCode,
    feedView,
    // TODO: 무한스크롤 적용
    params: {
      shareCode,
      sort: currentSort,
      cursor: '',
      limit: 100,
    },
  })

  return (
    <FeedCdListLayout
      totalCount={data?.totalCount ?? 0}
      currentSort={currentSort}
      onSortChange={setCurrentSort}
      isLoading={isLoading || isFetching}
      isError={isError}
    >
      {isMyFeed && feedView === 'cds' && (
        <CdAddContainer>
          <button type="button" onClick={() => navigate('/customize')}>
            <Plus />
          </button>
          <span>CD 생성하기</span>
        </CdAddContainer>
      )}

      {data?.content?.map((item) => (
        <li key={item.playlistId}>
          <CdButton
            type="button"
            onClick={() => {
              navigate(`/${shareCode}/${feedView}/${item.playlistId}`, {
                state: { isFromMyCdList: isMyFeed },
              })
            }}
          >
            {isMyFeed && feedView === 'cds' ? (
              <>
                <Cd variant="responsive" stickers={item?.cdResponse?.cdItems} />
                {!item?.isPublic && <PrivateBadge>비공개</PrivateBadge>}
              </>
            ) : (
              <Playlist
                id={item.playlistId}
                title={item.playlistName}
                username={item?.creatorNickname || ''}
                stickers={item?.cdResponse?.cdItems}
                cdVariant="responsive"
                isPublic={item.isPublic}
              />
            )}
          </CdButton>
          <CdName>
            <span>{item?.playlistName || ''}</span>
            <span>{item?.creatorNickname || ''}</span>
          </CdName>
        </li>
      ))}
    </FeedCdListLayout>
  )
}

export default FeedCdList

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

const PrivateBadge = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  ${({ theme }) => theme.FONT['caption2']}
  color: ${({ theme }) => theme.COLOR['gray-200']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  padding: 2px 6px;
  border-radius: 99px;
  z-index: 1;
`

const CdName = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  & > span:first-child {
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme }) => theme.COLOR['gray-50']};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  & > span:last-child {
    ${({ theme }) => theme.FONT['caption1']}
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`
