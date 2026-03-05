import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { useFollowerList, FollowButton, type FollowSortType } from '@/features/follow'
import { FollowEmpty } from '@/pages/feed/ui'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading, ContentHeader } from '@/shared/ui'
import { SearchResultItem } from '@/widgets/search'

const Followers = () => {
  const navigate = useNavigate()
  const { shareCode } = useParams()
  const { selected, onSelect } = useSingleSelect<FollowSortType>('LATEST')

  const { ref, inView } = useInView()

  const { data, isLoading, isFetching, isError, fetchNextPage, hasNextPage } = useFollowerList(
    shareCode || '',
    selected
  )

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (isLoading || isFetching) return <Loading isLoading />

  if (!data || isError) {
    return <Navigate to="/error" replace />
  }

  const followerList = data.pages.flatMap((page) => page.content)

  return (
    <>
      <ContentHeaderWrapper>
        <ContentHeader
          totalCount={data.pages[0].totalCount}
          currentSort={selected}
          onSortChange={onSelect}
          options={['LATEST', 'OLDEST']}
          countType="PEOPLE"
        />
      </ContentHeaderWrapper>
      <ListWrapper>
        {followerList.length === 0 ? (
          <FollowEmpty type="FOLLOWERS" />
        ) : (
          <>
            {followerList.map((item) => (
              <ItemWrapper key={item.userId}>
                <SearchResultItem
                  type="USER"
                  imageUrl={item.profileUrl}
                  searchResult={item.username}
                  onClick={() => navigate(`/${item.shareCode}`)}
                />
                <FollowButton
                  shareCode={item.shareCode}
                  variant="default"
                  initialIsFollowing={item.followedByMe}
                />
              </ItemWrapper>
            ))}

            <div ref={ref} style={{ height: '10px' }} />
            {isFetching && <Loading isLoading />}
          </>
        )}
      </ListWrapper>
    </>
  )
}

export default Followers

const ItemWrapper = styled.div`
  ${flexRowCenter}
  justify-content: space-between;
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0 80px 0;
  flex: 1;
`

const ContentHeaderWrapper = styled.div`
  margin-top: 20px;
`
