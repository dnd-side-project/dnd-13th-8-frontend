import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import Lottie from 'lottie-react'
import styled from 'styled-components'

import { Plus, NoLike, EyeSlashWhite } from '@/assets/icons'
import { LoadingLottie } from '@/assets/lottie'
import { useFeedCdList, type FEED_CD_LIST_TAB_TYPE } from '@/entities/playlist'
import type { ShareCode } from '@/features/auth'
import { FeedCdListLayout } from '@/pages/feed/ui'
import { useSingleSelect } from '@/shared/lib'
import { flexColCenter } from '@/shared/styles/mixins'
import type { SortType } from '@/shared/ui/ContentHeader'
import { Playlist } from '@/widgets/playlist'

interface FeedCdListProps {
  shareCode: ShareCode
  feedView: FEED_CD_LIST_TAB_TYPE
  isMyFeed: boolean
}

const NO_DATA_TEXT = {
  NO_MY_CDS: '아직 만든 CD가 없어요.\n첫 CD를 만들어볼까요?',
  NO_MY_LIKES: '아직 좋아요한 CD가 없어요.\n마음에 드는 음악을 찾아볼까요?',
  NO_OTHER_CDS: '아직 공개된 CD가 없어요.',
  NO_OTHERS_LIKES: '아직 좋아요한 CD가 없어요.',
} as const

const FeedCdList = ({ shareCode, feedView, isMyFeed }: FeedCdListProps) => {
  const navigate = useNavigate()
  const { ref, inView } = useInView()

  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage, isError } =
    useFeedCdList({
      shareCode,
      feedView,
      params: {
        shareCode,
        sort: currentSort,
        limit: 9,
      },
    })

  const contentList = data?.pages.flatMap((page) => page.content) ?? []
  const totalCount = data?.pages[0]?.totalCount ?? 0
  const isCdFeedView = feedView === 'cds'

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <FeedCdListLayout
      totalCount={totalCount}
      currentSort={currentSort}
      onSortChange={setCurrentSort}
      isLoading={isLoading}
      isError={isError}
    >
      {!contentList?.length && (
        <NoDataContainer>
          <NoLike width={100} height={100} />
          <NoDataText>
            {isMyFeed
              ? isCdFeedView
                ? NO_DATA_TEXT.NO_MY_CDS
                : NO_DATA_TEXT.NO_MY_LIKES
              : isCdFeedView
                ? NO_DATA_TEXT.NO_OTHER_CDS
                : NO_DATA_TEXT.NO_OTHERS_LIKES}
          </NoDataText>
          {isMyFeed && (
            <CtaButton
              type="button"
              onClick={() => navigate(isCdFeedView ? '/customize' : '/discover')}
            >
              {isCdFeedView ? '새로운 CD에 취향 담기' : '둘러보기로 가기'}
            </CtaButton>
          )}
        </NoDataContainer>
      )}

      {!!contentList?.length && isMyFeed && isCdFeedView && (
        <CdAddContainer>
          <button type="button" onClick={() => navigate('/customize')}>
            <Plus />
          </button>
          <span>CD 생성하기</span>
        </CdAddContainer>
      )}
      {!!contentList?.length &&
        contentList?.map((item) => (
          <li key={item.playlistId}>
            <CdButton
              type="button"
              onClick={() => {
                navigate(`/${shareCode}/${feedView}/${item.playlistId}`, {
                  state: { isFromMyCdList: isMyFeed },
                })
              }}
            >
              {!item?.isPublic &&
                (isCdFeedView ? (
                  <PrivateBadge>비공개</PrivateBadge>
                ) : (
                  <PrivateCover>
                    <EyeSlashWhite width={16} height={16} />
                    <span>비공개된 CD</span>
                  </PrivateCover>
                ))}
              <Playlist
                id={item.playlistId}
                title={item.playlistName}
                username={item?.creatorNickname || ''}
                stickers={item?.cdResponse?.cdItems}
                cdVariant="responsive"
              />
            </CdButton>
          </li>
        ))}

      <div ref={ref} style={{ height: '10px' }} />
      {isFetchingNextPage && (
        <LoadingContainer>
          <Lottie animationData={LoadingLottie} loop autoplay />
        </LoadingContainer>
      )}
    </FeedCdListLayout>
  )
}

export default FeedCdList

const NoDataContainer = styled.div`
  ${flexColCenter}
  gap: 12px;
  width: 100%;
  height: 300px;
`

const NoDataText = styled.p`
  ${({ theme }) => theme.FONT.caption1}
  text-align: center;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  white-space: pre-wrap;
`

const CtaButton = styled.button`
  padding: 6px 20px;
  border-radius: 99px;
  ${({ theme }) => theme.FONT['body2-normal']}
  color: ${({ theme }) => theme.COLOR['gray-800']};
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
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
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;

  & h3 {
    ${({ theme }) => theme.FONT['body2-normal']}
    font-weight: 400;
    text-align: left;
  }

  & p {
    ${({ theme }) => theme.FONT['caption1']}
    text-align: left;
  }
`

const PrivateCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  ${flexColCenter}
  gap: 3px;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background-color: rgba(42, 47, 57, 0.7);
  z-index: 1;

  & > span {
    ${({ theme }) => theme.FONT['caption2']}
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

const LoadingContainer = styled.div`
  ${flexColCenter}
  width: 100%;
  height: 100px;

  & > div {
    width: 120px;
    height: 120px;
  }
`
